/**
 * Frontend types for the Employee aggregate returned by GET /api/employees/:id
 *
 * These mirror the backend `getAggregateById()` return shape from
 * `apps/backend/src/modules/employees/employee.service.ts`.
 *
 * NOTE: We intentionally define lightweight frontend types rather than sharing
 * Drizzle `$inferSelect` types, because the API may transform/omit fields and
 * the frontend should not depend on database column internals.
 */

// ─── Employee (core record) ──────────────────────────────────────────

export type EmployeeRecord = {
  id: string;
  staffCode: string;
  fullName: string;
  dob: string;
  gender: string;
  nationalId: string;
  hometown: string | null;
  address: string;
  taxCode: string | null;
  socialInsuranceNo: string | null;
  healthInsuranceNo: string | null;
  email: string;
  phone: string;
  isForeigner: boolean;
  educationLevel: string | null;
  trainingLevel: string | null;
  academicRank: string | null;
  academicTitle: string | null;
  workStatus: string;
  contractStatus: string;
  currentOrgUnitId: string | null;
  currentOrgUnitName: string | null;
  currentPositionTitle: string | null;
  salaryGradeStepId: string | null;
  portraitFileId: string | null;
  terminatedOn: string | null;
  terminationReason: string | null;
  createdAt: string;
  updatedAt: string;
};

// ─── Sub-entity types ────────────────────────────────────────────────

export type FamilyMember = {
  id: string;
  employeeId: string;
  relation: string;
  fullName: string;
  dob: string | null;
  phone: string | null;
  note: string | null;
  isDependent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BankAccount = {
  id: string;
  employeeId: string;
  bankName: string;
  accountNo: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PreviousJob = {
  id: string;
  employeeId: string;
  workplace: string;
  startedOn: string | null;
  endedOn: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PartyMembership = {
  id: string;
  employeeId: string;
  organizationType: string;
  joinedOn: string | null;
  details: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Degree = {
  id: string;
  employeeId: string;
  degreeName: string;
  school: string;
  degreeFileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Certification = {
  id: string;
  employeeId: string;
  certName: string;
  issuedBy: string | null;
  issuedOn: string | null;
  expiresOn: string | null;
  certFileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ForeignWorkPermit = {
  id: string;
  employeeId: string;
  visaNo: string | null;
  visaExpiresOn: string | null;
  passportNo: string | null;
  passportExpiresOn: string | null;
  workPermitNo: string | null;
  workPermitExpiresOn: string | null;
  workPermitFileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EmploymentContract = {
  id: string;
  employeeId: string;
  contractTypeId: string;
  contractNo: string;
  signedOn: string;
  effectiveFrom: string;
  effectiveTo: string;
  orgUnitId: string;
  status: string;
  contentHtml: string | null;
  contractFileId: string | null;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeEvaluation = {
  id: string;
  employeeId: string;
  evalType: string;
  rewardType: string | null;
  rewardName: string | null;
  decisionOn: string | null;
  decisionNo: string | null;
  content: string | null;
  rewardAmount: string | null;
  disciplineType: string | null;
  disciplineName: string | null;
  reason: string | null;
  actionForm: string | null;
  isActive: boolean;
  visibleToEmployee: boolean;
  visibleToTckt: boolean;
  createdByUserId: string | null;
  createdAt: string;
};

export type EmployeeAllowance = {
  id: string;
  employeeId: string;
  allowanceTypeId: string;
  amount: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  allowanceName: string;
  status: string;
  allowanceTypeStatus?: string | null;
};

export type EmployeeSalaryGradeStep = {
  id: string;
  salaryGradeId: string;
  gradeId: string;
  gradeName: string;
  stepName: string;
  coefficient: string;
};

// ─── Aggregate (GET /api/employees/:id response.data) ────────────────

export type EmployeeAggregate = {
  employee: EmployeeRecord;
  salaryGradeStep: EmployeeSalaryGradeStep | null;
  familyMembers: FamilyMember[];
  bankAccounts: BankAccount[];
  previousJobs: PreviousJob[];
  partyMemberships: PartyMembership[];
  degrees: Degree[];
  certifications: Certification[];
  foreignWorkPermits: ForeignWorkPermit[];
  allowances: EmployeeAllowance[];
  contracts: EmploymentContract[];
  evaluations: EmployeeEvaluation[];
};

export function isEmployeeAggregate(value: unknown): value is EmployeeAggregate {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    obj.employee != null &&
    typeof obj.employee === "object" &&
    "id" in obj.employee &&
    "fullName" in obj.employee &&
    Array.isArray(obj.bankAccounts) &&
    Array.isArray(obj.familyMembers)
  );
}
