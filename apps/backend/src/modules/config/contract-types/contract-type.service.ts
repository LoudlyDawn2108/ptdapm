import type {
  CreateContractTypeInput,
  DropdownOption,
  PaginatedResponse,
  UpdateContractTypeInput,
} from "@hrms/shared";
import { type SQL, eq, ilike } from "drizzle-orm";
import { queryDropdown } from "../../../common/utils/dropdown";
import { ConflictError, NotFoundError } from "../../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../../common/utils/pagination";
import { db } from "../../../db";
import { type ContractType, contractTypes } from "../../../db/schema";

export async function list(
  page: number,
  pageSize: number,
  search?: string,
): Promise<PaginatedResponse<ContractType>> {
  const where: SQL | undefined = search
    ? ilike(contractTypes.contractTypeName, `%${search}%`)
    : undefined;

  const [items, total]: [ContractType[], number] = await Promise.all([
    db
      .select()
      .from(contractTypes)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(contractTypes.createdAt),
    countRows(contractTypes, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function dropdown(search?: string, limit?: number): Promise<DropdownOption[]> {
  return queryDropdown(
    {
      table: contractTypes,
      valueColumn: contractTypes.id,
      labelColumns: [contractTypes.contractTypeName],
      statusColumn: contractTypes.status,
    },
    search,
    limit,
  );
}

export async function getById(id: string): Promise<ContractType> {
  const [item] = await db.select().from(contractTypes).where(eq(contractTypes.id, id));

  if (!item) throw new NotFoundError("Không tìm thấy loại hợp đồng");
  return item;
}

export async function create(data: CreateContractTypeInput): Promise<ContractType> {
  const existing = await db
    .select({ id: contractTypes.id })
    .from(contractTypes)
    .where(eq(contractTypes.contractTypeName, data.contractTypeName))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Loại hợp đồng đã tồn tại");
  }

  const [created] = await db.insert(contractTypes).values(data).returning();
  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(id: string, data: UpdateContractTypeInput): Promise<ContractType> {
  await getById(id);

  const [updated] = await db
    .update(contractTypes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contractTypes.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);

  await db.delete(contractTypes).where(eq(contractTypes.id, id));
  return { id };
}
