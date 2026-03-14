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
import { accountListOptions, useSetAccountStatus } from "@/features/accounts/api";
import { accountStrings as t } from "@/features/accounts/strings";
import { useListPage } from "@/hooks/use-list-page";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { commonStrings } from "@/lib/strings";
import { AuthUserStatus, Role, enumToSortedList } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Lock, Plus, Unlock } from "lucide-react";
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
  const navigate = useNavigate({ from: "/accounts" });
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
    role: search.role,
    status: search.status,
  };

  const { data, isLoading, isError, error, refetch } = useQuery(accountListOptions(params));
  const setStatusMutation = useSetAccountStatus();
  const result = data?.data;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "username",
      header: t.columns.username,
    },
    {
      accessorKey: "fullName",
      header: t.columns.fullName,
      cell: ({ row }) => row.original.fullName ?? "—",
    },
    {
      accessorKey: "email",
      header: t.columns.email,
      cell: ({ row }) => row.original.email ?? "—",
    },
    {
      accessorKey: "roleCode",
      header: t.columns.role,
      cell: ({ row }) => {
        const role = Role[row.original.roleCode as keyof typeof Role];
        return role?.label ?? row.original.roleCode;
      },
    },
    {
      accessorKey: "status",
      header: t.columns.status,
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
            title={isLocked ? t.actions.unlockTitle : t.actions.lockTitle}
            description={
              isLocked
                ? t.actions.unlockDescription(row.original.username)
                : t.actions.lockDescription(row.original.username)
            }
            confirmLabel={isLocked ? t.actions.unlockConfirm : t.actions.lockConfirm}
            variant={isLocked ? "default" : "destructive"}
            onConfirm={() =>
              setStatusMutation.mutate(
                {
                  id: row.original.id,
                  status: isLocked ? "active" : "locked",
                },
                {
                  onSuccess: () =>
                    toast.success(isLocked ? t.actions.unlockSuccess : t.actions.lockSuccess),
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
        <PageHeader title={t.page.title} description={t.page.description} />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t.page.title}
        description={t.page.description}
        actions={
          <Button asChild>
            <Link to="/accounts" search={{ page: 1 }}>
              <Plus className="mr-2 h-4 w-4" />
              {t.page.addButton}
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex gap-3">
        <Input
          placeholder={t.page.searchPlaceholder}
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
            <SelectValue placeholder={commonStrings.filters.role} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{commonStrings.filters.allRoles}</SelectItem>
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
            <SelectValue placeholder={commonStrings.filters.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{commonStrings.filters.allStatuses}</SelectItem>
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
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        emptyMessage={t.page.emptyMessage}
      />
    </div>
  );
}
