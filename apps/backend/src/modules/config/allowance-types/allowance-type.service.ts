import type {
  CreateAllowanceTypeInput,
  DropdownOption,
  PaginatedResponse,
  UpdateAllowanceTypeInput,
} from "@hrms/shared";
import { type SQL, and, eq, ilike, ne } from "drizzle-orm";
import { queryDropdown } from "../../../common/utils/dropdown";
import { BadRequestError, ConflictError, NotFoundError } from "../../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../../common/utils/pagination";
import { db } from "../../../db";
import { type AllowanceType, allowanceTypes } from "../../../db/schema";
import { employeeAllowances } from "../../../db/schema";

export async function list(
  page: number,
  pageSize: number,
  search?: string,
): Promise<PaginatedResponse<AllowanceType>> {
  const where: SQL | undefined = search
    ? ilike(allowanceTypes.allowanceName, `%${search}%`)
    : undefined;

  const [items, total] = await Promise.all([
    db
      .select()
      .from(allowanceTypes)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(allowanceTypes.createdAt),
    countRows(allowanceTypes, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function dropdown(search?: string, limit?: number): Promise<DropdownOption[]> {
  return queryDropdown(
    {
      table: allowanceTypes,
      valueColumn: allowanceTypes.id,
      labelColumns: [allowanceTypes.allowanceName],
      statusColumn: allowanceTypes.status,
    },
    search,
    limit,
  );
}

export async function getById(id: string): Promise<AllowanceType> {
  const [item] = await db.select().from(allowanceTypes).where(eq(allowanceTypes.id, id));
  if (!item) throw new NotFoundError("Không tìm thấy loại phụ cấp");
  return item;
}

export async function create(data: CreateAllowanceTypeInput): Promise<AllowanceType> {
  const existing = await db
    .select({ id: allowanceTypes.id })
    .from(allowanceTypes)
    .where(eq(allowanceTypes.allowanceName, data.allowanceName))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Loại phụ cấp đã tồn tại");
  }

  const [created] = await db
    .insert(allowanceTypes)
    .values({
      ...data,
      defaultAmount: data.defaultAmount.toString(),
    })
    .returning();
  if (!created) throw new BadRequestError("Không thể tạo loại phụ cấp");
  return created;
}

export async function update(id: string, data: UpdateAllowanceTypeInput): Promise<AllowanceType> {
  const item = await getById(id);
  const { defaultAmount, ...rest } = data;

  // Cannot edit if inactive (except status toggle)
  if (item.status === "inactive" && !rest.status) {
    throw new BadRequestError("Không thể chỉnh sửa danh mục đã ngừng sử dụng");
  }

  if (rest.allowanceName && rest.allowanceName !== item.allowanceName) {
    const existing = await db
      .select({ id: allowanceTypes.id })
      .from(allowanceTypes)
      .where(and(eq(allowanceTypes.allowanceName, rest.allowanceName), ne(allowanceTypes.id, id)))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictError("Loại phụ cấp đã tồn tại");
    }
  }

  const [updated] = await db
    .update(allowanceTypes)
    .set({
      ...rest,
      ...(defaultAmount !== undefined ? { defaultAmount: defaultAmount.toString() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(allowanceTypes.id, id))
    .returning();

  if (!updated) throw new BadRequestError("Không thể cập nhật loại phụ cấp");
  return updated;
}
