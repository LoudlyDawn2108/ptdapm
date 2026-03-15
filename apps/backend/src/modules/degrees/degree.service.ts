import type {
  CreateEmployeeDegreeInput,
  PaginatedResponse,
  UpdateEmployeeDegreeInput,
} from "@hrms/shared";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeDegree, employeeDegrees } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeeDegree>> {
  const where = eq(employeeDegrees.employeeId, employeeId);
  const [items, total]: [EmployeeDegree[], number] = await Promise.all([
    db
      .select()
      .from(employeeDegrees)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeDegrees.createdAt),
    countRows(employeeDegrees, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeeDegree> {
  const [item] = await db.select().from(employeeDegrees).where(eq(employeeDegrees.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy bằng cấp");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeeDegreeInput,
): Promise<EmployeeDegree> {
  const [created] = await db
    .insert(employeeDegrees)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmployeeDegreeInput,
): Promise<EmployeeDegree> {
  const existing = await getById(id);
  if (existing.employeeId !== employeeId) throw new NotFoundError("Không tìm thấy bằng cấp");

  const [updated] = await db
    .update(employeeDegrees)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employeeDegrees.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  const existing = await getById(id);
  if (existing.employeeId !== employeeId) throw new NotFoundError("Không tìm thấy bằng cấp");

  await db.delete(employeeDegrees).where(eq(employeeDegrees.id, id));
  return { id };
}
