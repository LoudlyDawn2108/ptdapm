import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import type { CatalogStatusCode } from "@hrms/shared";
import { CatalogStatus } from "@hrms/shared";
import type { ColumnDef } from "@tanstack/react-table";

export interface SalaryGradeRow {
  id: string;
  gradeCode: string;
  gradeName: string;
  status: CatalogStatusCode;
}

export const salaryGradeColumns: ColumnDef<SalaryGradeRow, unknown>[] = [
  { accessorKey: "gradeCode", header: "Mã ngạch" },
  { accessorKey: "gradeName", header: "Tên ngạch lương" },
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
