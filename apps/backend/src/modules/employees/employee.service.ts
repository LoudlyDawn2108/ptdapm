import type { CreateEmployeeInput, UpdateEmployeeInput } from "@hrms/shared";
import { type SQL, and, eq, ilike, ne, or } from "drizzle-orm";
import { ConflictError, FieldValidationError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import type { NewEmployee } from "../../db/schema";
import {
  type Employee,
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

export async function list(
  page: number,
  pageSize: number,
  search?: string,
  orgUnitId?: string,
  workStatus?: Employee["workStatus"],
  contractStatus?: Employee["contractStatus"],
) {
  const normalizedSearch = normalizeOptional(search);
  const normalizedOrgUnitId = normalizeOptional(orgUnitId);
  const normalizedWorkStatus = normalizeOptional(workStatus) as Employee["workStatus"] | undefined;
  const normalizedContractStatus = normalizeOptional(contractStatus) as
    | Employee["contractStatus"]
    | undefined;

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

export async function getById(id: string): Promise<Employee> {
  const [employee] = await db.select().from(employees).where(eq(employees.id, id));
  if (!employee) throw new NotFoundError("Không tìm thấy nhân viên");
  return employee;
}

export async function getAggregateById(id: string) {
  const employee = await getById(id);

  const [familyMembers, bankAccounts, previousJobs, partyMemberships, allowances] =
    await Promise.all([
      db.select().from(employeeFamilyMembers).where(eq(employeeFamilyMembers.employeeId, id)),
      db.select().from(employeeBankAccounts).where(eq(employeeBankAccounts.employeeId, id)),
      db.select().from(employeePreviousJobs).where(eq(employeePreviousJobs.employeeId, id)),
      db.select().from(employeePartyMemberships).where(eq(employeePartyMemberships.employeeId, id)),
      db.select().from(employeeAllowances).where(eq(employeeAllowances.employeeId, id)),
    ]);

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
  const staffCode = normalizeOptional(data.staffCode ?? undefined);
  const nationalId = normalizeOptional(data.nationalId);
  const email = normalizeOptional(data.email);

  if (!nationalId) {
    throw new FieldValidationError({ nationalId: "Số CCCD/CMND không hợp lệ" });
  }

  if (!email) {
    throw new FieldValidationError({ email: "Email không hợp lệ" });
  }

  if (await hasConflict(eq(employees.nationalId, nationalId))) {
    throw new ConflictError("Số CCCD/CMND đã tồn tại");
  }

  if (await hasConflict(eq(employees.email, email))) {
    throw new ConflictError("Email đã tồn tại");
  }

  if (staffCode && (await hasConflict(eq(employees.staffCode, staffCode)))) {
    throw new ConflictError("Mã cán bộ đã tồn tại");
  }

  const { staffCode: _staffCode, ...rest } = data;

  const payload = undefinedToNull(rest) as Omit<NewEmployee, "staffCode">;

  const insertValues = staffCode ? { ...payload, staffCode } : payload;

  const [created] = await db
    .insert(employees)
    .values(insertValues as NewEmployee)
    .returning();
  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(id: string, data: UpdateEmployeeInput): Promise<Employee> {
  await getById(id);

  if (Object.keys(data).length === 0) {
    throw new FieldValidationError({}, "Không có dữ liệu cập nhật");
  }

  const staffCode = normalizeOptional(data.staffCode ?? undefined);
  const nationalId = normalizeOptional(data.nationalId ?? undefined);
  const email = normalizeOptional(data.email ?? undefined);

  if (nationalId) {
    const condition = and(eq(employees.nationalId, nationalId), ne(employees.id, id));
    if (condition && (await hasConflict(condition))) {
      throw new ConflictError("Số CCCD/CMND đã tồn tại");
    }
  }

  if (email) {
    const condition = and(eq(employees.email, email), ne(employees.id, id));
    if (condition && (await hasConflict(condition))) {
      throw new ConflictError("Email đã tồn tại");
    }
  }

  if (staffCode) {
    const condition = and(eq(employees.staffCode, staffCode), ne(employees.id, id));
    if (condition && (await hasConflict(condition))) {
      throw new ConflictError("Mã cán bộ đã tồn tại");
    }
  }

  const { staffCode: _staffCode, ...rest } = data;

  const payload = undefinedToNull({
    ...rest,
    updatedAt: new Date(),
  }) as Partial<Omit<NewEmployee, "staffCode">>;

  const setValues = staffCode ? { ...payload, staffCode } : payload;

  const [updated] = await db
    .update(employees)
    .set(setValues as Partial<NewEmployee>)
    .where(eq(employees.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);
  await db.delete(employees).where(eq(employees.id, id));
  return { id };
}
