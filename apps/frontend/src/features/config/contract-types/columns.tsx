import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import type { CatalogStatusCode } from "@hrms/shared";
import { CatalogStatus } from "@hrms/shared";
import type { ColumnDef } from "@tanstack/react-table";

export interface ContractTypeRow {
  id: string;
  contractTypeName: string;
  minMonths: number;
  maxMonths: number;
  maxRenewals: number;
  status: CatalogStatusCode;
}

export const contractTypeColumns: ColumnDef<ContractTypeRow, unknown>[] = [
  { accessorKey: "contractTypeName", header: "Tên loại hợp đồng" },
  { accessorKey: "minMonths", header: "Tối thiểu (tháng)" },
  { accessorKey: "maxMonths", header: "Tối đa (tháng)" },
  { accessorKey: "maxRenewals", header: "Gia hạn tối đa" },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const s = CatalogStatus[row.original.status as keyof typeof CatalogStatus];
      return (
        <StatusBadgeFromCode code={row.original.status} label={s?.label ?? row.original.status} />
      );
    },
  },
];
