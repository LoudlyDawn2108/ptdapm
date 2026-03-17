import { PageHeader } from "@/components/layout/page-header";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employeeListOptions, useDeleteEmployee } from "@/features/employees/api";
import { getEmployeeColumns } from "@/features/employees/columns";
import { useListPage } from "@/hooks/use-list-page";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { Gender, WorkStatus, enumToSortedList } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  workStatus: z.string().optional(),
  gender: z.string().optional(),
  orgUnitId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/employees/")({
  beforeLoad: authorizeRoute("/employees"),
  validateSearch: searchSchema,
  component: EmployeesPage,
});

function EmployeesPage() {
  const navigate = useNavigate({ from: "/employees" });
  const search = Route.useSearch();
  const { searchText, setSearchText, debouncedSearch, pagination, onPaginationChange } =
    useListPage({
      search,
      onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
    });
  const deleteMutation = useDeleteEmployee();

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch,
    workStatus: search.workStatus,
    gender: search.gender,
    orgUnitId: search.orgUnitId,
  };

  const { data, isLoading, isError, error, refetch } = useQuery(employeeListOptions(params));
  const result = data?.data;
  const columns = getEmployeeColumns(deleteMutation);

  if (isError) {
    return (
      <div>
        <PageHeader title="Quản lý nhân sự" description="Danh sách cán bộ, giảng viên, nhân viên" />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

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
        data={(result?.items ?? []) as any}
        pageCount={result?.total ? Math.ceil(result.total / (search.pageSize ?? 10)) : 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        emptyMessage="Không có nhân sự nào"
      />
    </div>
  );
}
