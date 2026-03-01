-- ============================================================================
-- HRMS Database Schema (PostgreSQL) — REVISED (Strictly-Typed Reference Tables)
-- ============================================================================
-- Design principles:
--   1. Full FEAT/UC coverage (FEAT 1.1–11.2, UC 5.1–5.41)
--   2. Every enum domain has a dedicated ref_* table with hardcoded seed data.
--      Columns reference these tables via FK, giving strict type safety at the
--      DB level.  Ref tables use code (varchar) as PK so the FK value in the
--      referencing column is human-readable — no JOINs needed for display.
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
--  SECTION 0 — REFERENCE / ENUM TABLES  (one per domain, strictly typed)
-- ############################################################################
--  These are APPLICATION-INTERNAL constants — pre-seeded at deployment time.
--  No use case (UC) exists for runtime management of these tables.
--  Values are hardcoded and NOT configurable by any user role (ADMIN/TCCB/TCKT).
--  Changes require a migration / code deployment.
--
--  For TCCB-configurable catalogs, see Sections 4, 5, 9, and 12a instead:
--    salary_grades / salary_grade_steps  → UC 5.12–5.15
--    allowance_types                     → UC 5.16–5.18
--    contract_types                      → UC 5.19–5.21
--    training_course_types               → UC 5.33 (inline)
-- ############################################################################
-- Pattern:  code varchar PK  |  label varchar  |  sort_order int
-- Every column that was formerly "catalog: …" now has a real FK to its ref_*.

-- ---------------------------------------------------------------------------
-- 0.1  Giới tính
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_genders (
  code varchar(10) PRIMARY KEY,
  label varchar(50) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_genders (code, label, sort_order) VALUES
  ('NAM',  'Nam',  1),
  ('NU',   'Nữ',   2),
  ('KHAC', 'Khác', 3)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.2  Trạng thái làm việc của nhân sự
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_work_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_work_statuses (code, label, sort_order) VALUES
  ('pending',    'Đang chờ xét',  1),
  ('working',    'Đang công tác',  2),
  ('terminated', 'Đã thôi việc',   3)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.3  Trạng thái hợp đồng (trên hồ sơ nhân sự)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_contract_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_contract_statuses (code, label, sort_order) VALUES
  ('none',         'Chưa hợp đồng',   1),
  ('valid',        'Còn hiệu lực',     2),
  ('expired',      'Hết hiệu lực',     3),
  ('renewal_wait', 'Chờ gia hạn',      4)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.4  Loại đơn vị tổ chức
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_org_unit_types (
  code varchar(30) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_org_unit_types (code, label, sort_order) VALUES
  ('HOI_DONG',          'Hội đồng',          1),
  ('BAN',               'Ban',                2),
  ('KHOA',              'Khoa',               3),
  ('PHONG',             'Phòng',              4),
  ('BO_MON',            'Bộ môn',             5),
  ('PHONG_THI_NGHIEM',  'Phòng thí nghiệm',  6),
  ('TRUNG_TAM',         'Trung tâm',          7)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.5  Trạng thái đơn vị tổ chức
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_org_unit_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_org_unit_statuses (code, label, sort_order) VALUES
  ('active',    'Đang hoạt động', 1),
  ('merged',    'Đã sáp nhập',    2),
  ('dissolved', 'Đã giải thể',    3)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.6  Loại sự kiện trạng thái đơn vị
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_org_event_types (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_org_event_types (code, label, sort_order) VALUES
  ('DISSOLVE', 'Giải thể',   1),
  ('MERGE',    'Sáp nhập',   2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.7  Lý do sự kiện đơn vị
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_org_event_reasons (
  code varchar(30) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_org_event_reasons (code, label, sort_order) VALUES
  ('GIAI_THE',    'Giải thể',     1),
  ('SAP_NHAP',    'Sáp nhập',     2),
  ('TAI_CO_CAU',  'Tái cơ cấu',   3),
  ('KHAC',        'Khác',          4)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.8  Quan hệ gia đình
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_family_relations (
  code varchar(30) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_family_relations (code, label, sort_order) VALUES
  ('CHA',              'Cha',               1),
  ('ME',               'Mẹ',               2),
  ('VO_CHONG',         'Vợ/Chồng',         3),
  ('CON',              'Con',               4),
  ('NGUOI_PHU_THUOC',  'Người phụ thuộc',   5),
  ('KHAC',             'Khác',              6)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.9  Loại tổ chức Đảng/Đoàn
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_party_org_types (
  code varchar(10) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_party_org_types (code, label, sort_order) VALUES
  ('DOAN', 'Đoàn',  1),
  ('DANG', 'Đảng',  2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.10  Loại đánh giá (khen thưởng / kỷ luật)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_eval_types (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_eval_types (code, label, sort_order) VALUES
  ('REWARD',     'Khen thưởng', 1),
  ('DISCIPLINE', 'Kỷ luật',     2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.11  Loại sự kiện bổ nhiệm
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_assignment_event_types (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_assignment_event_types (code, label, sort_order) VALUES
  ('APPOINT', 'Bổ nhiệm',   1),
  ('DISMISS', 'Bãi nhiệm',  2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.12  Trình độ văn hóa
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_education_levels (
  code varchar(50) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_education_levels (code, label, sort_order) VALUES
  ('THCS',       'Trung học cơ sở',    1),
  ('THPT',       'Trung học phổ thông', 2),
  ('TRUNG_CAP',  'Trung cấp',          3),
  ('CAO_DANG',   'Cao đẳng',           4),
  ('DAI_HOC',    'Đại học',            5),
  ('THAC_SI',    'Thạc sĩ',           6),
  ('TIEN_SI',    'Tiến sĩ',           7)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.13  Trình độ đào tạo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_training_levels (
  code varchar(50) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_training_levels (code, label, sort_order) VALUES
  ('SO_CAP',     'Sơ cấp',             1),
  ('TRUNG_CAP',  'Trung cấp',          2),
  ('CAO_DANG',   'Cao đẳng',           3),
  ('DAI_HOC',    'Đại học',            4),
  ('THAC_SI',    'Thạc sĩ',           5),
  ('TIEN_SI',    'Tiến sĩ',           6),
  ('TSKH',       'Tiến sĩ khoa học',   7)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.14  Chức danh nghề nghiệp
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_academic_titles (
  code varchar(50) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_academic_titles (code, label, sort_order) VALUES
  ('GIANG_VIEN',        'Giảng viên',           1),
  ('GIANG_VIEN_CHINH',  'Giảng viên chính',     2),
  ('GIANG_VIEN_CC',     'Giảng viên cao cấp',   3),
  ('TRO_GIANG',         'Trợ giảng',            4),
  ('NGHIEN_CUU_VIEN',   'Nghiên cứu viên',      5),
  ('CHUYEN_VIEN',       'Chuyên viên',           6),
  ('CHUYEN_VIEN_CHINH', 'Chuyên viên chính',     7),
  ('KY_THUAT_VIEN',     'Kỹ thuật viên',         8)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.15  Chức danh khoa học (Học hàm)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_academic_ranks (
  code varchar(50) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_academic_ranks (code, label, sort_order) VALUES
  ('GS',  'Giáo sư',       1),
  ('PGS', 'Phó Giáo sư',   2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.16  Trạng thái tài liệu hợp đồng
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_contract_doc_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_contract_doc_statuses (code, label, sort_order) VALUES
  ('draft',      'Nháp',           1),
  ('valid',      'Đang hiệu lực', 2),
  ('expired',    'Hết hiệu lực',  3),
  ('terminated', 'Đã chấm dứt',   4)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.17  Trạng thái khóa đào tạo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_training_statuses (
  code varchar(30) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_training_statuses (code, label, sort_order) VALUES
  ('draft',             'Nháp',              1),
  ('open_registration', 'Mở đăng ký',       2),
  ('in_progress',       'Đang diễn ra',      3),
  ('completed',         'Đã hoàn thành',     4),
  ('closed',            'Đã đóng',           5)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.18  Trạng thái tham gia khóa đào tạo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_participation_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_participation_statuses (code, label, sort_order) VALUES
  ('registered', 'Đã đăng ký',   1),
  ('learning',   'Đang học',      2),
  ('completed',  'Hoàn thành',    3),
  ('failed',     'Không đạt',     4)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.19  Kết quả đào tạo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_result_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_result_statuses (code, label, sort_order) VALUES
  ('completed', 'Hoàn thành',  1),
  ('failed',    'Không đạt',   2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.20  Trạng thái tài khoản
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_auth_user_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_auth_user_statuses (code, label, sort_order) VALUES
  ('active', 'Đang hoạt động', 1),
  ('locked', 'Đã khóa',        2)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 0.21  Trạng thái danh mục cấu hình (dùng chung cho salary_grades,
--        salary_grade_steps, allowance_types, contract_types, training_course_types)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ref_catalog_statuses (
  code varchar(20) PRIMARY KEY,
  label varchar(100) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO ref_catalog_statuses (code, label, sort_order) VALUES
  ('active',   'Đang sử dụng',     1),
  ('inactive', 'Ngừng sử dụng',    2)
ON CONFLICT (code) DO NOTHING;


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
  unit_type varchar(30) NOT NULL
      REFERENCES ref_org_unit_types(code),

  founded_on date,
  address text,
  office_address text,
  email varchar(255),
  phone varchar(30),
  website text,

  is_leaf_confirmed boolean NOT NULL DEFAULT false,

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_org_unit_statuses(code),
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

  event_type varchar(20) NOT NULL
      REFERENCES ref_org_event_types(code),
  effective_on date NOT NULL,

  decision_no varchar(50),
  decision_on date,
  decision_file_id uuid REFERENCES files(id) ON DELETE SET NULL,

  reason varchar(30) NOT NULL
      REFERENCES ref_org_event_reasons(code),
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

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_catalog_statuses(code),
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

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_catalog_statuses(code),
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

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_catalog_statuses(code),
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
  gender varchar(10) NOT NULL
      REFERENCES ref_genders(code),

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
  education_level varchar(50)
      REFERENCES ref_education_levels(code),
  training_level varchar(50)
      REFERENCES ref_training_levels(code),
  academic_title varchar(50)
      REFERENCES ref_academic_titles(code),
  academic_rank varchar(50)
      REFERENCES ref_academic_ranks(code),

  work_status varchar(20) NOT NULL DEFAULT 'pending'
      REFERENCES ref_work_statuses(code),
  contract_status varchar(20) NOT NULL DEFAULT 'none'
      REFERENCES ref_contract_statuses(code),

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

  event_type varchar(20) NOT NULL DEFAULT 'APPOINT'
      REFERENCES ref_assignment_event_types(code),

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

  relation varchar(30) NOT NULL
      REFERENCES ref_family_relations(code),

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

  organization_type varchar(10) NOT NULL
      REFERENCES ref_party_org_types(code),

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

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_catalog_statuses(code),
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

  renewal_count int NOT NULL DEFAULT 0,
  previous_contract_id uuid REFERENCES employment_contracts(id) ON DELETE SET NULL,

  status varchar(20) NOT NULL DEFAULT 'valid'
      REFERENCES ref_contract_doc_statuses(code),
  content_html text,
  contract_file_id uuid REFERENCES files(id) ON DELETE SET NULL,

  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contract_dates_chk CHECK (effective_to >= effective_from),
  CONSTRAINT contract_no_unique UNIQUE (contract_no),
  CONSTRAINT contract_renewal_count_chk CHECK (renewal_count >= 0)
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

  eval_type varchar(20) NOT NULL
      REFERENCES ref_eval_types(code),

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

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_catalog_statuses(code),
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

  status varchar(30) NOT NULL DEFAULT 'draft'
      REFERENCES ref_training_statuses(code),

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

  participation_status varchar(20) NOT NULL DEFAULT 'registered'
      REFERENCES ref_participation_statuses(code),

  CONSTRAINT training_reg_unique UNIQUE (course_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_training_registrations_employee ON training_registrations(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_registrations_course ON training_registrations(course_id);

-- 12d. Training results (UC 5.36)
CREATE TABLE IF NOT EXISTS training_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL UNIQUE REFERENCES training_registrations(id) ON DELETE CASCADE,

  result_status varchar(20) NOT NULL
      REFERENCES ref_result_statuses(code),

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

  status varchar(20) NOT NULL DEFAULT 'active'
      REFERENCES ref_auth_user_statuses(code),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_auth_users_employee_id ON auth_users(employee_id);
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

-- User ↔ Role (many-to-many)
CREATE TABLE IF NOT EXISTS auth_user_roles (
  user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES auth_roles(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now(),
  granted_by_user_id uuid REFERENCES auth_users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, role_id)
);

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