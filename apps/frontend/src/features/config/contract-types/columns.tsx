import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import type { CatalogStatusCode } from "@hrms/shared";
import { CatalogStatus } from "@hrms/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { contractTypeStrings as t } from "./strings";

export interface ContractTypeRow {
  id: string;
  contractTypeName: string;
  minMonths: number;
  maxMonths: number;
  maxRenewals: number;
  status: CatalogStatusCode;
}

export const contractTypeColumns: ColumnDef<ContractTypeRow, unknown>[] = [
  { accessorKey: "contractTypeName", header: t.columns.contractTypeName },
  { accessorKey: "minMonths", header: t.columns.minMonths },
  { accessorKey: "maxMonths", header: t.columns.maxMonths },
  { accessorKey: "maxRenewals", header: t.columns.maxRenewals },
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
