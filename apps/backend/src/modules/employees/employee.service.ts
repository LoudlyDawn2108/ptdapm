import type { CreateEmployeeInput, UpdateEmployeeInput } from "@hrms/shared";
import { type SQL, and, eq, ilike, ne, or } from "drizzle-orm";
import { BadRequestError, FieldValidationError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import type { NewEmployee } from "../../db/schema";
import {
  type Employee,
  allowanceTypes,
  employeeAllowances,
  employeeBankAccounts,
  employeeFamilyMembers,
  employeePartyMemberships,
  employeePreviousJobs,
  employees,
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
  academicTitle?: Employee["academicTitle"],
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
  const normalizedAcademicTitle = normalizeOptional(academicTitle) as
    | Employee["academicTitle"]
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

  if (normalizedAcademicTitle) {
    conditions.push(eq(employees.academicTitle, normalizedAcademicTitle));
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

export async function getAggregateById(id: string) {
  const employee = await getById(id);

  const [familyMembers, bankAccounts, previousJobs, partyMemberships, allowancesRaw] =
    await Promise.all([
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
    ]);

  const allowances = allowancesRaw;

  return {
    employee,
    familyMembers,
    bankAccounts,
    previousJobs,
    partyMemberships,
    allowances,
  };
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
