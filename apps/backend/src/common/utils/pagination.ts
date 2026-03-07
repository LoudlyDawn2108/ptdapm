import type { PaginatedResponse } from "@hrms/shared";
import { type SQL, sql } from "drizzle-orm";
import type { PgSelect, PgTable } from "drizzle-orm/pg-core";
import { db } from "../../db";

export function withPagination<T extends PgSelect>(qb: T, page: number, pageSize: number) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export async function countRows(table: PgTable, where?: SQL): Promise<number> {
  const result = await db.select({ count: sql<number>`count(*)` }).from(table).where(where);
  return Number(result[0]?.count ?? 0);
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return { items, total, page, pageSize };
}
