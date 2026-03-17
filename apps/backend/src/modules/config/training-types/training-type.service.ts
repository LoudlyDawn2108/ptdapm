import type { DropdownOption, PaginatedResponse } from "@hrms/shared";
import { ilike } from "drizzle-orm";
import { queryDropdown } from "../../../common/utils/dropdown";
import {
  buildPaginatedResponse,
  countRows,
} from "../../../common/utils/pagination";
import { db } from "../../../db";
import {
  type TrainingCourseType,
  trainingCourseTypes,
} from "../../../db/schema/training";

export async function list(
  page: number,
  pageSize: number,
  search?: string,
): Promise<PaginatedResponse<TrainingCourseType>> {
  const where = search
    ? ilike(trainingCourseTypes.typeName, `%${search}%`)
    : undefined;

  const [items, total] = await Promise.all([
    db
      .select()
      .from(trainingCourseTypes)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(trainingCourseTypes.createdAt),
    countRows(trainingCourseTypes, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function dropdown(
  search?: string,
  limit?: number,
): Promise<DropdownOption[]> {
  return queryDropdown(
    {
      table: trainingCourseTypes,
      valueColumn: trainingCourseTypes.id,
      labelColumns: [trainingCourseTypes.typeName],
      statusColumn: trainingCourseTypes.status,
    },
    search,
    limit,
  );
}
