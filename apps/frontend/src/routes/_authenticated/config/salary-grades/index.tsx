import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import {
  salaryGradeListOptions,
  useDeleteSalaryGrade,
} from "@/features/config/api";
import { CatalogStatus, enumToSortedList } from "@hrms/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Trash2, Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/config/salary-grades/",
)({
  validateSearch: searchSchema,
  component: SalaryGradesPage,
});

function SalaryGradesPage() {
  const navigate = useNavigate({ from: "/config/salary-grades" });
  const search = Route.useSearch();
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchText);
  const deleteMutation = useDeleteSalaryGrade();

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useQuery(salaryGradeListOptions(params));
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
    { accessorKey: "gradeCode", header: "Mã ngạch" },
    { accessorKey: "gradeName", header: "Tên ngạch lương" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const s = CatalogStatus[row.original.status as keyof typeof CatalogStatus];
        return (
          <StatusBadgeFromCode
            code={row.original.status}
            label={s?.label ?? row.original.status}
          />
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          }
          title="Xóa ngạch lương"
          description={`Bạn có chắc muốn xóa ngạch lương "${row.original.gradeName}"?`}
          confirmLabel="Xóa"
          variant="destructive"
          onConfirm={() =>
            deleteMutation.mutate(row.original.id, {
              onSuccess: () => toast.success("Đã xóa ngạch lương"),
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ngạch lương"
        description="Quản lý hệ thống ngạch lương và bậc lương"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm ngạch
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo mã ngạch, tên..."
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
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
        emptyMessage="Không có ngạch lương nào"
      />
    </div>
  );
}
