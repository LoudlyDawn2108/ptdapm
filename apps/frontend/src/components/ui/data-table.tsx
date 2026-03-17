import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SKELETON_ROW_COUNT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  tableWrapperClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  paginationClassName?: string;
  paginationInfoClassName?: string;
  paginationButtonClassName?: string;
  paginationLabel?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = -1,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading = false,
  emptyMessage = "Không có dữ liệu",
  onRowClick,
  tableWrapperClassName,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  rowClassName,
  cellClassName,
  paginationClassName,
  paginationInfoClassName,
  paginationButtonClassName,
  paginationLabel,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn("rounded-md border", tableWrapperClassName)}>
        <Table className={tableClassName}>
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={headerRowClassName}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={headerCellClassName}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(rowClassName, onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cellClassName}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <EmptyState description={emptyMessage} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && pageCount > 0 && (
        <div className={cn("flex items-center justify-between px-2", paginationClassName)}>
          <p className={cn("text-sm text-muted-foreground", paginationInfoClassName)}>
            {paginationLabel ?? `Trang ${pagination.pageIndex + 1} / ${pageCount}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={paginationButtonClassName}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <span className="text-sm text-slate-700 min-w-[80px] text-center">
              Trang {pagination.pageIndex + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={paginationButtonClassName}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
