import type {
  CreateContractAppendixInput,
  PaginatedResponse,
  UpdateContractAppendixInput,
} from "@hrms/shared";
import { and, eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import {
  type ContractAppendix,
  contractAppendices,
  employmentContracts,
} from "../../db/schema/contracts";

async function ensureContractBelongsToEmployee(
  employeeId: string,
  contractId: string,
): Promise<void> {
  const [item] = await db
    .select({ id: employmentContracts.id })
    .from(employmentContracts)
    .where(
      and(eq(employmentContracts.id, contractId), eq(employmentContracts.employeeId, employeeId)),
    )
    .limit(1);

  if (!item) throw new NotFoundError("Không tìm thấy hợp đồng");
}

export async function listByContract(
  employeeId: string,
  contractId: string,
  page: number,
  pageSize: number,
): Promise<PaginatedResponse<ContractAppendix>> {
  await ensureContractBelongsToEmployee(employeeId, contractId);

  const where = eq(contractAppendices.contractId, contractId);

  const [items, total]: [ContractAppendix[], number] = await Promise.all([
    db
      .select()
      .from(contractAppendices)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(contractAppendices.createdAt),
    countRows(contractAppendices, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

async function getByIdForContract(contractId: string, id: string): Promise<ContractAppendix> {
  const [item] = await db
    .select()
    .from(contractAppendices)
    .where(and(eq(contractAppendices.id, id), eq(contractAppendices.contractId, contractId)));

  if (!item) throw new NotFoundError("Không tìm thấy phụ lục hợp đồng");
  return item;
}

export async function getById(
  employeeId: string,
  contractId: string,
  id: string,
): Promise<ContractAppendix> {
  await ensureContractBelongsToEmployee(employeeId, contractId);
  return getByIdForContract(contractId, id);
}

export async function create(
  employeeId: string,
  contractId: string,
  data: CreateContractAppendixInput,
  createdByUserId: string,
): Promise<ContractAppendix> {
  await ensureContractBelongsToEmployee(employeeId, contractId);

  const [created] = await db
    .insert(contractAppendices)
    .values({ ...data, contractId, createdByUserId })
    .returning();

  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(
  employeeId: string,
  contractId: string,
  id: string,
  data: UpdateContractAppendixInput,
): Promise<ContractAppendix> {
  await ensureContractBelongsToEmployee(employeeId, contractId);
  await getByIdForContract(contractId, id);

  const [updated] = await db
    .update(contractAppendices)
    .set(data)
    .where(and(eq(contractAppendices.id, id), eq(contractAppendices.contractId, contractId)))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(
  employeeId: string,
  contractId: string,
  id: string,
): Promise<{ id: string }> {
  await ensureContractBelongsToEmployee(employeeId, contractId);
  await getByIdForContract(contractId, id);

  await db
    .delete(contractAppendices)
    .where(and(eq(contractAppendices.id, id), eq(contractAppendices.contractId, contractId)));
  return { id };
}
