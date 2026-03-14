import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface CatalogApiResult<TData> {
  data?: {
    items: TData[];
    totalPages: number;
  };
}

interface DeleteConfig {
  title: string;
  nameAccessor: string;
  successMessage: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyQueryOptions = UseQueryOptions<any, any, any, any>;

interface CatalogListPageProps<TData> {
  title: string;
  description: string;
  addButtonLabel: string;
  columns: ColumnDef<TData, unknown>[];
  queryOptions: AnyQueryOptions;
  deleteMutation: UseMutationResult<unknown, Error, string>;
  deleteConfig: DeleteConfig;
  searchPlaceholder: string;
  emptyMessage: string;
  searchText: string;
  setSearchText: (value: string) => void;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  headerActions?: ReactNode;
}

export function CatalogListPage<TData extends { id: string }>({
  title,
  description,
  addButtonLabel,
  columns,
  queryOptions: qOpts,
  deleteMutation,
  deleteConfig,
  searchPlaceholder,
  emptyMessage,
  searchText,
  setSearchText,
  pagination,
  onPaginationChange,
  headerActions,
}: CatalogListPageProps<TData>) {
  const { data, isLoading, isError, error, refetch } = useQuery(qOpts);
  const result = (data as CatalogApiResult<TData> | undefined)?.data;

  if (isError) {
    return (
      <div>
        <PageHeader title={title} description={description} />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  const actionsColumn: ColumnDef<TData, unknown> = {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const item = row.original;
      const name = (item as Record<string, unknown>)[deleteConfig.nameAccessor] as string;
      return (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          }
          title={deleteConfig.title}
          description={`Bạn có chắc muốn xóa "${name}"?`}
          confirmLabel="Xóa"
          variant="destructive"
          onConfirm={() =>
            deleteMutation.mutate(item.id, {
              onSuccess: () => toast.success(deleteConfig.successMessage),
            })
          }
        />
      );
    },
  };

  const allColumns = [...columns, actionsColumn];

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          headerActions ?? (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonLabel}
            </Button>
          )
        }
      />

      <div className="mb-4">
        <Input
          placeholder={searchPlaceholder}
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        columns={allColumns}
        data={result?.items ?? []}
        pageCount={result?.totalPages ?? 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
