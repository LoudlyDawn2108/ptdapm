import { api } from "@/api/client";
import { PartyMembershipForm } from "@/components/employees/PartyMembershipForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import { type CreateEmployeePartyMembershipInput, PartyOrgType } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

const createRoute = createFileRoute as unknown as (
  path: string,
) => (config: { component: React.ComponentType }) => unknown;

export const Route = createRoute("/_authenticated/employees_/$employeeId/party")({
  component: EmployeePartyTab,
}) as unknown as {
  useParams: () => { employeeId: string };
};

interface PartyMembershipItem {
  id: string;
  organizationType: keyof typeof PartyOrgType;
  joinedOn?: string | null;
  details?: string | null;
}

type PartyMembershipListResponse = {
  data?: {
    data?: {
      items: PartyMembershipItem[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

type PartyMembershipMutationResponse = {
  data?: {
    data?: PartyMembershipItem;
  };
};

type PartyMembershipsApi = {
  get: (args: {
    params: { employeeId: string };
    query: { page: number; pageSize: number };
  }) => Promise<PartyMembershipListResponse>;
  post: (args: {
    params: { employeeId: string };
    body: CreateEmployeePartyMembershipInput;
  }) => Promise<PartyMembershipMutationResponse>;
  put: (args: {
    params: { employeeId: string; id: string };
    body: CreateEmployeePartyMembershipInput;
  }) => Promise<PartyMembershipMutationResponse>;
  delete: (args: { params: { employeeId: string; id: string } }) => Promise<unknown>;
};

type EmployeesApi = {
  $employeeId: {
    "party-memberships": PartyMembershipsApi;
  };
};

const employeesApi = (api as unknown as { employees: EmployeesApi }).employees;

const toLabel = <T extends { label: string }>(record: Record<string, T>, value?: string | null) => {
  if (!value) return "—";
  return record[value]?.label ?? value;
};

const displayValue = (value?: string | null) => (value && value.length > 0 ? value : "—");

function EmployeePartyTab() {
  const { employeeId } = Route.useParams();
  const [items, setItems] = React.useState<PartyMembershipItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10, total: 0 });
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PartyMembershipItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<PartyMembershipItem | null>(null);

  const queryParams = React.useMemo(
    () => ({ page: pagination.page, pageSize: pagination.pageSize }),
    [pagination.page, pagination.pageSize],
  );

  const loadItems = React.useCallback(async () => {
    setLoading(true);
    const response = await employeesApi.$employeeId["party-memberships"].get({
      params: { employeeId },
      query: queryParams,
    });
    const payload = response.data?.data;
    if (payload) {
      setItems(payload.items ?? []);
      setPagination((prev) => ({
        ...prev,
        page: payload.page ?? prev.page,
        pageSize: payload.pageSize ?? prev.pageSize,
        total: payload.total ?? 0,
      }));
    } else {
      setItems([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    }
    setLoading(false);
  }, [employeeId, queryParams]);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      await loadItems();
    };
    load();
    return () => {
      active = false;
      if (!active) return;
    };
  }, [loadItems]);

  const columns = React.useMemo<Column<PartyMembershipItem>[]>(
    () => [
      {
        key: "organizationType",
        header: "Tổ chức",
        render: (item) => toLabel(PartyOrgType, item.organizationType),
      },
      {
        key: "joinedOn",
        header: "Ngày gia nhập",
        render: (item) => displayValue(item.joinedOn ?? undefined),
      },
      {
        key: "details",
        header: "Ghi chú",
        render: (item) => displayValue(item.details ?? undefined),
      },
      {
        key: "actions",
        header: "Thao tác",
        headerClassName: "text-right",
        className: "text-right",
        render: (item) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="h-8 rounded-full border border-border px-3 text-xs font-medium text-foreground transition hover:bg-muted"
              onClick={(event) => {
                event.stopPropagation();
                setEditingItem(item);
                setFormOpen(true);
              }}
            >
              Sửa
            </button>
            <button
              type="button"
              className="h-8 rounded-full border border-destructive/40 px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10"
              onClick={(event) => {
                event.stopPropagation();
                setDeletingItem(item);
                setConfirmOpen(true);
              }}
            >
              Xóa
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const handleSubmit = async (values: CreateEmployeePartyMembershipInput) => {
    setFormLoading(true);
    if (editingItem) {
      await employeesApi.$employeeId["party-memberships"].put({
        params: { employeeId, id: editingItem.id },
        body: values,
      });
    } else {
      await employeesApi.$employeeId["party-memberships"].post({
        params: { employeeId },
        body: values,
      });
    }
    setFormLoading(false);
    setFormOpen(false);
    setEditingItem(null);
    await loadItems();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    await employeesApi.$employeeId["party-memberships"].delete({
      params: { employeeId, id: deletingItem.id },
    });
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeletingItem(null);
    await loadItems();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Thông tin Đảng/Đoàn</h3>
          <p className="text-sm text-muted-foreground">Theo dõi quá trình tham gia tổ chức</p>
        </div>
        <button
          type="button"
          className="h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
        >
          Thêm mới
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onPageSizeChange: (pageSize) => setPagination((prev) => ({ ...prev, pageSize, page: 1 })),
        }}
        className={cn("min-h-[320px]")}
      />

      <PartyMembershipForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={
          editingItem
            ? {
                organizationType: editingItem.organizationType,
                joinedOn: editingItem.joinedOn ?? "",
                details: editingItem.details ?? "",
              }
            : undefined
        }
        loading={formLoading}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa thông tin Đảng/Đoàn"
        description={
          deletingItem
            ? `Bạn có chắc chắn muốn xóa ${toLabel(PartyOrgType, deletingItem.organizationType)}?`
            : "Bạn có chắc chắn muốn xóa bản ghi này?"
        }
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        loading={deleteLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
