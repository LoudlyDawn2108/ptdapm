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
  {
    id: "code",
    header: "MÃ PC",
    cell: ({ row }) => {
      const code = `PC${String(row.index + 1).padStart(3, "0")}`;
      return <span className="font-mono text-xs font-semibold">{code}</span>;
    },
  },
  { accessorKey: "allowanceName", header: "TÊN LOẠI PHỤ CẤP" },
  {
    accessorKey: "description",
    header: "MÔ TẢ",
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    accessorKey: "calcMethod",
    header: "CÁCH TÍNH",
    cell: ({ row }) => row.original.calcMethod ?? "—",
  },
  {
    accessorKey: "status",
    header: "TRẠNG THÁI",
    cell: ({ row }) => {
      const s = CatalogStatus[row.original.status as keyof typeof CatalogStatus];
      return (
        <StatusBadgeFromCode code={row.original.status} label={s?.label ?? row.original.status} />
      );
    },
  },
];
