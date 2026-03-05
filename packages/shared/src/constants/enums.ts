// ============================================================================
// HRMS Application Constants — Enum Domains
// ============================================================================
// These constants replace the former Section 0 ref_* tables in the database.
// They are APPLICATION-INTERNAL constants — not configurable at runtime.
// Changes require a code deployment.
//
// VALIDATION STRATEGY:
//   Each enum domain will have a corresponding Zod schema (e.g. genderCodeSchema)
//   in packages/shared/src/validators/ to enforce valid values at the API boundary.
//   The Drizzle schema columns will use .$type<XxxCode>() for compile-time safety.
//
// For TCCB-configurable catalogs (salary_grades, allowance_types, contract_types,
// training_course_types), see the database tables — those remain in PostgreSQL.
// ============================================================================

// ---------------------------------------------------------------------------
// Helper type utilities
// ---------------------------------------------------------------------------
type EnumEntry = { readonly code: string; readonly label: string; readonly sortOrder: number };
type EnumRecord = Record<string, EnumEntry>;

/**
 * Returns a sorted array of entries from an enum constant, ordered by sortOrder.
 * Useful for populating <select> dropdowns and filter lists.
 */
export function enumToSortedList<T extends EnumRecord>(enumObj: T): T[keyof T][] {
  return (Object.values(enumObj) as T[keyof T][]).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

// ---------------------------------------------------------------------------
// 0.1  Giới tính (ref_genders)
// ---------------------------------------------------------------------------
export const Gender = {
  NAM:  { code: 'NAM',  label: 'Nam',  sortOrder: 1 },
  NU:   { code: 'NU',   label: 'Nữ',   sortOrder: 2 },
  KHAC: { code: 'KHAC', label: 'Khác', sortOrder: 3 },
} as const;
export type GenderCode = keyof typeof Gender;
export const GENDER_CODES = Object.keys(Gender) as GenderCode[];

// ---------------------------------------------------------------------------
// 0.2  Trạng thái làm việc của nhân sự (ref_work_statuses)
// ---------------------------------------------------------------------------
export const WorkStatus = {
  pending:    { code: 'pending',    label: 'Đang chờ xét',  sortOrder: 1 },
  working:    { code: 'working',    label: 'Đang công tác', sortOrder: 2 },
  terminated: { code: 'terminated', label: 'Đã thôi việc',  sortOrder: 3 },
} as const;
export type WorkStatusCode = keyof typeof WorkStatus;
export const WORK_STATUS_CODES = Object.keys(WorkStatus) as WorkStatusCode[];

// ---------------------------------------------------------------------------
// 0.3  Trạng thái hợp đồng trên hồ sơ nhân sự (ref_contract_statuses)
// ---------------------------------------------------------------------------
export const ContractStatus = {
  none:         { code: 'none',         label: 'Chưa hợp đồng',  sortOrder: 1 },
  valid:        { code: 'valid',        label: 'Còn hiệu lực',   sortOrder: 2 },
  expired:      { code: 'expired',      label: 'Hết hiệu lực',   sortOrder: 3 },
  renewal_wait: { code: 'renewal_wait', label: 'Chờ gia hạn',    sortOrder: 4 },
} as const;
export type ContractStatusCode = keyof typeof ContractStatus;
export const CONTRACT_STATUS_CODES = Object.keys(ContractStatus) as ContractStatusCode[];

// ---------------------------------------------------------------------------
// 0.4  Loại đơn vị tổ chức (ref_org_unit_types)
// ---------------------------------------------------------------------------
export const OrgUnitType = {
  HOI_DONG:         { code: 'HOI_DONG',         label: 'Hội đồng',         sortOrder: 1 },
  BAN:              { code: 'BAN',              label: 'Ban',              sortOrder: 2 },
  KHOA:             { code: 'KHOA',             label: 'Khoa',             sortOrder: 3 },
  PHONG:            { code: 'PHONG',            label: 'Phòng',            sortOrder: 4 },
  BO_MON:           { code: 'BO_MON',           label: 'Bộ môn',           sortOrder: 5 },
  PHONG_THI_NGHIEM: { code: 'PHONG_THI_NGHIEM', label: 'Phòng thí nghiệm', sortOrder: 6 },
  TRUNG_TAM:        { code: 'TRUNG_TAM',        label: 'Trung tâm',        sortOrder: 7 },
} as const;
export type OrgUnitTypeCode = keyof typeof OrgUnitType;
export const ORG_UNIT_TYPE_CODES = Object.keys(OrgUnitType) as OrgUnitTypeCode[];

// ---------------------------------------------------------------------------
// 0.5  Trạng thái đơn vị tổ chức (ref_org_unit_statuses)
// ---------------------------------------------------------------------------
export const OrgUnitStatus = {
  active:    { code: 'active',    label: 'Đang hoạt động', sortOrder: 1 },
  merged:    { code: 'merged',    label: 'Đã sáp nhập',   sortOrder: 2 },
  dissolved: { code: 'dissolved', label: 'Đã giải thể',   sortOrder: 3 },
} as const;
export type OrgUnitStatusCode = keyof typeof OrgUnitStatus;
export const ORG_UNIT_STATUS_CODES = Object.keys(OrgUnitStatus) as OrgUnitStatusCode[];

// ---------------------------------------------------------------------------
// 0.6  Loại sự kiện trạng thái đơn vị (ref_org_event_types)
// ---------------------------------------------------------------------------
export const OrgEventType = {
  DISSOLVE: { code: 'DISSOLVE', label: 'Giải thể', sortOrder: 1 },
  MERGE:    { code: 'MERGE',    label: 'Sáp nhập', sortOrder: 2 },
} as const;
export type OrgEventTypeCode = keyof typeof OrgEventType;
export const ORG_EVENT_TYPE_CODES = Object.keys(OrgEventType) as OrgEventTypeCode[];

// ---------------------------------------------------------------------------
// 0.7  Lý do sự kiện đơn vị (ref_org_event_reasons)
// ---------------------------------------------------------------------------
export const OrgEventReason = {
  GIAI_THE:   { code: 'GIAI_THE',   label: 'Giải thể',   sortOrder: 1 },
  SAP_NHAP:   { code: 'SAP_NHAP',   label: 'Sáp nhập',   sortOrder: 2 },
  TAI_CO_CAU: { code: 'TAI_CO_CAU', label: 'Tái cơ cấu', sortOrder: 3 },
  KHAC:       { code: 'KHAC',       label: 'Khác',        sortOrder: 4 },
} as const;
export type OrgEventReasonCode = keyof typeof OrgEventReason;
export const ORG_EVENT_REASON_CODES = Object.keys(OrgEventReason) as OrgEventReasonCode[];

// ---------------------------------------------------------------------------
// 0.8  Quan hệ gia đình (ref_family_relations)
// ---------------------------------------------------------------------------
export const FamilyRelation = {
  CHA:             { code: 'CHA',             label: 'Cha',              sortOrder: 1 },
  ME:              { code: 'ME',              label: 'Mẹ',              sortOrder: 2 },
  VO_CHONG:        { code: 'VO_CHONG',        label: 'Vợ/Chồng',       sortOrder: 3 },
  CON:             { code: 'CON',             label: 'Con',              sortOrder: 4 },
  NGUOI_PHU_THUOC: { code: 'NGUOI_PHU_THUOC', label: 'Người phụ thuộc', sortOrder: 5 },
  KHAC:            { code: 'KHAC',            label: 'Khác',            sortOrder: 6 },
} as const;
export type FamilyRelationCode = keyof typeof FamilyRelation;
export const FAMILY_RELATION_CODES = Object.keys(FamilyRelation) as FamilyRelationCode[];

// ---------------------------------------------------------------------------
// 0.9  Loại tổ chức Đảng/Đoàn (ref_party_org_types)
// ---------------------------------------------------------------------------
export const PartyOrgType = {
  DOAN: { code: 'DOAN', label: 'Đoàn', sortOrder: 1 },
  DANG: { code: 'DANG', label: 'Đảng', sortOrder: 2 },
} as const;
export type PartyOrgTypeCode = keyof typeof PartyOrgType;
export const PARTY_ORG_TYPE_CODES = Object.keys(PartyOrgType) as PartyOrgTypeCode[];

// ---------------------------------------------------------------------------
// 0.10  Loại đánh giá — khen thưởng / kỷ luật (ref_eval_types)
// ---------------------------------------------------------------------------
export const EvalType = {
  REWARD:     { code: 'REWARD',     label: 'Khen thưởng', sortOrder: 1 },
  DISCIPLINE: { code: 'DISCIPLINE', label: 'Kỷ luật',     sortOrder: 2 },
} as const;
export type EvalTypeCode = keyof typeof EvalType;
export const EVAL_TYPE_CODES = Object.keys(EvalType) as EvalTypeCode[];

// ---------------------------------------------------------------------------
// 0.11  Loại sự kiện bổ nhiệm (ref_assignment_event_types)
// ---------------------------------------------------------------------------
export const AssignmentEventType = {
  APPOINT: { code: 'APPOINT', label: 'Bổ nhiệm',  sortOrder: 1 },
  DISMISS: { code: 'DISMISS', label: 'Bãi nhiệm', sortOrder: 2 },
} as const;
export type AssignmentEventTypeCode = keyof typeof AssignmentEventType;
export const ASSIGNMENT_EVENT_TYPE_CODES = Object.keys(AssignmentEventType) as AssignmentEventTypeCode[];

// ---------------------------------------------------------------------------
// 0.12  Trình độ văn hóa (ref_education_levels)
// ---------------------------------------------------------------------------
export const EducationLevel = {
  THCS:      { code: 'THCS',      label: 'Trung học cơ sở',    sortOrder: 1 },
  THPT:      { code: 'THPT',      label: 'Trung học phổ thông', sortOrder: 2 },
  TRUNG_CAP: { code: 'TRUNG_CAP', label: 'Trung cấp',          sortOrder: 3 },
  CAO_DANG:  { code: 'CAO_DANG',  label: 'Cao đẳng',           sortOrder: 4 },
  DAI_HOC:   { code: 'DAI_HOC',   label: 'Đại học',            sortOrder: 5 },
  THAC_SI:   { code: 'THAC_SI',   label: 'Thạc sĩ',           sortOrder: 6 },
  TIEN_SI:   { code: 'TIEN_SI',   label: 'Tiến sĩ',           sortOrder: 7 },
} as const;
export type EducationLevelCode = keyof typeof EducationLevel;
export const EDUCATION_LEVEL_CODES = Object.keys(EducationLevel) as EducationLevelCode[];

// ---------------------------------------------------------------------------
// 0.13  Trình độ đào tạo (ref_training_levels)
// ---------------------------------------------------------------------------
export const TrainingLevel = {
  SO_CAP:    { code: 'SO_CAP',    label: 'Sơ cấp',            sortOrder: 1 },
  TRUNG_CAP: { code: 'TRUNG_CAP', label: 'Trung cấp',         sortOrder: 2 },
  CAO_DANG:  { code: 'CAO_DANG',  label: 'Cao đẳng',          sortOrder: 3 },
  DAI_HOC:   { code: 'DAI_HOC',   label: 'Đại học',           sortOrder: 4 },
  THAC_SI:   { code: 'THAC_SI',   label: 'Thạc sĩ',          sortOrder: 5 },
  TIEN_SI:   { code: 'TIEN_SI',   label: 'Tiến sĩ',          sortOrder: 6 },
  TSKH:      { code: 'TSKH',      label: 'Tiến sĩ khoa học',  sortOrder: 7 },
} as const;
export type TrainingLevelCode = keyof typeof TrainingLevel;
export const TRAINING_LEVEL_CODES = Object.keys(TrainingLevel) as TrainingLevelCode[];

// ---------------------------------------------------------------------------
// 0.14  Chức danh nghề nghiệp (ref_academic_titles)
// ---------------------------------------------------------------------------
export const AcademicTitle = {
  GIANG_VIEN:        { code: 'GIANG_VIEN',        label: 'Giảng viên',         sortOrder: 1 },
  GIANG_VIEN_CHINH:  { code: 'GIANG_VIEN_CHINH',  label: 'Giảng viên chính',   sortOrder: 2 },
  GIANG_VIEN_CC:     { code: 'GIANG_VIEN_CC',     label: 'Giảng viên cao cấp', sortOrder: 3 },
  TRO_GIANG:         { code: 'TRO_GIANG',         label: 'Trợ giảng',          sortOrder: 4 },
  NGHIEN_CUU_VIEN:   { code: 'NGHIEN_CUU_VIEN',   label: 'Nghiên cứu viên',    sortOrder: 5 },
  CHUYEN_VIEN:       { code: 'CHUYEN_VIEN',       label: 'Chuyên viên',         sortOrder: 6 },
  CHUYEN_VIEN_CHINH: { code: 'CHUYEN_VIEN_CHINH', label: 'Chuyên viên chính',   sortOrder: 7 },
  KY_THUAT_VIEN:     { code: 'KY_THUAT_VIEN',     label: 'Kỹ thuật viên',       sortOrder: 8 },
} as const;
export type AcademicTitleCode = keyof typeof AcademicTitle;
export const ACADEMIC_TITLE_CODES = Object.keys(AcademicTitle) as AcademicTitleCode[];

// ---------------------------------------------------------------------------
// 0.15  Chức danh khoa học / Học hàm (ref_academic_ranks)
// ---------------------------------------------------------------------------
export const AcademicRank = {
  GS:  { code: 'GS',  label: 'Giáo sư',     sortOrder: 1 },
  PGS: { code: 'PGS', label: 'Phó Giáo sư', sortOrder: 2 },
} as const;
export type AcademicRankCode = keyof typeof AcademicRank;
export const ACADEMIC_RANK_CODES = Object.keys(AcademicRank) as AcademicRankCode[];

// ---------------------------------------------------------------------------
// 0.16  Trạng thái tài liệu hợp đồng (ref_contract_doc_statuses)
// ---------------------------------------------------------------------------
export const ContractDocStatus = {
  draft:      { code: 'draft',      label: 'Nháp',          sortOrder: 1 },
  valid:      { code: 'valid',      label: 'Đang hiệu lực', sortOrder: 2 },
  expired:    { code: 'expired',    label: 'Hết hiệu lực',  sortOrder: 3 },
  terminated: { code: 'terminated', label: 'Đã chấm dứt',   sortOrder: 4 },
} as const;
export type ContractDocStatusCode = keyof typeof ContractDocStatus;
export const CONTRACT_DOC_STATUS_CODES = Object.keys(ContractDocStatus) as ContractDocStatusCode[];

// ---------------------------------------------------------------------------
// 0.17  Trạng thái khóa đào tạo (ref_training_statuses)
// ---------------------------------------------------------------------------
export const TrainingStatus = {
  open_registration: { code: 'open_registration', label: 'Mở đăng ký',  sortOrder: 1 },
  in_progress:       { code: 'in_progress',       label: 'Đang diễn ra', sortOrder: 2 },
  completed:         { code: 'completed',         label: 'Đã hoàn thành', sortOrder: 3 },
} as const;
export type TrainingStatusCode = keyof typeof TrainingStatus;
export const TRAINING_STATUS_CODES = Object.keys(TrainingStatus) as TrainingStatusCode[];

// ---------------------------------------------------------------------------
// 0.18  Trạng thái tham gia khóa đào tạo (ref_participation_statuses)
// ---------------------------------------------------------------------------
export const ParticipationStatus = {
  registered: { code: 'registered', label: 'Đã đăng ký', sortOrder: 1 },
  learning:   { code: 'learning',   label: 'Đang học',    sortOrder: 2 },
  completed:  { code: 'completed',  label: 'Hoàn thành',  sortOrder: 3 },
  failed:     { code: 'failed',     label: 'Không đạt',   sortOrder: 4 },
} as const;
export type ParticipationStatusCode = keyof typeof ParticipationStatus;
export const PARTICIPATION_STATUS_CODES = Object.keys(ParticipationStatus) as ParticipationStatusCode[];

// ---------------------------------------------------------------------------
// 0.19  Kết quả đào tạo (ref_result_statuses)
// ---------------------------------------------------------------------------
export const ResultStatus = {
  completed: { code: 'completed', label: 'Hoàn thành', sortOrder: 1 },
  failed:    { code: 'failed',    label: 'Không đạt',  sortOrder: 2 },
} as const;
export type ResultStatusCode = keyof typeof ResultStatus;
export const RESULT_STATUS_CODES = Object.keys(ResultStatus) as ResultStatusCode[];

// ---------------------------------------------------------------------------
// 0.20  Trạng thái tài khoản (ref_auth_user_statuses)
// ---------------------------------------------------------------------------
export const AuthUserStatus = {
  active: { code: 'active', label: 'Đang hoạt động', sortOrder: 1 },
  locked: { code: 'locked', label: 'Đã khóa',        sortOrder: 2 },
} as const;
export type AuthUserStatusCode = keyof typeof AuthUserStatus;
export const AUTH_USER_STATUS_CODES = Object.keys(AuthUserStatus) as AuthUserStatusCode[];

// ---------------------------------------------------------------------------
// 0.21  Trạng thái danh mục cấu hình (ref_catalog_statuses)
//       Dùng chung cho: salary_grades, salary_grade_steps, allowance_types,
//       contract_types, training_course_types
// ---------------------------------------------------------------------------
export const CatalogStatus = {
  active:   { code: 'active',   label: 'Đang sử dụng',  sortOrder: 1 },
  inactive: { code: 'inactive', label: 'Ngừng sử dụng', sortOrder: 2 },
} as const;
export type CatalogStatusCode = keyof typeof CatalogStatus;
export const CATALOG_STATUS_CODES = Object.keys(CatalogStatus) as CatalogStatusCode[];
