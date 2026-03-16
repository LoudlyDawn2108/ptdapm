import {
  type CreateEmployeeInput,
  type ImportEmployeeRowInput,
  type UpdateEmployeeInput,
  importEmployeeRowSchema,
} from "@hrms/shared";
import { type SQL, and, eq, ilike, inArray, ne, or } from "drizzle-orm";
import ExcelJS from "exceljs";
import { BadRequestError, FieldValidationError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import type { NewEmployee } from "../../db/schema";
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
} from "../../db/schema";

function normalizeOptional(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function undefinedToNull<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === undefined ? null : v]),
  ) as { [K in keyof T]: undefined extends T[K] ? Exclude<T[K], undefined> | null : T[K] };
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
  const itemsQuery = where ? db.select().from(employees).where(where) : db.select().from(employees);

  const [items, total]: [Employee[], number] = await Promise.all([
    itemsQuery
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employees.createdAt),
    countRows(employees, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
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

  return normalizeCellText(value);
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
};

function mapImportRow(row: ExcelJS.Row, headers: Map<number, string>): ImportRowCandidate | null {
  const values = Object.fromEntries(
    Array.from(headers.entries()).map(([columnIndex, header]) => {
      const cellValue = row.getCell(columnIndex).value;
      const normalizedValue =
        header === "dob" ? normalizeImportedDate(cellValue) : normalizeCellText(cellValue);
      return [header, normalizedValue];
    }),
  );

  const candidate = {
    fullName: values.fullName,
    dob: values.dob,
    gender: values.gender,
    nationalId: values.nationalId,
    phone: values.phone,
    email: values.email,
    hometown: values.hometown,
    address: values.address,
  };

  const hasAnyValue = Object.values(candidate).some((value) => value != null && value !== "");
  if (!hasAnyValue) {
    return null;
  }

  return candidate;
}

export async function getAggregateById(id: string, userRole?: string) {
  const employee = await getById(id);

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
        note: employeeAllowances.note,
        createdAt: employeeAllowances.createdAt,
        updatedAt: employeeAllowances.updatedAt,
        allowanceName: allowanceTypes.allowanceName,
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

  const headers = new Map<number, string>();
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, columnIndex) => {
    const header = normalizeCellText(cell.value);
    if (header) {
      headers.set(columnIndex, header);
    }
  });

  if (headers.size === 0) {
    throw new BadRequestError("File Excel không có tiêu đề cột");
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
    workStatus: "pending",
    contractStatus: "none",
  }));

  const inserted = await db.insert(employees).values(insertValues).returning({ id: employees.id });

  return { imported: inserted.length, errors: [] };
}

export async function generateImportTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");

  worksheet.addRow([
    "fullName",
    "dob",
    "gender",
    "nationalId",
    "phone",
    "email",
    "hometown",
    "address",
  ]);

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
        throw new FieldValidationError({ nationalId: "Số CCCD/CMND đã tồn tại" });
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
          throw new FieldValidationError({ nationalId: "Số CCCD/CMND đã tồn tại" });
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
