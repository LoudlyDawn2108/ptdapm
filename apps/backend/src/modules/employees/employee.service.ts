import {
  AcademicRank,
  type CreateEmployeeInput,
  type DropdownOption,
  EducationLevel,
  Gender,
  type ImportEmployeeRowInput,
  type UpdateEmployeeInput,
  enumToSortedList,
  importEmployeeRowSchema,
} from "@hrms/shared";
import { type SQL, and, eq, ilike, inArray, ne, or } from "drizzle-orm";
import ExcelJS from "exceljs";
import { BadRequestError, FieldValidationError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import type { NewEmployee, NewEmployeeForeignWorkPermit } from "../../db/schema";
import {
  type Employee,
  allowanceTypes,
  employeeAllowances,
  employeeBankAccounts,
  employeeCertifications,
  employeeDegrees,
  employeeEvaluations,
  employeeFamilyMembers,
  employeeForeignWorkPermits,
  employeePartyMemberships,
  employeePreviousJobs,
  employees,
  employmentContracts,
  orgUnits,
  salaryGradeSteps,
  salaryGrades,
} from "../../db/schema";

type EmployeeListItem = Employee & {
  currentOrgUnitName: string | null;
};

function normalizeOptional(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function undefinedToNull<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === undefined ? null : v]),
  ) as {
    [K in keyof T]: undefined extends T[K] ? Exclude<T[K], undefined> | null : T[K];
  };
}

async function hasConflict(condition: SQL): Promise<boolean> {
  const existing = await db.select({ id: employees.id }).from(employees).where(condition).limit(1);
  return existing.length > 0;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

function mapUniqueViolation(error: unknown): FieldValidationError {
  const detail = (error as { detail?: string }).detail ?? "";
  if (detail.includes("national_id")) {
    return new FieldValidationError({ nationalId: "Số CCCD/CMND đã tồn tại" });
  }
  if (detail.includes("email")) {
    return new FieldValidationError({ email: "Email đã tồn tại" });
  }
  if (detail.includes("staff_code")) {
    return new FieldValidationError({ staffCode: "Mã cán bộ đã tồn tại" });
  }
  return new FieldValidationError({}, "Dữ liệu đã tồn tại");
}

export async function list(
  page: number,
  pageSize: number,
  search?: string,
  orgUnitId?: string,
  workStatus?: Employee["workStatus"],
  contractStatus?: Employee["contractStatus"],
  gender?: Employee["gender"],
  academicRank?: Employee["academicRank"],
  positionTitle?: string,
) {
  const normalizedSearch = normalizeOptional(search);
  const normalizedOrgUnitId = normalizeOptional(orgUnitId);
  const normalizedWorkStatus = normalizeOptional(workStatus) as Employee["workStatus"] | undefined;
  const normalizedContractStatus = normalizeOptional(contractStatus) as
    | Employee["contractStatus"]
    | undefined;
  const normalizedGender = normalizeOptional(gender) as Employee["gender"] | undefined;
  const normalizedAcademicRank = normalizeOptional(academicRank) as
    | Employee["academicRank"]
    | undefined;
  const normalizedPositionTitle = normalizeOptional(positionTitle);

  const conditions: SQL[] = [];

  if (normalizedSearch) {
    const searchCondition = or(
      ilike(employees.fullName, `%${normalizedSearch}%`),
      ilike(employees.staffCode, `%${normalizedSearch}%`),
      ilike(employees.email, `%${normalizedSearch}%`),
      ilike(employees.phone, `%${normalizedSearch}%`),
      ilike(employees.nationalId, `%${normalizedSearch}%`),
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (normalizedOrgUnitId) {
    conditions.push(eq(employees.currentOrgUnitId, normalizedOrgUnitId));
  }

  if (normalizedWorkStatus) {
    conditions.push(eq(employees.workStatus, normalizedWorkStatus));
  }

  if (normalizedContractStatus) {
    conditions.push(eq(employees.contractStatus, normalizedContractStatus));
  }

  if (normalizedGender) {
    conditions.push(eq(employees.gender, normalizedGender));
  }

  if (normalizedAcademicRank) {
    conditions.push(eq(employees.academicRank, normalizedAcademicRank));
  }

  if (normalizedPositionTitle) {
    conditions.push(ilike(employees.currentPositionTitle, `%${normalizedPositionTitle}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const itemsQuery = db
    .select({
      id: employees.id,
      staffCode: employees.staffCode,
      fullName: employees.fullName,
      dob: employees.dob,
      gender: employees.gender,
      nationalId: employees.nationalId,
      hometown: employees.hometown,
      address: employees.address,
      taxCode: employees.taxCode,
      socialInsuranceNo: employees.socialInsuranceNo,
      healthInsuranceNo: employees.healthInsuranceNo,
      email: employees.email,
      phone: employees.phone,
      isForeigner: employees.isForeigner,
      educationLevel: employees.educationLevel,
      trainingLevel: employees.trainingLevel,
      academicRank: employees.academicRank,
      academicTitle: employees.academicTitle,
      workStatus: employees.workStatus,
      contractStatus: employees.contractStatus,
      currentOrgUnitId: employees.currentOrgUnitId,
      currentOrgUnitName: orgUnits.unitName,
      currentPositionTitle: employees.currentPositionTitle,
      salaryGradeStepId: employees.salaryGradeStepId,
      portraitFileId: employees.portraitFileId,
      terminatedOn: employees.terminatedOn,
      terminationReason: employees.terminationReason,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    })
    .from(employees)
    .leftJoin(orgUnits, eq(employees.currentOrgUnitId, orgUnits.id))
    .where(where);

  const [items, total]: [EmployeeListItem[], number] = await Promise.all([
    itemsQuery
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employees.createdAt),
    countRows(employees, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

// ── Dropdown ────────────────────────────────────────────────────────────────

export async function dropdown(search?: string, limit = 20): Promise<DropdownOption[]> {
  const workStatusFilter = or(
    eq(employees.workStatus, "working"),
    eq(employees.workStatus, "pending"),
  );
  const conditions: SQL[] = [];
  if (workStatusFilter) conditions.push(workStatusFilter);

  if (search) {
    const searchCondition = or(
      ilike(employees.fullName, `%${search}%`),
      ilike(employees.staffCode, `%${search}%`),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const items = await db
    .select({
      value: employees.id,
      label: employees.fullName,
      staffCode: employees.staffCode,
      phoneNumber: employees.phone,
    })
    .from(employees)
    .where(and(...conditions))
    .limit(limit)
    .orderBy(employees.staffCode);

  return items.map((item) => ({
    value: item.value,
    label: `${item.staffCode} - ${item.label} - ${item.phoneNumber ?? "N/A"}`,
  }));
}

async function getById(id: string): Promise<Employee> {
  const [employee] = await db.select().from(employees).where(eq(employees.id, id));
  if (!employee) throw new NotFoundError("Không tìm thấy nhân viên");
  return employee;
}

function filterEvaluationsByRole<T extends { visibleToEmployee: boolean; visibleToTckt: boolean }>(
  evaluations: T[],
  userRole?: string,
) {
  if (userRole === "EMPLOYEE") {
    return evaluations.filter((evaluation) => evaluation.visibleToEmployee);
  }

  if (userRole === "TCKT") {
    return evaluations.filter((evaluation) => evaluation.visibleToTckt);
  }

  return evaluations;
}

function formatDateToIso(date: Date) {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeCellText(value: unknown): string | undefined {
  if (value == null) return undefined;

  if (value instanceof Date) {
    return formatDateToIso(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return normalizeCellText(value.text);
    }

    if ("result" in value) {
      return normalizeCellText(value.result);
    }

    if ("richText" in value && Array.isArray(value.richText)) {
      const text = value.richText
        .map((item) =>
          typeof item === "object" && item !== null && "text" in item ? item.text : "",
        )
        .join("");
      return normalizeCellText(text);
    }
  }

  const normalized = String(value).trim();
  return normalized ? normalized : undefined;
}

function normalizeImportedDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    return formatDateToIso(value);
  }

  if (typeof value === "number") {
    const date = new Date(Date.UTC(1899, 11, 30));
    date.setUTCDate(date.getUTCDate() + value);
    return formatDateToIso(date);
  }

  const raw = normalizeCellText(value);
  if (!raw) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const dmyMatch = raw.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
  }

  const ymdSlash = raw.match(/^(\d{4})[/.](\d{1,2})[/.](\d{1,2})$/);
  if (ymdSlash) {
    const [, y, m, d] = ymdSlash;
    return `${y}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
  }

  return raw;
}

function collectRowErrors(rowErrors: Map<number, string[]>) {
  return Array.from(rowErrors.entries())
    .sort(([rowA], [rowB]) => rowA - rowB)
    .map(([row, errors]) => ({ row, errors }));
}

function addRowError(rowErrors: Map<number, string[]>, row: number, message: string) {
  const errors = rowErrors.get(row) ?? [];

  if (!errors.includes(message)) {
    errors.push(message);
  }

  rowErrors.set(row, errors);
}

type ImportRowCandidate = {
  fullName?: string;
  dob?: string;
  gender?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  hometown?: string;
  address?: string;
  taxCode?: string;
  socialInsuranceNo?: string;
  healthInsuranceNo?: string;
  educationLevel?: string;
  academicRank?: string;
  isForeigner?: string | boolean;
  visaNo?: string;
  visaExpiresOn?: string;
  passportNo?: string;
  passportExpiresOn?: string;
  workPermitNo?: string;
  workPermitExpiresOn?: string;
};

const DATE_IMPORT_FIELDS = new Set([
  "dob",
  "visaExpiresOn",
  "passportExpiresOn",
  "workPermitExpiresOn",
]);

function mapImportRow(row: ExcelJS.Row, headers: Map<number, string>): ImportRowCandidate | null {
  const values = Object.fromEntries(
    Array.from(headers.entries()).map(([columnIndex, header]) => {
      const cellValue = row.getCell(columnIndex).value;
      const normalizedValue = DATE_IMPORT_FIELDS.has(header)
        ? normalizeImportedDate(cellValue)
        : normalizeCellText(cellValue);
      return [header, normalizedValue];
    }),
  );

  const candidate: ImportRowCandidate = {
    fullName: values.fullName,
    dob: values.dob,
    gender: values.gender,
    nationalId: values.nationalId,
    phone: values.phone,
    email: values.email,
    hometown: values.hometown,
    address: values.address,
    taxCode: values.taxCode,
    socialInsuranceNo: values.socialInsuranceNo,
    healthInsuranceNo: values.healthInsuranceNo,
    educationLevel: values.educationLevel,
    academicRank: values.academicRank,
    isForeigner: values.isForeigner,
    visaNo: values.visaNo,
    visaExpiresOn: values.visaExpiresOn,
    passportNo: values.passportNo,
    passportExpiresOn: values.passportExpiresOn,
    workPermitNo: values.workPermitNo,
    workPermitExpiresOn: values.workPermitExpiresOn,
  };

  const hasAnyValue = Object.values(candidate).some((value) => value != null && value !== "");
  if (!hasAnyValue) {
    return null;
  }

  return candidate;
}

export async function getAggregateById(id: string, userRole?: string) {
  const employee = await getById(id);

  const salaryGradeStep = employee.salaryGradeStepId
    ? await db
        .select({
          id: salaryGradeSteps.id,
          salaryGradeId: salaryGradeSteps.salaryGradeId,
          gradeId: salaryGrades.id,
          gradeName: salaryGrades.gradeName,
          stepNo: salaryGradeSteps.stepNo,
          coefficient: salaryGradeSteps.coefficient,
        })
        .from(salaryGradeSteps)
        .innerJoin(salaryGrades, eq(salaryGradeSteps.salaryGradeId, salaryGrades.id))
        .where(eq(salaryGradeSteps.id, employee.salaryGradeStepId))
        .then((rows) => {
          const row = rows[0];
          if (!row) {
            return null;
          }

          return {
            id: row.id,
            salaryGradeId: row.salaryGradeId,
            gradeId: row.gradeId,
            gradeName: row.gradeName,
            stepName: `Bậc ${row.stepNo}`,
            coefficient: row.coefficient,
          };
        })
    : null;

  const [
    familyMembers,
    bankAccounts,
    previousJobs,
    partyMemberships,
    allowancesRaw,
    degrees,
    certifications,
    foreignWorkPermits,
    contracts,
    evaluationsRaw,
  ] = await Promise.all([
    db.select().from(employeeFamilyMembers).where(eq(employeeFamilyMembers.employeeId, id)),
    db.select().from(employeeBankAccounts).where(eq(employeeBankAccounts.employeeId, id)),
    db.select().from(employeePreviousJobs).where(eq(employeePreviousJobs.employeeId, id)),
    db.select().from(employeePartyMemberships).where(eq(employeePartyMemberships.employeeId, id)),
    db
      .select({
        id: employeeAllowances.id,
        employeeId: employeeAllowances.employeeId,
        allowanceTypeId: employeeAllowances.allowanceTypeId,
        amount: employeeAllowances.amount,
        status: employeeAllowances.status,
        note: employeeAllowances.note,
        createdAt: employeeAllowances.createdAt,
        updatedAt: employeeAllowances.updatedAt,
        allowanceName: allowanceTypes.allowanceName,
        allowanceTypeStatus: allowanceTypes.status,
      })
      .from(employeeAllowances)
      .innerJoin(allowanceTypes, eq(employeeAllowances.allowanceTypeId, allowanceTypes.id))
      .where(eq(employeeAllowances.employeeId, id)),
    db.select().from(employeeDegrees).where(eq(employeeDegrees.employeeId, id)),
    db.select().from(employeeCertifications).where(eq(employeeCertifications.employeeId, id)),
    db
      .select()
      .from(employeeForeignWorkPermits)
      .where(eq(employeeForeignWorkPermits.employeeId, id)),
    db.select().from(employmentContracts).where(eq(employmentContracts.employeeId, id)),
    db.select().from(employeeEvaluations).where(eq(employeeEvaluations.employeeId, id)),
  ]);

  const allowances = allowancesRaw;
  const evaluations = filterEvaluationsByRole(evaluationsRaw, userRole);

  return {
    employee,
    salaryGradeStep,
    familyMembers,
    bankAccounts,
    previousJobs,
    partyMemberships,
    degrees,
    certifications,
    foreignWorkPermits,
    allowances,
    contracts,
    evaluations,
  };
}

export async function importFromExcel(buffer: ArrayBuffer) {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(buffer);
  } catch {
    throw new BadRequestError("File Excel không hợp lệ");
  }

  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    throw new BadRequestError("File Excel không có dữ liệu");
  }

  const HEADER_LABEL_TO_KEY: Record<string, string> = {
    "Họ tên (*)": "fullName",
    "Ngày sinh (*)": "dob",
    "Giới tính (*)": "gender",
    "Số CCCD/CMND (*)": "nationalId",
    "Số điện thoại (*)": "phone",
    "Email (*)": "email",
    "Quê quán (*)": "hometown",
    "Địa chỉ (*)": "address",
    "Mã số thuế (*)": "taxCode",
    "Số BHXH": "socialInsuranceNo",
    "Số BHYT": "healthInsuranceNo",
    "Trình độ văn hóa (*)": "educationLevel",
    "Học hàm/Học vị (*)": "academicRank",
    "Người nước ngoài": "isForeigner",
    "Số Visa": "visaNo",
    "Hạn Visa": "visaExpiresOn",
    "Số Hộ chiếu": "passportNo",
    "Hạn Hộ chiếu": "passportExpiresOn",
    "Số GPLĐ": "workPermitNo",
    "Hạn GPLĐ": "workPermitExpiresOn",
  };

  const headers = new Map<number, string>();
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, columnIndex) => {
    const rawHeader = normalizeCellText(cell.value);
    if (rawHeader) {
      headers.set(columnIndex, HEADER_LABEL_TO_KEY[rawHeader] ?? rawHeader);
    }
  });

  if (headers.size === 0) {
    throw new BadRequestError("File Excel không có tiêu đề cột");
  }

  const REQUIRED_COLUMNS = [
    "fullName",
    "dob",
    "gender",
    "nationalId",
    "phone",
    "email",
    "hometown",
    "address",
    "taxCode",
    "educationLevel",
    "academicRank",
  ] as const;
  const headerValues = new Set(headers.values());
  const missingColumns = REQUIRED_COLUMNS.filter((col) => !headerValues.has(col));
  if (missingColumns.length > 0) {
    throw new BadRequestError(
      "Cấu trúc cột dữ liệu không hợp lệ. Thiếu trường thông tin bắt buộc trong file: " +
        missingColumns.join(", "),
    );
  }

  let dataRowCount = 0;
  worksheet.eachRow({ includeEmpty: false }, (_row, rowNumber) => {
    if (rowNumber > 1) dataRowCount++;
  });
  if (dataRowCount === 0) {
    throw new BadRequestError("File Excel không có dữ liệu (file rỗng)");
  }

  const parsedRows: Array<{ rowNumber: number; data: ImportEmployeeRowInput }> = [];
  const rowErrors = new Map<number, string[]>();

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const mappedRow = mapImportRow(row, headers);
    if (!mappedRow) {
      return;
    }

    const parsedRow = importEmployeeRowSchema.safeParse(mappedRow);

    if (!parsedRow.success) {
      for (const issue of parsedRow.error.issues) {
        addRowError(rowErrors, rowNumber, issue.message);
      }
      return;
    }

    parsedRows.push({ rowNumber, data: parsedRow.data });
  });

  if (rowErrors.size > 0) {
    return { imported: 0, errors: collectRowErrors(rowErrors) };
  }

  const rowsByNationalId = new Map<string, number[]>();
  for (const { rowNumber, data } of parsedRows) {
    const rows = rowsByNationalId.get(data.nationalId) ?? [];
    rows.push(rowNumber);
    rowsByNationalId.set(data.nationalId, rows);
  }

  for (const rows of rowsByNationalId.values()) {
    if (rows.length > 1) {
      for (const rowNumber of rows) {
        addRowError(rowErrors, rowNumber, "Số CCCD/CMND bị trùng trong file import");
      }
    }
  }

  if (rowErrors.size > 0) {
    return { imported: 0, errors: collectRowErrors(rowErrors) };
  }

  const nationalIds = parsedRows.map(({ data }) => data.nationalId);
  if (nationalIds.length > 0) {
    const existingEmployees = await db
      .select({ nationalId: employees.nationalId })
      .from(employees)
      .where(inArray(employees.nationalId, nationalIds));
    const existingNationalIds = new Set(existingEmployees.map((employee) => employee.nationalId));

    for (const { rowNumber, data } of parsedRows) {
      if (existingNationalIds.has(data.nationalId)) {
        addRowError(rowErrors, rowNumber, "Số CCCD/CMND đã tồn tại trong hệ thống");
      }
    }
  }

  if (rowErrors.size > 0) {
    return { imported: 0, errors: collectRowErrors(rowErrors) };
  }

  const insertValues: NewEmployee[] = parsedRows.map(({ data }) => ({
    fullName: data.fullName,
    dob: data.dob,
    gender: data.gender,
    nationalId: data.nationalId,
    hometown: data.hometown ?? null,
    address: data.address ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    taxCode: data.taxCode ?? null,
    socialInsuranceNo: data.socialInsuranceNo ?? null,
    healthInsuranceNo: data.healthInsuranceNo ?? null,
    educationLevel: data.educationLevel ?? null,
    academicRank: data.academicRank ?? null,
    isForeigner: data.isForeigner ?? false,
    workStatus: "pending",
    contractStatus: "none",
  }));

  const inserted = await db.insert(employees).values(insertValues).returning({ id: employees.id });

  const foreignerPermits: NewEmployeeForeignWorkPermit[] = [];
  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    if (!row || !row.data.isForeigner) continue;
    const employeeId = inserted[i]?.id;
    if (!employeeId) continue;

    foreignerPermits.push({
      employeeId,
      visaNo: row.data.visaNo ?? null,
      visaExpiresOn: row.data.visaExpiresOn ?? null,
      passportNo: row.data.passportNo ?? null,
      passportExpiresOn: row.data.passportExpiresOn ?? null,
      workPermitNo: row.data.workPermitNo ?? null,
      workPermitExpiresOn: row.data.workPermitExpiresOn ?? null,
    });
  }

  if (foreignerPermits.length > 0) {
    await db.insert(employeeForeignWorkPermits).values(foreignerPermits);
  }

  return { imported: inserted.length, errors: [] };
}

export async function generateImportTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Nhập hồ sơ");

  const columns = [
    { key: "fullName", label: "Họ tên (*)", width: 25 },
    { key: "dob", label: "Ngày sinh (*)", width: 18 },
    { key: "gender", label: "Giới tính (*)", width: 14 },
    { key: "nationalId", label: "Số CCCD/CMND (*)", width: 20 },
    { key: "phone", label: "Số điện thoại (*)", width: 18 },
    { key: "email", label: "Email (*)", width: 28 },
    { key: "hometown", label: "Quê quán (*)", width: 25 },
    { key: "address", label: "Địa chỉ (*)", width: 30 },
    { key: "taxCode", label: "Mã số thuế (*)", width: 18 },
    { key: "socialInsuranceNo", label: "Số BHXH", width: 16 },
    { key: "healthInsuranceNo", label: "Số BHYT", width: 16 },
    { key: "educationLevel", label: "Trình độ văn hóa (*)", width: 22 },
    { key: "academicRank", label: "Học hàm/Học vị (*)", width: 20 },
    { key: "isForeigner", label: "Người nước ngoài", width: 20 },
    { key: "visaNo", label: "Số Visa", width: 18 },
    { key: "visaExpiresOn", label: "Hạn Visa", width: 16 },
    { key: "passportNo", label: "Số Hộ chiếu", width: 18 },
    { key: "passportExpiresOn", label: "Hạn Hộ chiếu", width: 16 },
    { key: "workPermitNo", label: "Số GPLĐ", width: 18 },
    { key: "workPermitExpiresOn", label: "Hạn GPLĐ", width: 16 },
  ];

  const headerRow = worksheet.addRow(columns.map((c) => c.label));

  for (const [i, col] of columns.entries()) {
    const column = worksheet.getColumn(i + 1);
    column.width = col.width;
    column.numFmt = "@";
  }

  const headerFill: ExcelJS.FillPattern = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2B4C8C" },
  };
  const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  const thinBorder: Partial<ExcelJS.Border> = { style: "thin", color: { argb: "FFB0B0B0" } };
  const cellBorder: Partial<ExcelJS.Borders> = {
    top: thinBorder,
    left: thinBorder,
    bottom: thinBorder,
    right: thinBorder,
  };

  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = cellBorder;
  });
  headerRow.height = 30;

  const genderLabels = enumToSortedList(Gender).map((g) => g.label);
  const educationLabels = enumToSortedList(EducationLevel).map((e) => e.label);
  const rankLabels = enumToSortedList(AcademicRank).map((r) => r.label);

  const genderCol = columns.findIndex((c) => c.key === "gender") + 1;
  const educationCol = columns.findIndex((c) => c.key === "educationLevel") + 1;
  const rankCol = columns.findIndex((c) => c.key === "academicRank") + 1;
  const foreignerCol = columns.findIndex((c) => c.key === "isForeigner") + 1;

  const DATA_ROWS = 200;
  for (let row = 2; row <= DATA_ROWS + 1; row++) {
    worksheet.getCell(row, genderCol).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${genderLabels.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Giá trị không hợp lệ",
      error: `Chọn một trong: ${genderLabels.join(", ")}`,
    };
    worksheet.getCell(row, educationCol).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${educationLabels.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Giá trị không hợp lệ",
      error: `Chọn một trong: ${educationLabels.join(", ")}`,
    };
    worksheet.getCell(row, rankCol).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${rankLabels.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Giá trị không hợp lệ",
      error: `Chọn một trong: ${rankLabels.join(", ")}`,
    };
    worksheet.getCell(row, foreignerCol).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"Không,Có"'],
      showErrorMessage: true,
      errorTitle: "Giá trị không hợp lệ",
      error: "Chọn: Không hoặc Có",
    };
  }

  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export async function getByEmail(email: string): Promise<Employee | null> {
  const normalizedEmail = normalizeOptional(email);
  if (!normalizedEmail) {
    throw new FieldValidationError({ email: "Email không hợp lệ" }, "Email không hợp lệ");
  }

  const [employee] = await db.select().from(employees).where(eq(employees.email, normalizedEmail));

  return employee ?? null;
}

export async function create(data: CreateEmployeeInput): Promise<Employee> {
  const nationalId = normalizeOptional(data.nationalId);
  const email = normalizeOptional(data.email);
  const { staffCode, ...rest } = data;
  const normalizedStaffCode = normalizeOptional(staffCode);

  if (!nationalId) {
    throw new FieldValidationError({ nationalId: "Số CCCD/CMND không hợp lệ" });
  }

  if (!email) {
    throw new FieldValidationError({ email: "Email không hợp lệ" });
  }

  const payload = undefinedToNull({
    ...rest,
    workStatus: rest.workStatus ?? "pending",
    contractStatus: rest.contractStatus ?? "none",
  }) as Omit<NewEmployee, "staffCode">;

  const insertValues = normalizedStaffCode
    ? { ...payload, staffCode: normalizedStaffCode }
    : payload;

  try {
    const [created] = await db.transaction(async (tx) => {
      const txHasConflict = async (condition: SQL): Promise<boolean> => {
        const existing = await tx
          .select({ id: employees.id })
          .from(employees)
          .where(condition)
          .limit(1);
        return existing.length > 0;
      };

      if (await txHasConflict(eq(employees.nationalId, nationalId))) {
        throw new FieldValidationError({
          nationalId: "Số CCCD/CMND đã tồn tại",
        });
      }

      if (await txHasConflict(eq(employees.email, email))) {
        throw new FieldValidationError({ email: "Email đã tồn tại" });
      }

      if (
        normalizedStaffCode &&
        (await txHasConflict(eq(employees.staffCode, normalizedStaffCode)))
      ) {
        throw new FieldValidationError({ staffCode: "Mã cán bộ đã tồn tại" });
      }

      return tx
        .insert(employees)
        .values(insertValues as NewEmployee)
        .returning();
    });

    if (!created) throw new Error("Insert failed");
    return created;
  } catch (error) {
    if (error instanceof FieldValidationError) throw error;
    if (isUniqueViolation(error)) {
      throw mapUniqueViolation(error);
    }
    throw error;
  }
}

export async function update(id: string, data: UpdateEmployeeInput): Promise<Employee> {
  const existing = await getById(id);

  if (!["pending", "working"].includes(existing.workStatus)) {
    throw new BadRequestError("Không thể chỉnh sửa hồ sơ ở trạng thái hiện tại");
  }

  if (Object.keys(data).length === 0) {
    throw new FieldValidationError({}, "Không có dữ liệu cập nhật");
  }

  const nationalId = normalizeOptional(data.nationalId ?? undefined);
  const email = normalizeOptional(data.email ?? undefined);

  const payload = undefinedToNull({
    ...data,
    updatedAt: new Date(),
  }) as Partial<Omit<NewEmployee, "staffCode">>;

  try {
    const [updated] = await db.transaction(async (tx) => {
      const txHasConflict = async (condition: SQL): Promise<boolean> => {
        const found = await tx
          .select({ id: employees.id })
          .from(employees)
          .where(condition)
          .limit(1);
        return found.length > 0;
      };

      if (nationalId) {
        const condition = and(eq(employees.nationalId, nationalId), ne(employees.id, id));
        if (condition && (await txHasConflict(condition))) {
          throw new FieldValidationError({
            nationalId: "Số CCCD/CMND đã tồn tại",
          });
        }
      }

      if (email) {
        const condition = and(eq(employees.email, email), ne(employees.id, id));
        if (condition && (await txHasConflict(condition))) {
          throw new FieldValidationError({ email: "Email đã tồn tại" });
        }
      }

      return tx
        .update(employees)
        .set(payload as Partial<NewEmployee>)
        .where(eq(employees.id, id))
        .returning();
    });

    if (!updated) throw new Error("Update failed");
    return updated;
  } catch (error) {
    if (error instanceof FieldValidationError) throw error;
    if (isUniqueViolation(error)) {
      throw mapUniqueViolation(error);
    }
    throw error;
  }
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);
  await db.delete(employees).where(eq(employees.id, id));
  return { id };
}
