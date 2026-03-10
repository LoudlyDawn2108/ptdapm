import { api } from "@/api/client";
import { BankAccountForm } from "@/components/employees/BankAccountForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { CreateEmployeeBankAccountInput, UpdateEmployeeBankAccountInput } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/bank-accounts")({
  component: EmployeeBankAccountsTab,
});

interface BankAccountItem {
  id: string;
  bankName: string;
  accountNo: string;
  isPrimary?: boolean | null;
}

type BankAccountListResponse = {
  data?: {
    data?: {
      items: BankAccountItem[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

type BankAccountMutationResponse = {
  data?: {
    data?: BankAccountItem;
  };
};

type BankAccountsApi = {
  get: (args: {
    query: { page: number; pageSize: number };
  }) => Promise<BankAccountListResponse>;
  post: (body: CreateEmployeeBankAccountInput) => Promise<BankAccountMutationResponse>;
} & ((params: { id: string }) => {
  put: (body: UpdateEmployeeBankAccountInput) => Promise<BankAccountMutationResponse>;
  delete: () => Promise<unknown>;
});

type EmployeesApi = (params: { employeeId: string }) => {
  "bank-accounts": BankAccountsApi;
};

const employeesApi = (api.api as unknown as { employees: EmployeesApi }).employees;

const displayValue = (value?: string | null) => (value && value.length > 0 ? value : "—");
const displayBoolean = (value?: boolean | null) => {
  if (value === null || value === undefined) return "—";
  return value ? "Có" : "Không";
};

function EmployeeBankAccountsTab() {
  const { employeeId } = Route.useParams();
  const [items, setItems] = React.useState<BankAccountItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10, total: 0 });
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<BankAccountItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<BankAccountItem | null>(null);

  const queryParams = React.useMemo(
    () => ({ page: pagination.page, pageSize: pagination.pageSize }),
    [pagination.page, pagination.pageSize],
  );

  const loadItems = React.useCallback(
    async (checkActive?: () => boolean) => {
      setLoading(true);
      const response = await employeesApi({ employeeId })["bank-accounts"].get({
        query: queryParams,
      });
      if (checkActive && !checkActive()) return;
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

  const columns = React.useMemo<Column<BankAccountItem>[]>(
    () => [
      {
        key: "bankName",
        header: "Ngân hàng",
        render: (item) => displayValue(item.bankName),
      },
      {
        key: "accountNo",
        header: "Số tài khoản",
        render: (item) => displayValue(item.accountNo),
      },
      {
        key: "isPrimary",
        header: "Tài khoản chính",
        render: (item) => displayBoolean(item.isPrimary),
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

  const handleSubmit = async (values: CreateEmployeeBankAccountInput) => {
    setFormLoading(true);
    if (editingItem) {
      await employeesApi({ employeeId })["bank-accounts"]({ id: editingItem.id }).put(values);
    } else {
      await employeesApi({ employeeId })["bank-accounts"].post(values);
    }
    setFormLoading(false);
    setFormOpen(false);
    setEditingItem(null);
    await loadItems();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    await employeesApi({ employeeId })["bank-accounts"]({ id: deletingItem.id }).delete();
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeletingItem(null);
    await loadItems();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tài khoản ngân hàng</h3>
          <p className="text-sm text-muted-foreground">Danh sách tài khoản nhận lương và phụ cấp</p>
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

      <BankAccountForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={
          editingItem
            ? {
                bankName: editingItem.bankName,
                accountNo: editingItem.accountNo,
                isPrimary: editingItem.isPrimary ?? false,
              }
            : undefined
        }
        loading={formLoading}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa tài khoản ngân hàng"
        description={
          deletingItem
            ? `Bạn có chắc chắn muốn xóa tài khoản ${deletingItem.accountNo}?`
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
