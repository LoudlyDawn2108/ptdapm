import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
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
import { Combobox } from "@/components/ui/combobox";
import { fetchOrgUnitDropdown } from "@/lib/api/config-dropdowns";
import { employeeListOptions } from "@/features/employees/api";
import {
  WorkStatus,
  ContractStatus,
  AcademicRank,
  enumToSortedList,
} from "@hrms/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { ChevronDown, Pencil, Search, Users } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/employees/")({
  validateSearch: searchSchema,
  component: EmployeesPage,
});

function EmployeesPage() {
  const navigate = useNavigate({ from: "/employees" });
  const search = Route.useSearch();
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchText);

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

  const academicRankMap = useMemo(() => {
    return new Map(
      enumToSortedList(AcademicRank).map((item) => [item.code, item.label]),
    );
  }, []);

  const workStatusMap = useMemo(() => {
    return new Map(
      enumToSortedList(WorkStatus).map((item) => [item.code, item.label]),
    );
  }, []);

  const contractStatusMap = useMemo(() => {
    return new Map(
      enumToSortedList(ContractStatus).map((item) => [item.code, item.label]),
    );
  }, []);

  const updateSearch = (patch: {
    workStatus?: string;
    contractStatus?: string;
    academicRank?: string;
    orgUnitId?: string;
  }) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...patch,
        page: 1,
      }),
    });
  };

  const statusTone = (code?: string) => {
    if (!code) return "muted" as const;
    if (["working", "valid", "active"].includes(code)) return "success" as const;
    if (["terminated", "expired", "locked"].includes(code)) return "danger" as const;
    if (["pending", "renewal_wait"].includes(code)) return "warning" as const;
    return "muted" as const;
  };

  const statusClasses: Record<
    "success" | "warning" | "danger" | "muted",
    { wrap: string; dot: string }
  > = {
    success: {
      wrap: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
    warning: {
      wrap: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    danger: {
      wrap: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
    muted: {
      wrap: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },
  };

  const StatusPill = ({ code, label }: { code?: string; label: string }) => {
    const tone = statusTone(code);
    const styles = statusClasses[tone];
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles.wrap}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {label}
      </span>
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "staffCode",
      header: "Mã NS",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-700">
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
          className="font-semibold text-slate-800 hover:underline"
        >
          {row.original.fullName}
        </Link>
      ),
    },
    {
      accessorKey: "currentOrgUnitName",
      header: "Đơn vị công tác",
      cell: ({ row }) => (
        <span
          className="block max-w-[180px] truncate text-slate-700"
          title={row.original.currentOrgUnitName}
        >
          {row.original.currentOrgUnitName ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "academicRank",
      header: "Học hàm/học vị",
      cell: ({ row }) =>
        academicRankMap.get(row.original.academicRank) ?? "—",
    },
    {
      accessorKey: "currentPositionTitle",
      header: "Chức vụ",
      cell: ({ row }) => row.original.currentPositionTitle ?? "—",
    },
    {
      accessorKey: "contractStatus",
      header: "Hợp đồng",
      cell: ({ row }) => {
        const label = contractStatusMap.get(row.original.contractStatus);
        return (
          <div className="flex justify-center">
            <StatusPill
              code={row.original.contractStatus}
              label={label ?? row.original.contractStatus ?? "—"}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "workStatus",
      header: "Trạng thái",
      cell: ({ row }) => {
        const label = workStatusMap.get(row.original.workStatus);
        return (
          <div className="flex justify-center">
            <StatusPill
              code={row.original.workStatus}
              label={label ?? row.original.workStatus ?? "—"}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="sm" asChild title="Chỉnh sửa">
            <Link
              to="/employees/$employeeId"
              params={{ employeeId: row.original.id }}
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const paginationLabel = `Hiển thị ${result?.items?.length ?? 0} / ${
    result?.total ?? 0
  } hồ sơ nhân sự`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Hồ sơ nhân sự</h1>
            <p className="text-sm text-slate-500">Danh sách cán bộ, giảng viên, nhân viên</p>
          </div>
        </div>
        <Button
          asChild
          className="h-10 rounded-lg bg-[#3B5CCC] px-4 text-white hover:bg-[#2F4FB8]"
        >
          <Link to="/employees/new">
            Thêm hồ sơ nhân sự
            <ChevronDown className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm kiếm"
            className="h-10 w-[220px] rounded-lg pl-9"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Combobox
          queryKey={["org-units", "dropdown", "filter"]}
          fetchOptions={fetchOrgUnitDropdown}
          value={search.orgUnitId ?? ""}
          onChange={(v) => updateSearch({ orgUnitId: v || undefined })}
          placeholder="Đơn vị công tác"
          className="h-10 min-w-[180px] rounded-lg"
        />

        <Select
          value={search.academicRank ?? "all"}
          onValueChange={(v) => updateSearch({ academicRank: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="h-10 min-w-[160px] rounded-lg">
            <SelectValue placeholder="Học hàm/học vị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {enumToSortedList(AcademicRank).map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={search.contractStatus ?? "all"}
          onValueChange={(v) => updateSearch({ contractStatus: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="h-10 min-w-[140px] rounded-lg">
            <SelectValue placeholder="Hợp đồng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {enumToSortedList(ContractStatus).map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={search.workStatus ?? "all"}
          onValueChange={(v) => updateSearch({ workStatus: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="h-10 min-w-[140px] rounded-lg">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {enumToSortedList(WorkStatus).map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="px-6 pb-6">
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
          paginationLabel={paginationLabel}
          tableWrapperClassName="rounded-xl border border-slate-200"
          headerRowClassName="bg-[#D7E0F0]"
          headerCellClassName="text-[11px] font-semibold uppercase tracking-wide text-slate-700"
          rowClassName="h-[56px]"
          cellClassName="text-sm text-slate-700"
          paginationClassName="px-0"
          paginationButtonClassName="rounded-lg"
        />
      </div>
    </div>
  );
}
