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
  contractTypeListOptions,
  useDeleteContractType,
} from "@/features/config/api";
import { CatalogStatus } from "@hrms/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/config/contract-types/",
)({
  validateSearch: searchSchema,
  component: ContractTypesPage,
});

function ContractTypesPage() {
  const navigate = useNavigate({ from: "/config/contract-types" });
  const search = Route.useSearch();
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchText);
  const deleteMutation = useDeleteContractType();

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useQuery(contractTypeListOptions(params));
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
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
          title="Xóa loại hợp đồng"
          description={`Bạn có chắc muốn xóa "${row.original.contractTypeName}"?`}
          confirmLabel="Xóa"
          variant="destructive"
          onConfirm={() =>
            deleteMutation.mutate(row.original.id, {
              onSuccess: () => toast.success("Đã xóa loại hợp đồng"),
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Loại hợp đồng"
        description="Quản lý danh mục loại hợp đồng lao động"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm loại HĐ
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
            search: (prev) => ({
              ...prev,
              page: next.pageIndex + 1,
              pageSize: next.pageSize,
            }),
          });
        }}
        isLoading={isLoading}
        emptyMessage="Không có loại hợp đồng nào"
      />
    </div>
  );
}
