import type {
  CreateEmployeeAllowanceInput,
  PaginatedResponse,
  UpdateEmployeeAllowanceInput,
} from "@hrms/shared";
import { and, eq } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeAllowance, allowanceTypes, employeeAllowances } from "../../db/schema";

function normalizeAmount(amount?: number): string | undefined {
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

async function getByIdForEmployee(employeeId: string, id: string): Promise<EmployeeAllowance> {
  const [item] = await db
    .select()
    .from(employeeAllowances)
    .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)));

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

  if (!created) throw new BadRequestError("Không thể tạo phụ cấp");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmployeeAllowanceInput,
): Promise<EmployeeAllowance> {
  await getByIdForEmployee(employeeId, id);

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

  if (!updated) throw new BadRequestError("Không thể cập nhật phụ cấp");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  await getByIdForEmployee(employeeId, id);
  await db
    .delete(employeeAllowances)
    .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)));
  return { id };
}
