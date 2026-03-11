import type {
  CreateEmployeeBankAccountInput,
  PaginatedResponse,
  UpdateEmployeeBankAccountInput,
} from "@hrms/shared";
import { and, eq, ne } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeBankAccount, employeeBankAccounts } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeeBankAccount>> {
  const [items, total]: [EmployeeBankAccount[], number] = await Promise.all([
    db
      .select()
      .from(employeeBankAccounts)
      .where(eq(employeeBankAccounts.employeeId, employeeId))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeBankAccounts.createdAt),
    countRows(employeeBankAccounts, eq(employeeBankAccounts.employeeId, employeeId)),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeeBankAccount> {
  const [item] = await db
    .select()
    .from(employeeBankAccounts)
    .where(eq(employeeBankAccounts.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy tài khoản ngân hàng");
  return item;
}

async function getByIdForEmployee(employeeId: string, id: string): Promise<EmployeeBankAccount> {
  const [item] = await db
    .select()
    .from(employeeBankAccounts)
    .where(and(eq(employeeBankAccounts.id, id), eq(employeeBankAccounts.employeeId, employeeId)));

  if (!item) throw new NotFoundError("Không tìm thấy tài khoản ngân hàng");
  return item;
}

async function clearOtherPrimary(employeeId: string, excludeId?: string) {
  const condition = excludeId
    ? and(eq(employeeBankAccounts.employeeId, employeeId), ne(employeeBankAccounts.id, excludeId))
    : eq(employeeBankAccounts.employeeId, employeeId);

  await db.update(employeeBankAccounts).set({ isPrimary: false }).where(condition);
}

export async function create(
  employeeId: string,
  data: CreateEmployeeBankAccountInput,
): Promise<EmployeeBankAccount> {
  if (data.isPrimary) {
    await clearOtherPrimary(employeeId);
  }

  const [created] = await db
    .insert(employeeBankAccounts)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmployeeBankAccountInput,
): Promise<EmployeeBankAccount> {
  const existing = await getByIdForEmployee(employeeId, id);

  if (data.isPrimary) {
    await clearOtherPrimary(existing.employeeId, id);
  }

  const [updated] = await db
    .update(employeeBankAccounts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(employeeBankAccounts.id, id), eq(employeeBankAccounts.employeeId, employeeId)))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  await getByIdForEmployee(employeeId, id);

  await db
    .delete(employeeBankAccounts)
    .where(and(eq(employeeBankAccounts.id, id), eq(employeeBankAccounts.employeeId, employeeId)));
  return { id };
}
