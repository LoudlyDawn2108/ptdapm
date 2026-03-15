import type {
  CreateEmploymentContractInput,
  PaginatedResponse,
  UpdateEmploymentContractInput,
} from "@hrms/shared";
import { and, eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import {
  type EmploymentContract,
  contractTypes,
  employmentContracts,
  orgUnits,
} from "../../db/schema";

type EmploymentContractListItem = EmploymentContract & {
  contractTypeName: string;
  orgUnitName: string;
};

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

  if (!item) throw new NotFoundError("Không tìm thấy đơn vị công tác");
}

async function getByIdForEmployee(employeeId: string, id: string): Promise<EmploymentContract> {
  const [item] = await db
    .select()
    .from(employmentContracts)
    .where(and(eq(employmentContracts.id, id), eq(employmentContracts.employeeId, employeeId)))
    .limit(1);

  if (!item) throw new NotFoundError("Không tìm thấy hợp đồng");
  return item;
}

export async function listByEmployee(
  employeeId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<EmploymentContractListItem>> {
  const where = eq(employmentContracts.employeeId, employeeId);

  const [items, total]: [EmploymentContractListItem[], number] = await Promise.all([
    db
      .select({
        id: employmentContracts.id,
        employeeId: employmentContracts.employeeId,
        contractTypeId: employmentContracts.contractTypeId,
        contractNo: employmentContracts.contractNo,
        signedOn: employmentContracts.signedOn,
        effectiveFrom: employmentContracts.effectiveFrom,
        effectiveTo: employmentContracts.effectiveTo,
        orgUnitId: employmentContracts.orgUnitId,
        status: employmentContracts.status,
        contentHtml: employmentContracts.contentHtml,
        contractFileId: employmentContracts.contractFileId,
        createdByUserId: employmentContracts.createdByUserId,
        createdAt: employmentContracts.createdAt,
        updatedAt: employmentContracts.updatedAt,
        contractTypeName: contractTypes.contractTypeName,
        orgUnitName: orgUnits.unitName,
      })
      .from(employmentContracts)
      .innerJoin(contractTypes, eq(employmentContracts.contractTypeId, contractTypes.id))
      .innerJoin(orgUnits, eq(employmentContracts.orgUnitId, orgUnits.id))
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employmentContracts.createdAt),
    countRows(employmentContracts, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function create(
  employeeId: string,
  data: CreateEmploymentContractInput,
  userId?: string,
): Promise<EmploymentContract> {
  await Promise.all([
    ensureContractTypeExists(data.contractTypeId),
    ensureOrgUnitExists(data.orgUnitId),
  ]);

  const [created] = await db
    .insert(employmentContracts)
    .values({ ...data, employeeId, createdByUserId: userId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  employeeId: string,
  id: string,
  data: UpdateEmploymentContractInput,
): Promise<EmploymentContract> {
  await getByIdForEmployee(employeeId, id);

  if (data.contractTypeId) {
    await ensureContractTypeExists(data.contractTypeId);
  }

  if (data.orgUnitId) {
    await ensureOrgUnitExists(data.orgUnitId);
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
