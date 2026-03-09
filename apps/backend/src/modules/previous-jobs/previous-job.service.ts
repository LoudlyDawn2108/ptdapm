import type {
  CreateEmployeePreviousJobInput,
  PaginatedResponse,
  UpdateEmployeePreviousJobInput,
} from "@hrms/shared";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeePreviousJob, employeePreviousJobs } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeePreviousJob>> {
  const where = eq(employeePreviousJobs.employeeId, employeeId);
  const [items, total]: [EmployeePreviousJob[], number] = await Promise.all([
    db
      .select()
      .from(employeePreviousJobs)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeePreviousJobs.createdAt),
    countRows(employeePreviousJobs, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeePreviousJob> {
  const [item] = await db
    .select()
    .from(employeePreviousJobs)
    .where(eq(employeePreviousJobs.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy quá trình công tác");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeePreviousJobInput,
): Promise<EmployeePreviousJob> {
  const [created] = await db
    .insert(employeePreviousJobs)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  id: string,
  data: UpdateEmployeePreviousJobInput,
): Promise<EmployeePreviousJob> {
  await getById(id);

  const [updated] = await db
    .update(employeePreviousJobs)
    .set({ ...data })
    .where(eq(employeePreviousJobs.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);
  await db.delete(employeePreviousJobs).where(eq(employeePreviousJobs.id, id));
  return { id };
}
