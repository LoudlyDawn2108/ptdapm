import { api } from "@/api/client";
import { PreviousJobForm } from "@/components/employees/PreviousJobForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { CreateEmployeePreviousJobInput } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/work-history")({
  component: EmployeeWorkHistoryTab,
});

interface WorkHistoryItem {
  id: string;
  workplace: string;
  startedOn?: string | null;
  endedOn?: string | null;
  note?: string | null;
}

type WorkHistoryListResponse = {
  data?: {
    data?: {
      items: WorkHistoryItem[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

type WorkHistoryMutationResponse = {
  data?: {
    data?: WorkHistoryItem;
  };
};

type PreviousJobsApi = {
  get: (args: {
    params: { employeeId: string };
    query: { page: number; pageSize: number };
  }) => Promise<WorkHistoryListResponse>;
  post: (args: {
    params: { employeeId: string };
    body: CreateEmployeePreviousJobInput;
  }) => Promise<WorkHistoryMutationResponse>;
  put: (args: {
    params: { employeeId: string; id: string };
    body: CreateEmployeePreviousJobInput;
  }) => Promise<WorkHistoryMutationResponse>;
  delete: (args: { params: { employeeId: string; id: string } }) => Promise<unknown>;
};

type EmployeesApi = {
  $employeeId: {
    "previous-jobs": PreviousJobsApi;
  };
};

const employeesApi = (api as unknown as { employees: EmployeesApi }).employees;

const displayValue = (value?: string | null) => (value && value.length > 0 ? value : "—");

function EmployeeWorkHistoryTab() {
  const { employeeId } = Route.useParams();
  const [items, setItems] = React.useState<WorkHistoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10, total: 0 });
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<WorkHistoryItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<WorkHistoryItem | null>(null);

  const queryParams = React.useMemo(
    () => ({ page: pagination.page, pageSize: pagination.pageSize }),
    [pagination.page, pagination.pageSize],
  );

  const loadItems = React.useCallback(
    async (getActive?: () => boolean) => {
      setLoading(true);
      const response = await employeesApi.$employeeId["previous-jobs"].get({
        params: { employeeId },
        query: queryParams,
      });
      if (getActive?.() === false) return;
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
      if (getActive?.() === false) return;
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

  const columns = React.useMemo<Column<WorkHistoryItem>[]>(
    () => [
      {
        key: "workplace",
        header: "Nơi làm việc",
        render: (item) => displayValue(item.workplace),
      },
      {
        key: "startedOn",
        header: "Bắt đầu",
        render: (item) => displayValue(item.startedOn ?? undefined),
      },
      {
        key: "endedOn",
        header: "Kết thúc",
        render: (item) => displayValue(item.endedOn ?? undefined),
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

  const handleSubmit = async (values: CreateEmployeePreviousJobInput) => {
    setFormLoading(true);
    if (editingItem) {
      await employeesApi.$employeeId["previous-jobs"].put({
        params: { employeeId, id: editingItem.id },
        body: values,
      });
    } else {
      await employeesApi.$employeeId["previous-jobs"].post({
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
    await employeesApi.$employeeId["previous-jobs"].delete({
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
          <h3 className="text-lg font-semibold text-foreground">Quá trình công tác</h3>
          <p className="text-sm text-muted-foreground">Theo dõi nơi làm việc trước đây</p>
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

      <PreviousJobForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={
          editingItem
            ? {
                workplace: editingItem.workplace,
                startedOn: editingItem.startedOn ?? "",
                endedOn: editingItem.endedOn ?? "",
                note: editingItem.note ?? "",
              }
            : undefined
        }
        loading={formLoading}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa quá trình công tác"
        description={
          deletingItem
            ? `Bạn có chắc chắn muốn xóa ${deletingItem.workplace}?`
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
