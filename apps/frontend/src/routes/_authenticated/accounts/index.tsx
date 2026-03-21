import { PageHeader } from "@/components/layout/page-header";
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
import { AccountEditDialog } from "@/features/accounts/AccountEditDialog";
import { AccountFormDialog } from "@/features/accounts/AccountFormDialog";
import { accountListOptions } from "@/features/accounts/api";
import { useListPage } from "@/hooks/use-list-page";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { AuthUserStatus, Role, enumToSortedList } from "@hrms/shared";
import type { AuthUserStatusCode, RoleCode } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<{
    id: string;
    username: string;
    email: string | null;
    roleCode: string;
    status: string;
  } | null>(null);
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
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "username",
      header: "Mã nhân sự",
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
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingAccount({
                id: row.original.id,
                username: row.original.username,
                email: row.original.email,
                roleCode: row.original.roleCode,
                status: row.original.status,
              });
              setEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
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
      <div className="flex items-start justify-between">
        <div className="mb-4 flex gap-3">
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            className="w-96"
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
            <SelectTrigger className="w-60 shrink-0">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent position="popper">
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
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {enumToSortedList(AuthUserStatus).map((s) => (
                <SelectItem key={s.code} value={s.code}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tài khoản
        </Button>
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
      <AccountEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        account={editingAccount}
      />
    </div>
  );
}
