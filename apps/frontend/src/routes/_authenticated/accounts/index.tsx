import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
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
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  accountListOptions,
  useSetAccountStatus,
} from "@/features/accounts/api";
import { Role, AuthUserStatus, enumToSortedList } from "@hrms/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Lock, Unlock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/accounts/")({
  validateSearch: searchSchema,
  component: AccountsPage,
});

function AccountsPage() {
  const navigate = useNavigate({ from: "/accounts" });
  const search = Route.useSearch();
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedSearch = useDebounce(searchText);

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch || undefined,
    role: search.role,
    status: search.status,
  };

  const { data, isLoading } = useQuery(accountListOptions(params));
  const setStatusMutation = useSetAccountStatus();
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "username",
      header: "Tên đăng nhập",
    },
    {
      accessorKey: "fullName",
      header: "Họ tên",
      cell: ({ row }) => row.original.fullName ?? "—",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email ?? "—",
    },
    {
      accessorKey: "roleCode",
      header: "Vai trò",
      cell: ({ row }) => {
        const role = Role[row.original.roleCode as keyof typeof Role];
        return role?.label ?? row.original.roleCode;
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status =
          AuthUserStatus[row.original.status as keyof typeof AuthUserStatus];
        return (
          <StatusBadgeFromCode
            code={row.original.status}
            label={status?.label ?? row.original.status}
          />
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const isLocked = row.original.status === "locked";
        return (
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm">
                {isLocked ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>
            }
            title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            description={`Bạn có chắc muốn ${isLocked ? "mở khóa" : "khóa"} tài khoản "${row.original.username}"?`}
            confirmLabel={isLocked ? "Mở khóa" : "Khóa"}
            variant={isLocked ? "default" : "destructive"}
            onConfirm={() =>
              setStatusMutation.mutate(
                {
                  id: row.original.id,
                  status: isLocked ? "active" : "locked",
                },
                {
                  onSuccess: () =>
                    toast.success(
                      isLocked
                        ? "Đã mở khóa tài khoản"
                        : "Đã khóa tài khoản",
                    ),
                },
              )
            }
          />
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý tài khoản"
        description="Danh sách tài khoản người dùng hệ thống"
        actions={
          <Button asChild>
            <Link to="/accounts" search={{ page: 1 }}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo tài khoản
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex gap-3">
        <Input
          placeholder="Tìm kiếm theo tên, email..."
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          value={search.role ?? "all"}
          onValueChange={(v) =>
            navigate({
              search: (prev) => ({
                ...prev,
                role: v === "all" ? undefined : v,
                page: 1,
              }),
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {enumToSortedList(Role).map((r) => (
              <SelectItem key={r.code} value={r.code}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={search.status ?? "all"}
          onValueChange={(v) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: v === "all" ? undefined : v,
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
            {enumToSortedList(AuthUserStatus).map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        emptyMessage="Không có tài khoản nào"
      />
    </div>
  );
}
