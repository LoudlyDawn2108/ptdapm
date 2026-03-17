import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/date-utils";
import { TrainingStatus, type TrainingStatusCode } from "@hrms/shared";
import type { ColumnDef } from "@tanstack/react-table";

export interface TrainingCourseRow {
  id: string;
  courseName: string;
  courseTypeId: string;
  trainingFrom: string;
  trainingTo: string;
  location?: string | null;
  cost?: string | null;
  commitment?: string | null;
  certificateName?: string | null;
  certificateType?: string | null;
  registrationFrom?: string | null;
  registrationTo?: string | null;
  registrationLimit?: number | null;
  status: TrainingStatusCode;
}

export interface TrainingCourseRowWithType extends TrainingCourseRow {
  courseTypeName?: string;
}

export function buildTrainingCourseColumns(
  typeMap: Map<string, string>,
  pageIndex: number,
  pageSize: number,
): ColumnDef<TrainingCourseRowWithType, unknown>[] {
  return [
    {
      id: "stt",
      header: "STT",
      cell: ({ row }) => pageIndex * pageSize + row.index + 1,
      size: 60,
    },
    {
      accessorKey: "courseName",
      header: "Tên khóa đào tạo",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-800">
          {row.original.courseName}
        </span>
      ),
    },
    {
      id: "courseType",
      header: "Loại hình đào tạo",
      cell: ({ row }) =>
        typeMap.get(row.original.courseTypeId) ??
        row.original.courseTypeName ??
        "—",
    },
    {
      id: "period",
      header: "Thời gian đào tạo",
      cell: ({ row }) => {
        const from = formatDate(row.original.trainingFrom);
        const to = formatDate(row.original.trainingTo);
        return (
          <span className="whitespace-nowrap">
            {from} – {to}
          </span>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Địa điểm",
      cell: ({ row }) => row.original.location ?? "—",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const s =
          TrainingStatus[row.original.status as keyof typeof TrainingStatus];
        return (
          <StatusBadgeFromCode
            code={row.original.status}
            label={s?.label ?? row.original.status}
          />
        );
      },
    },
  ];
}
