import type {
  CreateEmployeeAllowanceInput,
  PaginatedResponse,
  UpdateEmployeeAllowanceInput,
} from "@hrms/shared";
import { and, eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeAllowance, allowanceTypes, employeeAllowances } from "../../db/schema";

function normalizeAmount(amount?: number | null): string | null | undefined {
  if (amount === null) return null;
  if (typeof amount === "number") return amount.toString();
  return undefined;
}

async function ensureAllowanceTypeExists(allowanceTypeId: string): Promise<void> {
  const [item] = await db
    .select({ id: allowanceTypes.id })
    .from(allowanceTypes)
    .where(eq(allowanceTypes.id, allowanceTypeId))
    .limit(1);

  if (!item) throw new NotFoundError("Không tìm thấy loại phụ cấp");
}

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeeAllowance>> {
  const where = eq(employeeAllowances.employeeId, employeeId);
  const [items, total]: [EmployeeAllowance[], number] = await Promise.all([
    db
      .select()
      .from(employeeAllowances)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeAllowances.createdAt),
    countRows(employeeAllowances, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeeAllowance> {
  const [item] = await db.select().from(employeeAllowances).where(eq(employeeAllowances.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy phụ cấp");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeeAllowanceInput,
): Promise<EmployeeAllowance> {
  await ensureAllowanceTypeExists(data.allowanceTypeId);
  const { amount, ...rest } = data;
  const normalizedAmount = normalizeAmount(amount ?? undefined);
  const payload =
    normalizedAmount === undefined
      ? { ...rest, employeeId }
      : { ...rest, amount: normalizedAmount, employeeId };

  const [created] = await db.insert(employeeAllowances).values(payload).returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmployeeAllowanceInput,
): Promise<EmployeeAllowance> {
  const [existing] = await db
    .select()
    .from(employeeAllowances)
    .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)));

  if (!existing) throw new NotFoundError("Không tìm thấy phụ cấp");

  if (data.allowanceTypeId) {
    await ensureAllowanceTypeExists(data.allowanceTypeId);
  }

  const { amount, ...rest } = data;
  const normalizedAmount = normalizeAmount(amount ?? undefined);
  const payload = {
    ...rest,
    ...(normalizedAmount !== undefined ? { amount: normalizedAmount } : {}),
    updatedAt: new Date(),
  };
  const [updated] = await db
    .update(employeeAllowances)
    .set(payload)
    .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  const [existing] = await db
    .select()
    .from(employeeAllowances)
    .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)));

  if (!existing) throw new NotFoundError("Không tìm thấy phụ cấp");

  await db
    .delete(employeeAllowances)
    .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)));
  return { id };
}
