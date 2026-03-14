import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import type { CatalogStatusCode } from "@hrms/shared";
import { CatalogStatus } from "@hrms/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { allowanceTypeStrings as t } from "./strings";

export interface AllowanceTypeRow {
  id: string;
  allowanceName: string;
  description: string | null;
  calcMethod: string | null;
  status: CatalogStatusCode;
}

export const allowanceTypeColumns: ColumnDef<AllowanceTypeRow, unknown>[] = [
  { accessorKey: "allowanceName", header: t.columns.allowanceName },
  {
    accessorKey: "description",
    header: t.columns.description,
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    accessorKey: "calcMethod",
    header: t.columns.calcMethod,
    cell: ({ row }) => row.original.calcMethod ?? "—",
  },
  {
    accessorKey: "status",
    header: t.columns.status,
    cell: ({ row }) => {
      const s = CatalogStatus[row.original.status as keyof typeof CatalogStatus];
      return (
        <StatusBadgeFromCode code={row.original.status} label={s?.label ?? row.original.status} />
      );
    },
  },
];
