import type {
  CreateEmployeeCertificationInput,
  PaginatedResponse,
  UpdateEmployeeCertificationInput,
} from "@hrms/shared";
import { eq } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { type EmployeeCertification, employeeCertifications } from "../../db/schema";

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmployeeCertification>> {
  const where = eq(employeeCertifications.employeeId, employeeId);
  const [items, total]: [EmployeeCertification[], number] = await Promise.all([
    db
      .select()
      .from(employeeCertifications)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeCertifications.createdAt),
    countRows(employeeCertifications, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<EmployeeCertification> {
  const [item] = await db
    .select()
    .from(employeeCertifications)
    .where(eq(employeeCertifications.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy chứng chỉ");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeeCertificationInput,
): Promise<EmployeeCertification> {
  const [created] = await db
    .insert(employeeCertifications)
    .values({ ...data, employeeId })
    .returning();

  if (!created) throw new BadRequestError("Không thể tạo chứng chỉ");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmployeeCertificationInput,
): Promise<EmployeeCertification> {
  const existing = await getById(id);
  if (existing.employeeId !== employeeId) throw new NotFoundError("Không tìm thấy chứng chỉ");

  const [updated] = await db
    .update(employeeCertifications)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employeeCertifications.id, id))
    .returning();

  if (!updated) throw new BadRequestError("Không thể cập nhật chứng chỉ");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  const existing = await getById(id);
  if (existing.employeeId !== employeeId) throw new NotFoundError("Không tìm thấy chứng chỉ");

  await db.delete(employeeCertifications).where(eq(employeeCertifications.id, id));
  return { id };
}
