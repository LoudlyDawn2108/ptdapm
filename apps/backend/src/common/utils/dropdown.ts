import type { CatalogStatusCode, DropdownOption } from "@hrms/shared";
import { type SQL, and, eq, ilike, or } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "../../db";

interface DropdownConfig {
  table: PgTable;
  valueColumn: PgColumn;
  labelColumns: PgColumn[];
  labelSeparator?: string;
  statusColumn: PgColumn;
  activeStatus?: CatalogStatusCode;
  extraWhere?: SQL;
}

export async function queryDropdown(
  config: DropdownConfig,
  search?: string,
  limit = 20,
): Promise<DropdownOption[]> {
  const {
    table,
    valueColumn,
    labelColumns,
    labelSeparator = " - ",
    statusColumn,
    activeStatus = "active",
    extraWhere,
  } = config;

  const conditions: SQL[] = [eq(statusColumn, activeStatus)];

  if (search) {
    const searchConditions = labelColumns.map((col) => ilike(col, `%${search}%`));
    const orCondition =
      searchConditions.length === 1 ? searchConditions[0] : or(...searchConditions);
    if (orCondition) conditions.push(orCondition);
  }

  if (extraWhere) conditions.push(extraWhere);

  const selectFields: Record<string, PgColumn> = { value: valueColumn };
  for (let i = 0; i < labelColumns.length; i++) {
    selectFields[`label${i}`] = labelColumns[i] as PgColumn;
  }

  const rows = await db
    .select(selectFields)
    .from(table)
    .where(and(...conditions))
    .limit(limit);

  return rows.map((row) => {
    const labelParts: string[] = [];
    for (let i = 0; i < labelColumns.length; i++) {
      const val = row[`label${i}`];
      if (val) labelParts.push(String(val));
    }
    return {
      value: String(row.value),
      label: labelParts.join(labelSeparator),
    };
  });
}
