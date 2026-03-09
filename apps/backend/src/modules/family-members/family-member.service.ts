import type {
  CreateEmployeeFamilyMemberInput,
  PaginatedResponse,
  UpdateEmployeeFamilyMemberInput,
} from "@hrms/shared";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeFamilyMember, employeeFamilyMembers } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeeFamilyMember>> {
  const where = eq(employeeFamilyMembers.employeeId, employeeId);
  const [items, total]: [EmployeeFamilyMember[], number] = await Promise.all([
    db
      .select()
      .from(employeeFamilyMembers)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeFamilyMembers.createdAt),
    countRows(employeeFamilyMembers, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeeFamilyMember> {
  const [item] = await db
    .select()
    .from(employeeFamilyMembers)
    .where(eq(employeeFamilyMembers.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy thân nhân");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeeFamilyMemberInput,
): Promise<EmployeeFamilyMember> {
  const [created] = await db
    .insert(employeeFamilyMembers)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  id: string,
  data: UpdateEmployeeFamilyMemberInput,
): Promise<EmployeeFamilyMember> {
  await getById(id);

  const [updated] = await db
    .update(employeeFamilyMembers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employeeFamilyMembers.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);
  await db.delete(employeeFamilyMembers).where(eq(employeeFamilyMembers.id, id));
  return { id };
}
