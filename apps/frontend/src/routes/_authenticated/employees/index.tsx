import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  employeeListOptions,
  useDeleteEmployee,
} from "@/features/employees/api";
import {
  WorkStatus,
  Gender,
  enumToSortedList,
} from "@hrms/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Eye, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  workStatus: z.string().optional(),
  gender: z.string().optional(),
  orgUnitId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/employees/")({
  validateSearch: searchSchema,
  component: EmployeesPage,
});

function EmployeesPage() {
  const navigate = useNavigate({ from: "/employees" });
  const search = Route.useSearch();
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchText);
  const deleteMutation = useDeleteEmployee();

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch || undefined,
    workStatus: search.workStatus,
    gender: search.gender,
    orgUnitId: search.orgUnitId,
  };

  const { data, isLoading } = useQuery(employeeListOptions(params));
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
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
        const ws =
          WorkStatus[row.original.workStatus as keyof typeof WorkStatus];
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
            <Link
              to="/employees/$employeeId"
              params={{ employeeId: row.original.id }}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
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
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý nhân sự"
        description="Danh sách cán bộ, giảng viên, nhân viên"
        actions={
          <Button asChild>
            <Link to="/employees/new">
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân sự
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex gap-3">
        <Input
          placeholder="Tìm kiếm theo tên, mã NV, email..."
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          value={search.workStatus ?? "all"}
          onValueChange={(v) =>
            navigate({
              search: (prev) => ({
                ...prev,
                workStatus: v === "all" ? undefined : v,
                page: 1,
              }),
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {enumToSortedList(WorkStatus).map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={search.gender ?? "all"}
          onValueChange={(v) =>
            navigate({
              search: (prev) => ({
                ...prev,
                gender: v === "all" ? undefined : v,
                page: 1,
              }),
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {enumToSortedList(Gender).map((g) => (
              <SelectItem key={g.code} value={g.code}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={result?.items ?? []}
        pageCount={result?.totalPages ?? 0}
        pagination={{
          pageIndex: (search.page ?? 1) - 1,
          pageSize: search.pageSize ?? 20,
        }}
        onPaginationChange={(updater) => {
          const next =
            typeof updater === "function"
              ? updater({
                  pageIndex: (search.page ?? 1) - 1,
                  pageSize: search.pageSize ?? 20,
                })
              : updater;
          navigate({
            search: (prev) => ({
              ...prev,
              page: next.pageIndex + 1,
              pageSize: next.pageSize,
            }),
          });
        }}
        isLoading={isLoading}
        emptyMessage="Không có nhân sự nào"
      />
    </div>
  );
}
