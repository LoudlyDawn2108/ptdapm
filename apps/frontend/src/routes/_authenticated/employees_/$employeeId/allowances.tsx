import { api } from "@/api/client";
import { AllowanceForm } from "@/components/employees/AllowanceForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { CreateEmployeeAllowanceInput, UpdateEmployeeAllowanceInput } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/allowances")({
  component: EmployeeAllowancesTab,
});

interface AllowanceItem {
  id: string;
  allowanceTypeId: string;
  amount?: string | number | null;
  note?: string | null;
}

type AllowanceListResponse = {
  data?: {
    data?: {
      items: AllowanceItem[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

type AllowanceMutationResponse = {
  data?: {
    data?: AllowanceItem;
  };
};

type AllowancesApi = {
  get: (args: {
    params: { employeeId: string };
    query: { page: number; pageSize: number };
  }) => Promise<AllowanceListResponse>;
  post: (args: {
    params: { employeeId: string };
    body: CreateEmployeeAllowanceInput;
  }) => Promise<AllowanceMutationResponse>;
  put: (args: {
    params: { employeeId: string; id: string };
    body: UpdateEmployeeAllowanceInput;
  }) => Promise<AllowanceMutationResponse>;
  delete: (args: { params: { employeeId: string; id: string } }) => Promise<unknown>;
};

type EmployeesApi = {
  $employeeId: {
    allowances: AllowancesApi;
  };
};

const employeesApi = (api.api as unknown as { employees: EmployeesApi }).employees;

const displayValue = (value?: string | null) => (value && value.length > 0 ? value : "—");
const displayAmount = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return value.toLocaleString("vi-VN");
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric.toLocaleString("vi-VN");
};

function EmployeeAllowancesTab() {
  const { employeeId } = Route.useParams();
  const [items, setItems] = React.useState<AllowanceItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10, total: 0 });
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AllowanceItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<AllowanceItem | null>(null);

  const queryParams = React.useMemo(
    () => ({ page: pagination.page, pageSize: pagination.pageSize }),
    [pagination.page, pagination.pageSize],
  );

  const loadItems = React.useCallback(
    async (isActive?: () => boolean) => {
      setLoading(true);
      const response = await employeesApi.$employeeId.allowances.get({
        params: { employeeId },
        query: queryParams,
      });
      if (isActive && !isActive()) return;
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
    },
    [employeeId, queryParams],
  );

  React.useEffect(() => {
    let active = true;
    loadItems(() => active);
    return () => {
      active = false;
    };
  }, [loadItems]);

  const columns = React.useMemo<Column<AllowanceItem>[]>(
    () => [
      {
        key: "allowanceTypeId",
        header: "Loại phụ cấp",
        render: (item) => displayValue(item.allowanceTypeId),
      },
      {
        key: "amount",
        header: "Số tiền",
        render: (item) => displayAmount(item.amount),
      },
      {
        key: "note",
        header: "Ghi chú",
        render: (item) => displayValue(item.note ?? undefined),
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

  const handleSubmit = async (values: CreateEmployeeAllowanceInput) => {
    setFormLoading(true);
    if (editingItem) {
      await employeesApi.$employeeId.allowances.put({
        params: { employeeId, id: editingItem.id },
        body: values,
      });
    } else {
      await employeesApi.$employeeId.allowances.post({
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
    await employeesApi.$employeeId.allowances.delete({
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
          <h3 className="text-lg font-semibold text-foreground">Phụ cấp</h3>
          <p className="text-sm text-muted-foreground">Quản lý các khoản phụ cấp hiện có</p>
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

      <AllowanceForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={
          editingItem
            ? {
                allowanceTypeId: editingItem.allowanceTypeId,
                amount:
                  typeof editingItem.amount === "string"
                    ? Number(editingItem.amount)
                    : (editingItem.amount ?? undefined),
                note: editingItem.note ?? "",
              }
            : undefined
        }
        loading={formLoading}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa phụ cấp"
        description={
          deletingItem
            ? `Bạn có chắc chắn muốn xóa phụ cấp ${deletingItem.allowanceTypeId}?`
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
