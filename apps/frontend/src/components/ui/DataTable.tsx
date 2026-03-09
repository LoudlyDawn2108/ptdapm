import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type * as React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (item: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyText = "Không có dữ liệu",
  onRowClick,
  pagination,
  className,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;
  const startIndex = pagination
    ? Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total || 1)
    : 1;
  const endIndex = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.total)
    : data.length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn("px-4 py-3 font-semibold", column.headerClassName)}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải dữ liệu
                    </span>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className={cn(
                      "border-t border-border transition-colors",
                      onRowClick ? "cursor-pointer hover:bg-muted/40" : "hover:bg-muted/20",
                    )}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={cn("px-4 py-3", column.className)}>
                        {column.render
                          ? column.render(item)
                          : (item as Record<string, unknown>)[column.key]?.toString()}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>
            Hiển thị {startIndex}-{endIndex} / {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[84px] text-center">
              Trang {pagination.page} / {totalPages}
            </span>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => pagination.onPageChange(Math.min(totalPages, pagination.page + 1))}
              disabled={pagination.page >= totalPages}
              aria-label="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <select
              className="h-9 rounded-full border border-border bg-background px-3 text-sm text-foreground"
              value={pagination.pageSize}
              onChange={(event) => pagination.onPageSizeChange(Number(event.target.value))}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
}
