import type {
  CreateEmployeePartyMembershipInput,
  PaginatedResponse,
  UpdateEmployeePartyMembershipInput,
} from "@hrms/shared";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeePartyMembership, employeePartyMemberships } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeePartyMembership>> {
  const where = eq(employeePartyMemberships.employeeId, employeeId);
  const [items, total]: [EmployeePartyMembership[], number] = await Promise.all([
    db
      .select()
      .from(employeePartyMemberships)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeePartyMemberships.createdAt),
    countRows(employeePartyMemberships, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeePartyMembership> {
  const [item] = await db
    .select()
    .from(employeePartyMemberships)
    .where(eq(employeePartyMemberships.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy thông tin đoàn/đảng");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeePartyMembershipInput,
): Promise<EmployeePartyMembership> {
  const [created] = await db
    .insert(employeePartyMemberships)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  id: string,
  data: UpdateEmployeePartyMembershipInput,
): Promise<EmployeePartyMembership> {
  await getById(id);

  const [updated] = await db
    .update(employeePartyMemberships)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employeePartyMemberships.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);
  await db.delete(employeePartyMemberships).where(eq(employeePartyMemberships.id, id));
  return { id };
}
