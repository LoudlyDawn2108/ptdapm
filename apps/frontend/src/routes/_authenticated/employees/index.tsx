import { api } from "@/api/client";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { ContractStatus, Gender, WorkStatus, enumToSortedList } from "@hrms/shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/employees/")({ component: EmployeeListPage });

interface EmployeeListItem {
  id: string;
  staffCode?: string | null;
  fullName?: string | null;
  gender?: keyof typeof Gender | null;
  email?: string | null;
  phone?: string | null;
  workStatus?: keyof typeof WorkStatus | null;
}

type EmployeeListResponse = {
  data?: {
    data?: {
      items: EmployeeListItem[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

type EmployeesApi = {
  get: (args: {
    query: Record<string, string | number | undefined>;
  }) => Promise<EmployeeListResponse>;
};

const employeesApi = (api as unknown as { employees: EmployeesApi }).employees;

const workStatusOptions = enumToSortedList(WorkStatus);
const contractStatusOptions = enumToSortedList(ContractStatus);

const toLabel = <T extends { label: string }>(record: Record<string, T>, value?: string | null) => {
  if (!value) return "—";
  return record[value]?.label ?? value;
};

const displayValue = (value?: string | null) => {
  return value && value.length > 0 ? value : "—";
};

function EmployeeListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<{
    orgUnitId?: string;
    workStatus?: string;
    contractStatus?: string;
  }>({});
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10, total: 0 });
  const [employees, setEmployees] = React.useState<EmployeeListItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const queryParams = React.useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      page: pagination.page,
      pageSize: pagination.pageSize,
    };

    if (search.trim()) params.search = search.trim();
    if (filters.orgUnitId?.trim()) params.orgUnitId = filters.orgUnitId.trim();
    if (filters.workStatus) params.workStatus = filters.workStatus;
    if (filters.contractStatus) params.contractStatus = filters.contractStatus;

    return params;
  }, [filters, pagination.page, pagination.pageSize, search]);

  React.useEffect(() => {
    let active = true;

    const loadEmployees = async () => {
      setLoading(true);
      const response = await employeesApi.get({ query: queryParams });
      if (!active) return;

      const payload = response.data?.data;
      if (payload) {
        setEmployees(payload.items ?? []);
        setPagination((prev) => ({
          ...prev,
          page: payload.page ?? prev.page,
          pageSize: payload.pageSize ?? prev.pageSize,
          total: payload.total ?? 0,
        }));
      } else {
        setEmployees([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }

      setLoading(false);
    };

    loadEmployees();

    return () => {
      active = false;
    };
  }, [queryParams]);

  const columns = React.useMemo<Column<EmployeeListItem>[]>(
    () => [
      { key: "staffCode", header: "Mã cán bộ", render: (item) => displayValue(item.staffCode) },
      { key: "fullName", header: "Họ và tên", render: (item) => displayValue(item.fullName) },
      { key: "gender", header: "Giới tính", render: (item) => toLabel(Gender, item.gender) },
      { key: "email", header: "Email", render: (item) => displayValue(item.email) },
      { key: "phone", header: "SĐT", render: (item) => displayValue(item.phone) },
      {
        key: "workStatus",
        header: "Trạng thái",
        render: (item) => toLabel(WorkStatus, item.workStatus),
      },
      {
        key: "actions",
        header: "Thao tác",
        headerClassName: "text-right",
        className: "text-right",
        render: (item) => (
          <button
            type="button"
            className="rounded-full border border-border px-4 py-1 text-xs font-medium text-foreground transition hover:bg-muted"
            onClick={(event) => {
              event.stopPropagation();
              navigate({ to: "/_authenticated/employees_/$employeeId", params: { employeeId: item.id } });
            }}
          >
            Xem
          </button>
        ),
      },
    ],
    [navigate],
  );

  const handleExport = React.useCallback(() => {
    const params = new URLSearchParams();
    params.set("format", "csv");
    if (search.trim()) params.set("search", search.trim());
    if (filters.orgUnitId?.trim()) params.set("orgUnitId", filters.orgUnitId.trim());
    if (filters.workStatus) params.set("workStatus", filters.workStatus);
    if (filters.contractStatus) params.set("contractStatus", filters.contractStatus);

    const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    window.location.href = `${baseUrl}/api/employees/export?${params.toString()}`;
  }, [filters.contractStatus, filters.orgUnitId, filters.workStatus, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhân sự"
        description="Quản lý danh sách nhân sự trong hệ thống"
        actions={
          <>
            <button
              type="button"
              className="h-10 rounded-full border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              onClick={handleExport}
            >
              Export
            </button>
            <button
              type="button"
              className="h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              onClick={() => navigate({ to: "/employees/new" })}
            >
              Thêm mới
            </button>
          </>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_repeat(3,_minmax(0,_1fr))]">
          <label className="space-y-2 text-sm text-muted-foreground">
            Tìm kiếm
            <input
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
              placeholder="Tìm theo mã cán bộ, họ tên, email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </label>

          <label className="space-y-2 text-sm text-muted-foreground">
            Đơn vị công tác
            <input
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
              placeholder="Nhập mã đơn vị"
              value={filters.orgUnitId ?? ""}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, orgUnitId: event.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </label>

          <label className="space-y-2 text-sm text-muted-foreground">
            Trạng thái làm việc
            <select
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
              value={filters.workStatus ?? ""}
              onChange={(event) => {
                const value = event.target.value || undefined;
                setFilters((prev) => ({ ...prev, workStatus: value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <option value="">Tất cả</option>
              {workStatusOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-muted-foreground">
            Trạng thái hợp đồng
            <select
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
              value={filters.contractStatus ?? ""}
              onChange={(event) => {
                const value = event.target.value || undefined;
                setFilters((prev) => ({ ...prev, contractStatus: value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <option value="">Tất cả</option>
              {contractStatusOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        onRowClick={(item) => navigate({ to: "/employees/$id", params: { id: item.id } })}
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onPageSizeChange: (pageSize) => setPagination((prev) => ({ ...prev, pageSize, page: 1 })),
        }}
        className={cn("min-h-[340px]")}
      />
    </div>
  );
}
