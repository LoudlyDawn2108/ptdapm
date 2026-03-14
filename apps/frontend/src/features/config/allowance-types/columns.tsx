import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import type { CatalogStatusCode } from "@hrms/shared";
import { CatalogStatus } from "@hrms/shared";
import type { ColumnDef } from "@tanstack/react-table";

export interface AllowanceTypeRow {
  id: string;
  allowanceName: string;
  description: string | null;
  calcMethod: string | null;
  status: CatalogStatusCode;
}

export const allowanceTypeColumns: ColumnDef<AllowanceTypeRow, unknown>[] = [
  { accessorKey: "allowanceName", header: "Tên loại phụ cấp" },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    accessorKey: "calcMethod",
    header: "Phương thức tính",
    cell: ({ row }) => row.original.calcMethod ?? "—",
  },
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
