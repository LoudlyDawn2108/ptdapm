import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  employeeListOptions,
  useDeleteEmployee,
} from "@/features/employees/api";
import {
  AdvancedFilterPanel,
  type EmployeeFilterValues,
} from "@/features/employees/components/AdvancedFilterPanel";
import {
  WorkStatus,
  Gender,
  ContractStatus,
  AcademicRank,
} from "@hrms/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  workStatus: z.string().optional(),
  gender: z.string().optional(),
  contractStatus: z.string().optional(),
  academicRank: z.string().optional(),
  orgUnitId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/employees/")(
  {
    validateSearch: searchSchema,
    component: EmployeesPage,
  },
);

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
    workStatus: search.workStatus || undefined,
    gender: search.gender || undefined,
    contractStatus: search.contractStatus || undefined,
    academicRank: search.academicRank || undefined,
    orgUnitId: search.orgUnitId || undefined,
  };

  const { data, isLoading } = useQuery(employeeListOptions(params));
  const result = data?.data;

  // Count active filters for badge display
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.workStatus) count++;
    if (search.gender) count++;
    if (search.contractStatus) count++;
    if (search.academicRank) count++;
    if (search.orgUnitId) count++;
    return count;
  }, [search.workStatus, search.gender, search.contractStatus, search.academicRank, search.orgUnitId]);

  const handleFilterChange = (filters: EmployeeFilterValues) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...filters,
        page: 1,
      }),
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "staffCode",
      header: "Mã NV",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.staffCode ?? "—"}
        </span>
      ),
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
      accessorKey: "nationalId",
      header: "CCCD",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.nationalId ?? "—"}
        </span>
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
      header: "SĐT",
      cell: ({ row }) => row.original.phone ?? "—",
    },
    {
      accessorKey: "currentOrgUnitName",
      header: "Đơn vị công tác",
      cell: ({ row }) => (
        <span className="max-w-[160px] truncate block" title={row.original.currentOrgUnitName}>
          {row.original.currentOrgUnitName ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "academicRank",
      header: "Chức danh KH",
      cell: ({ row }) => {
        const r = AcademicRank[row.original.academicRank as keyof typeof AcademicRank];
        return r?.label ?? "—";
      },
    },
    {
      accessorKey: "workStatus",
      header: "TT Làm việc",
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
      accessorKey: "contractStatus",
      header: "TT Hợp đồng",
      cell: ({ row }) => {
        const cs =
          ContractStatus[row.original.contractStatus as keyof typeof ContractStatus];
        return (
          <StatusBadgeFromCode
            code={row.original.contractStatus}
            label={cs?.label ?? row.original.contractStatus}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild title="Xem chi tiết">
            <Link
              to="/employees/$employeeId"
              params={{ employeeId: row.original.id }}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild title="Chỉnh sửa">
            <Link
              to="/employees/$employeeId"
              params={{ employeeId: row.original.id }}
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm" title="Xóa">
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
        title="Quản lý hồ sơ nhân sự"
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

      {/* ───── Search + Filters ───── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm kiếm theo tên, mã NV, CCCD, email, SĐT..."
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <AdvancedFilterPanel
          values={{
            workStatus: search.workStatus,
            gender: search.gender,
            contractStatus: search.contractStatus,
            academicRank: search.academicRank,
            orgUnitId: search.orgUnitId,
          }}
          onChange={handleFilterChange}
          activeCount={activeFilterCount}
        />
      </div>

      {/* ───── Data Table ───── */}
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
        emptyMessage="Không tìm thấy hồ sơ phù hợp."
      />
    </div>
  );
}
