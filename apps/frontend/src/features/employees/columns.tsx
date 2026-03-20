import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RoleGuard } from "@/components/shared/role-guard";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { EMPLOYEE_PROFILE_MANAGE_ROLES, Gender, WorkStatus } from "@hrms/shared";
import type { UseMutationResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type EmployeeListRow = {
  id: string;
  staffCode: string | null;
  fullName: string;
  gender: string | null;
  phone: string | null;
  email: string | null;
  currentOrgUnitName?: string | null;
  workStatus: string;
};

export function getEmployeeColumns(
  deleteMutation: UseMutationResult<unknown, Error, string>,
): ColumnDef<EmployeeListRow, unknown>[] {
  return [
    {
      accessorKey: "staffCode",
      header: "Mã NV",
      cell: ({ row }) => row.original.staffCode ?? "—",
    },
    {
      accessorKey: "fullName",
      header: "Họ tên",
      cell: ({ row }) => (
        <Link
          to="/employees/$employeeId"
          params={{ employeeId: row.original.id }}
          className="font-medium text-primary hover:underline"
        >
          {row.original.fullName}
        </Link>
      ),
    },
    {
      accessorKey: "gender",
      header: "Giới tính",
      cell: ({ row }) => {
        const g = Gender[row.original.gender as keyof typeof Gender];
        return g?.label ?? row.original.gender ?? "—";
      },
    },
    {
      accessorKey: "phone",
      header: "Điện thoại",
      cell: ({ row }) => row.original.phone ?? "—",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email ?? "—",
    },
    {
      accessorKey: "currentOrgUnitName",
      header: "Đơn vị",
      cell: ({ row }) => row.original.currentOrgUnitName ?? "—",
    },
    {
      accessorKey: "workStatus",
      header: "Trạng thái",
      cell: ({ row }) => {
        const ws = WorkStatus[row.original.workStatus as keyof typeof WorkStatus];
        return (
          <StatusBadgeFromCode
            code={row.original.workStatus}
            label={ws?.label ?? row.original.workStatus}
          />
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/employees/$employeeId" params={{ employeeId: row.original.id }}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <RoleGuard roles={[...EMPLOYEE_PROFILE_MANAGE_ROLES]}>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              }
              title="Xóa nhân sự"
              description={`Bạn có chắc muốn xóa nhân sự "${row.original.fullName}"?`}
              confirmLabel="Xóa"
              variant="destructive"
              onConfirm={() =>
                deleteMutation.mutate(row.original.id, {
                  onSuccess: () => toast.success("Đã xóa nhân sự"),
                })
              }
            />
          </RoleGuard>
        </div>
      ),
    },
  ];
}
