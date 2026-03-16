import type {
  CreateEmployeeContractInput,
  PaginatedResponse,
  UpdateEmployeeContractInput,
} from "@hrms/shared";
import type { ContractDocStatusCode } from "@hrms/shared";
import { type SQL, and, eq } from "drizzle-orm";
import { ConflictError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import {
  type EmploymentContract,
  contractTypes,
  employmentContracts,
} from "../../db/schema/contracts";
import { orgUnits } from "../../db/schema/organization";

async function ensureContractTypeExists(contractTypeId: string): Promise<void> {
  const [item] = await db
    .select({ id: contractTypes.id })
    .from(contractTypes)
    .where(eq(contractTypes.id, contractTypeId))
    .limit(1);

  if (!item) throw new NotFoundError("Không tìm thấy loại hợp đồng");
}

async function ensureOrgUnitExists(orgUnitId: string): Promise<void> {
  const [item] = await db
    .select({ id: orgUnits.id })
    .from(orgUnits)
    .where(eq(orgUnits.id, orgUnitId))
    .limit(1);

  if (!item) throw new NotFoundError("Không tìm thấy đơn vị");
}

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
  status?: ContractDocStatusCode,
): Promise<PaginatedResponse<EmploymentContract>> {
  const conditions: SQL[] = [eq(employmentContracts.employeeId, employeeId)];
  if (status) {
    conditions.push(eq(employmentContracts.status, status));
  }
  const where = and(...conditions);

  const [items, total]: [EmploymentContract[], number] = await Promise.all([
    db
      .select()
      .from(employmentContracts)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employmentContracts.createdAt),
    countRows(employmentContracts, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getByIdForEmployee(
  employeeId: string,
  id: string,
): Promise<EmploymentContract> {
  const [item] = await db
    .select()
    .from(employmentContracts)
    .where(and(eq(employmentContracts.id, id), eq(employmentContracts.employeeId, employeeId)));

  if (!item) throw new NotFoundError("Không tìm thấy hợp đồng");
  return item;
}

export async function create(
  employeeId: string,
  data: CreateEmployeeContractInput,
  createdByUserId: string,
): Promise<EmploymentContract> {
  await ensureContractTypeExists(data.contractTypeId);
  await ensureOrgUnitExists(data.orgUnitId);

  const existing = await db
    .select({ id: employmentContracts.id })
    .from(employmentContracts)
    .where(eq(employmentContracts.contractNo, data.contractNo))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Số hợp đồng đã tồn tại");
  }

  const [created] = await db
    .insert(employmentContracts)
    .values({ ...data, employeeId, createdByUserId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmployeeContractInput,
): Promise<EmploymentContract> {
  await getByIdForEmployee(employeeId, id);

  if (data.contractTypeId) {
    await ensureContractTypeExists(data.contractTypeId);
  }

  if (data.orgUnitId) {
    await ensureOrgUnitExists(data.orgUnitId);
  }

  if (data.contractNo) {
    const existing = await db
      .select({ id: employmentContracts.id })
      .from(employmentContracts)
      .where(and(eq(employmentContracts.contractNo, data.contractNo)))
      .limit(1);

    if (existing.length > 0 && existing[0]?.id !== id) {
      throw new ConflictError("Số hợp đồng đã tồn tại");
    }
  }

  const [updated] = await db
    .update(employmentContracts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(employmentContracts.id, id), eq(employmentContracts.employeeId, employeeId)))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(employeeId: string, id: string): Promise<{ id: string }> {
  await getByIdForEmployee(employeeId, id);
  await db
    .delete(employmentContracts)
    .where(and(eq(employmentContracts.id, id), eq(employmentContracts.employeeId, employeeId)));
  return { id };
}
