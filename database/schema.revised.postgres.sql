-- ============================================================================
-- HRMS Database Schema (PostgreSQL) — REVISED
-- ============================================================================
-- Design principles:
--   1. Full FEAT/UC coverage (FEAT 1.1–11.2, UC 5.1–5.41)
--   2. Enum domains are defined as TypeScript constants in
--      packages/shared/src/constants/enums.ts — validated at the API boundary
--      via Zod schemas.  Columns store human-readable varchar codes.
--   3. No generic catalog — admins cannot invent new enum values at runtime.
--   4. Improve audit/history support for reporting (FEAT 9.1).
--
--  CONFIGURABLE CATALOGS (TCCB-managed at runtime):
--  ┌──────────────────────────┬──────────────────────────────────────────────┐
--  │ Table                    │ Use Cases                                    │
--  ├──────────────────────────┼──────────────────────────────────────────────┤
--  │ salary_grades            │ UC 5.12 (Thêm), UC 5.13 (Sửa)              │
--  │ salary_grade_steps       │ UC 5.12–5.13 (CRUD), UC 5.14 (Xóa),        │
--  │                          │ UC 5.15 (Ngừng sử dụng)                     │
--  │ allowance_types          │ UC 5.16 (Thêm), UC 5.17 (Sửa),             │
--  │                          │ UC 5.18 (Ngừng sử dụng)                     │
--  │ contract_types           │ UC 5.19 (Thêm), UC 5.20 (Sửa),             │
--  │                          │ UC 5.21 (Ngừng sử dụng)                     │
--  │ training_course_types    │ UC 5.33 step 4 (inline config, no own UC)   │
--  └──────────────────────────┴──────────────────────────────────────────────┘
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ############################################################################
--  SECTION 0 — ENUM DOMAIN REFERENCE  (application constants)
-- ############################################################################
--  These enum domains are NO LONGER stored as database tables.
--  They are defined as TypeScript constants in:
--    packages/shared/src/constants/enums.ts
--
--  Validation is enforced at the API boundary via Zod schemas (to be created
--  in packages/shared/src/validators/).  Drizzle schema columns use
--  .$type<XxxCode>() for compile-time type safety.
--
--  IMPORTANT: If you add/remove enum values, you MUST also update enums.ts.
--
--  Domain                          Valid codes
--  ──────────────────────────────  ─────────────────────────────────────────
--  0.1  Giới tính                  NAM, NU, KHAC
--  0.2  Trạng thái làm việc        pending, working, terminated
--  0.3  Trạng thái HĐ (hồ sơ)     none, valid, expired, renewal_wait
--  0.4  Loại đơn vị tổ chức        HOI_DONG, BAN, KHOA, PHONG, BO_MON,
--                                   PHONG_THI_NGHIEM, TRUNG_TAM
--  0.5  Trạng thái đơn vị          active, merged, dissolved
--  0.6  Loại sự kiện đơn vị        DISSOLVE, MERGE
--  0.7  Lý do sự kiện đơn vị       GIAI_THE, SAP_NHAP, TAI_CO_CAU, KHAC
--  0.8  Quan hệ gia đình           CHA, ME, VO_CHONG, CON,
--                                   NGUOI_PHU_THUOC, KHAC
--  0.9  Loại tổ chức Đảng/Đoàn     DOAN, DANG
--  0.10 Loại đánh giá              REWARD, DISCIPLINE
--  0.11 Loại sự kiện bổ nhiệm      APPOINT, DISMISS
--  0.12 Trình độ văn hóa           THCS, THPT, TRUNG_CAP, CAO_DANG,
--                                   DAI_HOC, THAC_SI, TIEN_SI
--  0.13 Trình độ đào tạo           SO_CAP, TRUNG_CAP, CAO_DANG, DAI_HOC,
--                                   THAC_SI, TIEN_SI, TSKH
--  0.14 Chức danh nghề nghiệp      GIANG_VIEN, GIANG_VIEN_CHINH,
--                                   GIANG_VIEN_CC, TRO_GIANG,
--                                   NGHIEN_CUU_VIEN, CHUYEN_VIEN,
--                                   CHUYEN_VIEN_CHINH, KY_THUAT_VIEN
--  0.15 Học hàm                    GS, PGS
--  0.16 Trạng thái tài liệu HĐ    draft, valid, expired, terminated
--  0.17 Trạng thái khóa đào tạo    draft, open_registration, in_progress,
--                                   completed, closed
--  0.18 Trạng thái tham gia ĐT     registered, learning, completed, failed
--  0.19 Kết quả đào tạo            completed, failed
--  0.20 Trạng thái tài khoản       active, locked
--  0.21 Trạng thái danh mục        active, inactive
--
--  For TCCB-configurable catalogs (runtime-managed), see DB tables:
--    salary_grades / salary_grade_steps  → UC 5.12–5.15
--    allowance_types                     → UC 5.16–5.18
--    contract_types                      → UC 5.19–5.21
--    training_course_types               → UC 5.33 (inline)
-- ############################################################################
-- ############################################################################
--  SECTION 1 — FILES
-- ############################################################################
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  original_name text NOT NULL,
  mime_type text,
  byte_size bigint CHECK (byte_size IS NULL OR byte_size >= 0),
  sha256 char(64),
  uploaded_by_user_id uuid,   -- FK added after auth_users is created
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- ############################################################################
--  SECTION 2 — CAMPUSES
-- ############################################################################
CREATE TABLE IF NOT EXISTS campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_code varchar(50) NOT NULL UNIQUE,
  campus_name varchar(255) NOT NULL,
  address text,
  phone varchar(30),
  email varchar(255),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ############################################################################
--  SECTION 3 — ORGANIZATION UNITS  (FEAT 3.1–3.7, UC 5.9–5.11, 5.32, 5.39)
-- ############################################################################
CREATE TABLE IF NOT EXISTS org_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id uuid NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  parent_id uuid REFERENCES org_units(id) ON DELETE RESTRICT,

  unit_code varchar(50) NOT NULL UNIQUE,
  unit_name varchar(255) NOT NULL,
  unit_type varchar(30) NOT NULL,  -- validated by Zod: OrgUnitTypeCode

  founded_on date,
  address text,
  office_address text,
  email varchar(255),
  phone varchar(30),
  website text,

  is_leaf_confirmed boolean NOT NULL DEFAULT false,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: OrgUnitStatusCode
  status_updated_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_org_units_parent_id ON org_units(parent_id);
CREATE INDEX IF NOT EXISTS idx_org_units_campus_id ON org_units(campus_id);
CREATE INDEX IF NOT EXISTS idx_org_units_status ON org_units(status);

-- History of status changes (giải thể/sáp nhập) — UC 5.11
CREATE TABLE IF NOT EXISTS org_unit_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_unit_id uuid NOT NULL REFERENCES org_units(id) ON DELETE CASCADE,

  event_type varchar(20) NOT NULL,  -- validated by Zod: OrgEventTypeCode
  effective_on date NOT NULL,

  decision_no varchar(50),
  decision_on date,
  decision_file_id uuid REFERENCES files(id) ON DELETE SET NULL,

  reason varchar(30) NOT NULL,  -- validated by Zod: OrgEventReasonCode
  note text,

  merged_into_org_unit_id uuid REFERENCES org_units(id) ON DELETE RESTRICT,

  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- If MERGE, target unit is required; if DISSOLVE, must be NULL
  CONSTRAINT org_unit_merge_target_chk CHECK (
    (event_type = 'MERGE'    AND merged_into_org_unit_id IS NOT NULL) OR
    (event_type = 'DISSOLVE' AND merged_into_org_unit_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_org_unit_status_events_unit ON org_unit_status_events(org_unit_id);
CREATE INDEX IF NOT EXISTS idx_org_unit_status_events_effective ON org_unit_status_events(effective_on);

-- ############################################################################
--  SECTION 4 — SALARY GRADE & STEP CATALOG  (FEAT 8.1–8.4)
--    Configurable by TCCB:
--      UC 5.12 — Thêm mới danh mục hệ số lương
--      UC 5.13 — Sửa danh mục hệ số lương
--      UC 5.14 — Xóa danh mục hệ số lương
--      UC 5.15 — Ngừng sử dụng danh mục hệ số lương
-- ############################################################################

-- 4a. Salary Grades (Ngạch viên chức)  — UC 5.12 create, UC 5.13 edit
CREATE TABLE IF NOT EXISTS salary_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_code varchar(50) NOT NULL UNIQUE,
  grade_name varchar(255) NOT NULL,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: CatalogStatusCode
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_salary_grades_status ON salary_grades(status);

-- 4b. Salary Grade Steps (Bậc lương)  — UC 5.12 create, UC 5.13 edit, UC 5.14 delete, UC 5.15 deactivate
CREATE TABLE IF NOT EXISTS salary_grade_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salary_grade_id uuid NOT NULL
      REFERENCES salary_grades(id) ON DELETE CASCADE,

  step_no int NOT NULL,
  coefficient numeric(8,3) NOT NULL,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: CatalogStatusCode
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT salary_step_positive_chk CHECK (step_no > 0),
  CONSTRAINT salary_coefficient_nonneg_chk CHECK (coefficient >= 0),
  CONSTRAINT salary_unique_grade_step UNIQUE (salary_grade_id, step_no)
);

CREATE INDEX IF NOT EXISTS idx_salary_grade_steps_grade ON salary_grade_steps(salary_grade_id);
CREATE INDEX IF NOT EXISTS idx_salary_grade_steps_status ON salary_grade_steps(status);

-- ############################################################################
--  SECTION 5 — ALLOWANCE TYPES  (FEAT 8.5–8.7)
--    Configurable by TCCB:
--      UC 5.16 — Thêm mới danh mục loại phụ cấp
--      UC 5.17 — Sửa danh mục loại phụ cấp
--      UC 5.18 — Ngừng sử dụng danh mục loại phụ cấp
-- ############################################################################
CREATE TABLE IF NOT EXISTS allowance_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  allowance_name varchar(200) NOT NULL,
  description text,
  calc_method text,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: CatalogStatusCode
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT allowance_name_unique UNIQUE (allowance_name)
);

-- ############################################################################
--  SECTION 6 — EMPLOYEES  (FEAT 6.1–6.8, UC 5.23–5.28)
-- ############################################################################
CREATE SEQUENCE IF NOT EXISTS employee_staff_code_seq;

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  staff_code varchar(30) NOT NULL UNIQUE
      DEFAULT nextval('employee_staff_code_seq')::text,

  full_name varchar(255) NOT NULL,
  dob date NOT NULL,
  gender varchar(10) NOT NULL,  -- validated by Zod: GenderCode

  national_id varchar(20) NOT NULL UNIQUE,
  hometown text,
  address text NOT NULL,

  tax_code varchar(30),
  social_insurance_no varchar(30),
  health_insurance_no varchar(30),

  email varchar(255) NOT NULL,
  phone varchar(30) NOT NULL,

  is_foreigner boolean NOT NULL DEFAULT false,

  -- Academic qualifications (UC 5.24 filter, UC 5.25 create)
  education_level varchar(50),  -- validated by Zod: EducationLevelCode
  training_level varchar(50),  -- validated by Zod: TrainingLevelCode
  academic_title varchar(50),  -- validated by Zod: AcademicTitleCode
  academic_rank varchar(50),  -- validated by Zod: AcademicRankCode

  work_status varchar(20) NOT NULL DEFAULT 'pending',  -- validated by Zod: WorkStatusCode
  contract_status varchar(20) NOT NULL DEFAULT 'none',  -- validated by Zod: ContractStatusCode

  current_org_unit_id uuid REFERENCES org_units(id) ON DELETE SET NULL,
  current_position_title varchar(255),

  salary_grade_step_id uuid REFERENCES salary_grade_steps(id) ON DELETE SET NULL,
  portrait_file_id uuid REFERENCES files(id) ON DELETE SET NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_full_name ON employees USING gin (full_name gin_trgm_ops);
-- NOTE: requires  CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Fallback:  CREATE INDEX idx_employees_full_name ON employees(full_name);
CREATE INDEX IF NOT EXISTS idx_employees_staff_code ON employees(staff_code);
CREATE INDEX IF NOT EXISTS idx_employees_national_id ON employees(national_id);
CREATE INDEX IF NOT EXISTS idx_employees_current_org_unit ON employees(current_org_unit_id);
CREATE INDEX IF NOT EXISTS idx_employees_work_status ON employees(work_status);
CREATE INDEX IF NOT EXISTS idx_employees_contract_status ON employees(contract_status);
CREATE INDEX IF NOT EXISTS idx_employees_gender ON employees(gender);

-- ############################################################################
--  SECTION 6a — EMPLOYEE TERMINATIONS  (FEAT 6.5–6.6, UC 5.27)
-- ############################################################################
CREATE TABLE IF NOT EXISTS employee_terminations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  terminated_on date NOT NULL,
  reason text NOT NULL,
  is_auto boolean NOT NULL DEFAULT false,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employee_terminations_employee ON employee_terminations(employee_id);

-- ############################################################################
--  SECTION 6b — ASSIGNMENT HISTORY  (FEAT 3.5–3.6, UC 5.30–5.31)
-- ############################################################################
CREATE TABLE IF NOT EXISTS employee_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  org_unit_id uuid NOT NULL REFERENCES org_units(id) ON DELETE RESTRICT,
  position_title varchar(255),

  event_type varchar(20) NOT NULL DEFAULT 'APPOINT',  -- validated by Zod: AssignmentEventTypeCode

  started_on date NOT NULL,
  ended_on date,
  note text,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT assignment_date_order_chk CHECK (ended_on IS NULL OR ended_on >= started_on)
);

CREATE INDEX IF NOT EXISTS idx_employee_assignments_employee ON employee_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_assignments_org_unit ON employee_assignments(org_unit_id);
CREATE INDEX IF NOT EXISTS idx_employee_assignments_event_type ON employee_assignments(event_type);

-- ############################################################################
--  SECTION 7 — EMPLOYEE SUB-ENTITIES  (UC 5.25/5.26/5.28)
-- ############################################################################

-- 7a. Family members
CREATE TABLE IF NOT EXISTS employee_family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

  relation varchar(30) NOT NULL,  -- validated by Zod: FamilyRelationCode

  full_name varchar(255) NOT NULL,
  dob date,
  phone varchar(30),
  note text,
  is_dependent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employee_family_members_emp ON employee_family_members(employee_id);

-- 7b. Bank accounts
CREATE TABLE IF NOT EXISTS employee_bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  bank_name varchar(255) NOT NULL,
  account_no varchar(50) NOT NULL,
  is_primary boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT employee_bank_unique UNIQUE (employee_id, account_no)
);

-- 7c. Previous jobs
CREATE TABLE IF NOT EXISTS employee_previous_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  workplace varchar(255) NOT NULL,
  started_on date,
  ended_on date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT prev_job_date_order_chk CHECK (ended_on IS NULL OR started_on IS NULL OR ended_on >= started_on)
);

-- 7d. Party memberships (Đảng/Đoàn)
CREATE TABLE IF NOT EXISTS employee_party_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

  organization_type varchar(10) NOT NULL,  -- validated by Zod: PartyOrgTypeCode

  joined_on date,
  details text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7e. Degrees (bằng cấp)
CREATE TABLE IF NOT EXISTS employee_degrees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  degree_name varchar(255) NOT NULL,
  school varchar(255) NOT NULL,
  major varchar(255),
  graduation_year int,
  classification varchar(100),
  degree_file_id uuid REFERENCES files(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT graduation_year_chk CHECK (graduation_year IS NULL OR graduation_year >= 1900)
);

-- 7f. Certifications (chứng chỉ)
CREATE TABLE IF NOT EXISTS employee_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  cert_name varchar(255) NOT NULL,
  issued_by varchar(255),
  issued_on date,
  expires_on date,
  cert_file_id uuid REFERENCES files(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cert_date_order_chk CHECK (expires_on IS NULL OR issued_on IS NULL OR expires_on >= issued_on)
);

-- 7g. Foreign work permits
CREATE TABLE IF NOT EXISTS employee_foreign_work_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  visa_no varchar(50),
  visa_expires_on date,
  passport_no varchar(50),
  passport_expires_on date,
  work_permit_no varchar(50),
  work_permit_expires_on date,
  work_permit_file_id uuid REFERENCES files(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ############################################################################
--  SECTION 8 — EMPLOYEE ALLOWANCES  (FEAT 8.5–8.7, UC 5.25/5.26)
-- ############################################################################
CREATE TABLE IF NOT EXISTS employee_allowances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  allowance_type_id uuid NOT NULL REFERENCES allowance_types(id) ON DELETE RESTRICT,
  amount numeric(14,2),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT allowance_amount_nonneg_chk CHECK (amount IS NULL OR amount >= 0),
  CONSTRAINT employee_allowance_unique UNIQUE (employee_id, allowance_type_id)
);

-- ############################################################################
--  SECTION 9 — CONTRACT TYPES  (FEAT 8.8–8.10)
--    Configurable by TCCB:
--      UC 5.19 — Thêm mới danh mục loại hợp đồng
--      UC 5.20 — Sửa danh mục loại hợp đồng
--      UC 5.21 — Ngừng sử dụng danh mục loại hợp đồng
-- ############################################################################
CREATE TABLE IF NOT EXISTS contract_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_type_name varchar(255) NOT NULL UNIQUE,
  min_months int NOT NULL,
  max_months int NOT NULL,
  max_renewals int NOT NULL,
  renewal_grace_days int NOT NULL,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: CatalogStatusCode
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contract_months_chk CHECK (min_months > 0 AND max_months >= min_months),
  CONSTRAINT contract_renewals_chk CHECK (max_renewals >= 0 AND renewal_grace_days >= 0)
);

-- ############################################################################
--  SECTION 10 — EMPLOYMENT CONTRACTS  (FEAT 4.1, UC 5.22)
-- ############################################################################
CREATE TABLE IF NOT EXISTS employment_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  contract_type_id uuid NOT NULL REFERENCES contract_types(id) ON DELETE RESTRICT,

  contract_no varchar(50) NOT NULL,
  signed_on date NOT NULL,
  effective_from date NOT NULL,
  effective_to date NOT NULL,

  org_unit_id uuid NOT NULL REFERENCES org_units(id) ON DELETE RESTRICT,

  status varchar(20) NOT NULL DEFAULT 'valid',  -- validated by Zod: ContractDocStatusCode
  content_html text,
  contract_file_id uuid REFERENCES files(id) ON DELETE SET NULL,

  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contract_dates_chk CHECK (effective_to >= effective_from),
  CONSTRAINT contract_no_unique UNIQUE (contract_no)
);

CREATE INDEX IF NOT EXISTS idx_employment_contracts_employee ON employment_contracts(employee_id);
CREATE INDEX IF NOT EXISTS idx_employment_contracts_type ON employment_contracts(contract_type_id);
CREATE INDEX IF NOT EXISTS idx_employment_contracts_org_unit ON employment_contracts(org_unit_id);
CREATE INDEX IF NOT EXISTS idx_employment_contracts_status ON employment_contracts(status);
CREATE INDEX IF NOT EXISTS idx_employment_contracts_effective ON employment_contracts(effective_from, effective_to);

-- Contract appendices (UC 5.26)
CREATE TABLE IF NOT EXISTS contract_appendices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES employment_contracts(id) ON DELETE CASCADE,
  appendix_no varchar(50),
  effective_on date NOT NULL,
  terms text NOT NULL,
  notes text,
  appendix_file_id uuid REFERENCES files(id) ON DELETE SET NULL,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contract_appendices_contract ON contract_appendices(contract_id);

-- ############################################################################
--  SECTION 11 — EVALUATIONS  (FEAT 5.1, UC 5.29, UC 5.26)
-- ############################################################################
CREATE TABLE IF NOT EXISTS employee_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

  eval_type varchar(20) NOT NULL,  -- validated by Zod: EvalTypeCode

  -- Reward fields
  reward_type varchar(255),
  reward_name varchar(255),
  decision_on date,
  decision_no varchar(50),
  content text,
  reward_amount numeric(14,2),

  -- Discipline fields
  discipline_type varchar(255),
  discipline_name varchar(255),
  reason text,
  action_form varchar(255),

  -- Visibility control (UC 5.26 step 3.2)
  is_active boolean NOT NULL DEFAULT true,
  visible_to_employee boolean NOT NULL DEFAULT true,
  visible_to_tckt boolean NOT NULL DEFAULT true,

  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT eval_reward_amount_chk CHECK (reward_amount IS NULL OR reward_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_employee_evaluations_employee ON employee_evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_evaluations_type ON employee_evaluations(eval_type);

-- ############################################################################
--  SECTION 12 — TRAINING  (FEAT 7.1–7.4, 11.1–11.2, UC 5.33–5.36, 5.40–5.41)
-- ############################################################################

-- 12a. Course type catalog  — Referenced in UC 5.33 step 4 as "Loại khóa đào tạo (theo cấu hình)"
--       No dedicated CRUD UCs; managed as part of training configuration by TCCB
CREATE TABLE IF NOT EXISTS training_course_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_name varchar(255) NOT NULL UNIQUE,
  description text,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: CatalogStatusCode
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 12b. Training courses
CREATE TABLE IF NOT EXISTS training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name varchar(255) NOT NULL,
  course_type_id uuid NOT NULL REFERENCES training_course_types(id) ON DELETE RESTRICT,

  training_from date NOT NULL,
  training_to date NOT NULL,
  location varchar(255),
  cost numeric(14,2),
  commitment text,

  certificate_name varchar(255),
  certificate_type varchar(255),

  registration_from date,
  registration_to date,
  registration_limit int,

  status varchar(30) NOT NULL DEFAULT 'draft',  -- validated by Zod: TrainingStatusCode

  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT training_dates_chk CHECK (training_to >= training_from),
  CONSTRAINT registration_dates_chk CHECK (
    registration_to IS NULL OR registration_from IS NULL
    OR registration_to >= registration_from
  ),
  CONSTRAINT registration_limit_chk CHECK (registration_limit IS NULL OR registration_limit > 0),
  CONSTRAINT training_cost_chk CHECK (cost IS NULL OR cost >= 0)
);

CREATE INDEX IF NOT EXISTS idx_training_courses_type ON training_courses(course_type_id);
CREATE INDEX IF NOT EXISTS idx_training_courses_status ON training_courses(status);
CREATE INDEX IF NOT EXISTS idx_training_courses_registration ON training_courses(registration_from, registration_to);

-- 12c. Registrations
CREATE TABLE IF NOT EXISTS training_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

  registered_at timestamptz NOT NULL DEFAULT now(),

  participation_status varchar(20) NOT NULL DEFAULT 'registered',  -- validated by Zod: ParticipationStatusCode

  CONSTRAINT training_reg_unique UNIQUE (course_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_training_registrations_employee ON training_registrations(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_registrations_course ON training_registrations(course_id);

-- 12d. Training results (UC 5.36)
CREATE TABLE IF NOT EXISTS training_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL UNIQUE REFERENCES training_registrations(id) ON DELETE CASCADE,

  result_status varchar(20) NOT NULL,  -- validated by Zod: ResultStatusCode

  completed_on date,
  certificate_file_id uuid REFERENCES files(id) ON DELETE SET NULL,
  note text,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ############################################################################
--  SECTION 13 — AUTH: USERS / ROLES  (FEAT 1.1–1.4, 2.1–2.5, UC 5.1–5.8)
-- ############################################################################

CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(50) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name varchar(255) NOT NULL,
  email varchar(255) UNIQUE,

  employee_id uuid UNIQUE REFERENCES employees(id) ON DELETE SET NULL,

  role_id uuid NOT NULL REFERENCES auth_roles(id) ON DELETE RESTRICT,

  status varchar(20) NOT NULL DEFAULT 'active',  -- validated by Zod: AuthUserStatusCode
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_auth_users_employee_id ON auth_users(employee_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_role_id ON auth_users(role_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_status ON auth_users(status);

-- Deferred FK: files.uploaded_by_user_id → auth_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'files_uploaded_by_user_fk'
  ) THEN
    ALTER TABLE files
      ADD CONSTRAINT files_uploaded_by_user_fk
      FOREIGN KEY (uploaded_by_user_id) REFERENCES auth_users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Roles
CREATE TABLE IF NOT EXISTS auth_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code varchar(30) NOT NULL UNIQUE,
  role_name varchar(255) NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed system roles
INSERT INTO auth_roles (role_code, role_name, description, is_system) VALUES
  ('ADMIN',    'Quản trị viên',                   'Quản lý tài khoản, cơ cấu tổ chức',               true),
  ('TCCB',     'Phòng Tổ chức Cán bộ',            'Quản lý hồ sơ, hợp đồng, đào tạo, cấu hình',      true),
  ('TCKT',     'Phòng Tài chính Kế toán',         'Xem hồ sơ, thống kê',                              true),
  ('EMPLOYEE', 'Cán bộ / Giảng viên / Nhân viên', 'Xem hồ sơ cá nhân, đăng ký đào tạo',               true)
ON CONFLICT (role_code) DO NOTHING;

-- User ↔ Role: each user has exactly one role (via auth_users.role_id)

-- ############################################################################
--  SECTION 14 — BETTER-AUTH MANAGED TABLES  (FEAT 1.1–1.3, UC 5.1–5.2)
-- ############################################################################

CREATE TABLE IF NOT EXISTS "session" (
  id text PRIMARY KEY,
  "expiresAt" timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_session_user ON "session"("userId");
CREATE INDEX IF NOT EXISTS idx_session_token ON "session"(token);
CREATE INDEX IF NOT EXISTS idx_session_expires ON "session"("expiresAt");

CREATE TABLE IF NOT EXISTS "account" (
  id text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  password text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_account_user ON "account"("userId");

CREATE TABLE IF NOT EXISTS "verification" (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- ############################################################################
--  SECTION 15 — AUDIT LOG  (NFR item 8, FEAT 9.1)
-- ############################################################################
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth_users(id) ON DELETE SET NULL,
  action varchar(100) NOT NULL,
  entity_type varchar(100),
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ############################################################################
--  SECTION 16 — REPORTING MATERIALIZED VIEWS  (FEAT 9.1, UC 5.37)
-- ############################################################################

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_headcount_by_org_unit AS
SELECT
  ou.id AS org_unit_id,
  ou.unit_name,
  ou.unit_type,
  c.campus_name,
  COUNT(e.id) FILTER (WHERE e.work_status = 'working')    AS active_count,
  COUNT(e.id) FILTER (WHERE e.work_status = 'terminated')  AS terminated_count,
  COUNT(e.id) FILTER (WHERE e.work_status = 'pending')     AS pending_count,
  COUNT(e.id) AS total_count,
  now() AS refreshed_at
FROM org_units ou
LEFT JOIN campuses c ON c.id = ou.campus_id
LEFT JOIN employees e ON e.current_org_unit_id = ou.id
GROUP BY ou.id, ou.unit_name, ou.unit_type, c.campus_name;

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_employee_turnover AS
SELECT
  date_trunc('month', et.terminated_on) AS month,
  COUNT(*) AS termination_count
FROM employee_terminations et
GROUP BY 1;

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_contract_summary AS
SELECT
  ct.contract_type_name,
  ec.status,
  COUNT(*) AS contract_count
FROM employment_contracts ec
JOIN contract_types ct ON ct.id = ec.contract_type_id
GROUP BY ct.contract_type_name, ec.status;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================