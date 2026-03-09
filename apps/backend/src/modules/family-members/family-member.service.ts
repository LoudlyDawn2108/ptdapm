import type {
  CreateEmployeeFamilyMemberInput,
  PaginatedResponse,
  UpdateEmployeeFamilyMemberInput,
} from "@hrms/shared";
import { and, eq } from "drizzle-orm";
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
  employeeId: string,
  id: string,
  data: UpdateEmployeeFamilyMemberInput,
): Promise<EmployeeFamilyMember> {
  const [existing] = await db
    .select()
    .from(employeeFamilyMembers)
    .where(and(eq(employeeFamilyMembers.id, id), eq(employeeFamilyMembers.employeeId, employeeId)));

  if (!existing) throw new NotFoundError("Không tìm thấy thân nhân");

  const [updated] = await db
    .update(employeeFamilyMembers)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(employeeFamilyMembers.id, id), eq(employeeFamilyMembers.employeeId, employeeId)))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  const [existing] = await db
    .select()
    .from(employeeFamilyMembers)
    .where(and(eq(employeeFamilyMembers.id, id), eq(employeeFamilyMembers.employeeId, employeeId)));

  if (!existing) throw new NotFoundError("Không tìm thấy thân nhân");

  await db
    .delete(employeeFamilyMembers)
    .where(and(eq(employeeFamilyMembers.id, id), eq(employeeFamilyMembers.employeeId, employeeId)));
  return { id };
}
