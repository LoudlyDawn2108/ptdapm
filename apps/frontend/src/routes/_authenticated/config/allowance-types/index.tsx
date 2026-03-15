import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { allowanceTypeListOptions, useDeleteAllowanceType } from "@/features/config/api";
import { useDebounce } from "@/hooks/use-debounce";
import { CatalogStatus } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/config/allowance-types/")({
  validateSearch: searchSchema,
  component: AllowanceTypesPage,
});

function AllowanceTypesPage() {
  const navigate = useNavigate({ from: "/config/allowance-types/" });
  const search = Route.useSearch();
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchText);
  const deleteMutation = useDeleteAllowanceType();

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useQuery(allowanceTypeListOptions(params));
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
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
          title="Xóa loại phụ cấp"
          description={`Bạn có chắc muốn xóa "${row.original.allowanceName}"?`}
          confirmLabel="Xóa"
          variant="destructive"
          onConfirm={() =>
            deleteMutation.mutate(row.original.id, {
              onSuccess: () => toast.success("Đã xóa loại phụ cấp"),
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Loại phụ cấp"
        description="Quản lý danh mục loại phụ cấp"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm loại phụ cấp
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên..."
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
            search: {
              ...search,
              page: next.pageIndex + 1,
              pageSize: next.pageSize,
            },
          });
        }}
        isLoading={isLoading}
        emptyMessage="Không có loại phụ cấp nào"
      />
    </div>
  );
}
