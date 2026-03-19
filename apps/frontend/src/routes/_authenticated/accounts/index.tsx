import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueryError } from "@/components/shared/query-error";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
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
import { AccountFormDialog } from "@/features/accounts/AccountFormDialog";
import { accountListOptions, useSetAccountStatus } from "@/features/accounts/api";
import { useListPage } from "@/hooks/use-list-page";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { AuthUserStatus, Role, enumToSortedList } from "@hrms/shared";
import type { AuthUserStatusCode, RoleCode } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Lock, Plus, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/accounts/")({
  beforeLoad: authorizeRoute("/accounts"),
  validateSearch: searchSchema,
  component: AccountsPage,
});

function AccountsPage() {
  const navigate = useNavigate({ from: "/accounts/" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const search = Route.useSearch();
  const { searchText, setSearchText, debouncedSearch, pagination, onPaginationChange } =
    useListPage({
      search,
      onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
    });

  const params = {
    page: search.page,
    pageSize: search.pageSize,
    search: debouncedSearch,
    role: search.role as RoleCode | undefined,
    status: search.status as AuthUserStatusCode | undefined,
  };

  const { data, isLoading, isError, error, refetch } = useQuery(accountListOptions(params));
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
        const status = AuthUserStatus[row.original.status as keyof typeof AuthUserStatus];
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
                {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Button>
            }
            title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            description={
              isLocked
                ? `Bạn có chắc muốn mở khóa tài khoản "${row.original.username}"?`
                : `Bạn có chắc muốn khóa tài khoản "${row.original.username}"?`
            }
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
                    toast.success(isLocked ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản"),
                },
              )
            }
          />
        );
      },
    },
  ];

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Quản lý tài khoản"
          description="Danh sách tài khoản người dùng hệ thống"
        />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Quản lý tài khoản"
        description="Danh sách tài khoản người dùng hệ thống"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo tài khoản
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
              search: {
                ...search,
                role: v === "all" ? undefined : v,
                page: 1,
              },
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
              search: {
                ...search,
                status: v === "all" ? undefined : v,
                page: 1,
              },
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
        pageCount={result?.total ? Math.ceil(result.total / (search.pageSize ?? 10)) : 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        emptyMessage="Không có tài khoản nào"
      />

      <AccountFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
