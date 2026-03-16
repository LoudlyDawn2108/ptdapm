import type {
  CreateForeignWorkPermitInput,
  PaginatedResponse,
  UpdateForeignWorkPermitInput,
} from "@hrms/shared";
import { eq } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeForeignWorkPermit, employeeForeignWorkPermits } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeeForeignWorkPermit>> {
  const where = eq(employeeForeignWorkPermits.employeeId, employeeId);
  const [items, total]: [EmployeeForeignWorkPermit[], number] = await Promise.all([
    db
      .select()
      .from(employeeForeignWorkPermits)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeForeignWorkPermits.createdAt),
    countRows(employeeForeignWorkPermits, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeeForeignWorkPermit> {
  const [item] = await db
    .select()
    .from(employeeForeignWorkPermits)
    .where(eq(employeeForeignWorkPermits.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy giấy phép lao động");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateForeignWorkPermitInput,
): Promise<EmployeeForeignWorkPermit> {
  const [created] = await db
    .insert(employeeForeignWorkPermits)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new BadRequestError("Không thể tạo giấy phép lao động");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateForeignWorkPermitInput,
): Promise<EmployeeForeignWorkPermit> {
  const existing = await getById(id);
  if (existing.employeeId !== employeeId)
    throw new NotFoundError("Không tìm thấy giấy phép lao động");

  const [updated] = await db
    .update(employeeForeignWorkPermits)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employeeForeignWorkPermits.id, id))
    .returning();

  if (!updated) throw new BadRequestError("Không thể cập nhật giấy phép lao động");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  const existing = await getById(id);
  if (existing.employeeId !== employeeId)
    throw new NotFoundError("Không tìm thấy giấy phép lao động");

  await db.delete(employeeForeignWorkPermits).where(eq(employeeForeignWorkPermits.id, id));
  return { id };
}
