import { api } from "@/api/client";
import { FamilyMemberForm } from "@/components/employees/FamilyMemberForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import {
  type CreateEmployeeFamilyMemberInput,
  FamilyRelation,
  type UpdateEmployeeFamilyMemberInput,
} from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/family")({
  component: EmployeeFamilyTab,
});

interface FamilyMemberItem {
  id: string;
  relation: keyof typeof FamilyRelation;
  fullName: string;
  dob?: string | null;
  phone?: string | null;
  note?: string | null;
  isDependent?: boolean | null;
}

type FamilyMemberListResponse = {
  data?: {
    data?: {
      items: FamilyMemberItem[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

type FamilyMemberMutationResponse = {
  data?: {
    data?: FamilyMemberItem;
  };
};

type FamilyMembersApi = {
  get: (args: {
    query: { page: number; pageSize: number };
  }) => Promise<FamilyMemberListResponse>;
  post: (body: CreateEmployeeFamilyMemberInput) => Promise<FamilyMemberMutationResponse>;
} & ((params: { id: string }) => {
  put: (body: UpdateEmployeeFamilyMemberInput) => Promise<FamilyMemberMutationResponse>;
  delete: () => Promise<unknown>;
});

type EmployeesApi = (params: { employeeId: string }) => {
  "family-members": FamilyMembersApi;
};

const employeesApi = (api.api as unknown as { employees: EmployeesApi }).employees;

const toLabel = <T extends { label: string }>(record: Record<string, T>, value?: string | null) => {
  if (!value) return "—";
  return record[value]?.label ?? value;
};

const displayValue = (value?: string | null) => {
  return value && value.length > 0 ? value : "—";
};

const displayBoolean = (value?: boolean | null) => {
  if (value === null || value === undefined) return "—";
  return value ? "Có" : "Không";
};

function EmployeeFamilyTab() {
  const { employeeId } = Route.useParams();
  const [items, setItems] = React.useState<FamilyMemberItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10, total: 0 });
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<FamilyMemberItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<FamilyMemberItem | null>(null);

  const queryParams = React.useMemo(
    () => ({ page: pagination.page, pageSize: pagination.pageSize }),
    [pagination.page, pagination.pageSize],
  );

  const loadItems = React.useCallback(
    async (isActive?: () => boolean) => {
      setLoading(true);
      try {
        const response = await employeesApi({ employeeId })["family-members"].get({
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
      } catch {
        if (isActive && !isActive()) return;
      } finally {
        if (!isActive || isActive()) {
          setLoading(false);
        }
      }
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

  const columns = React.useMemo<Column<FamilyMemberItem>[]>(
    () => [
      {
        key: "relation",
        header: "Quan hệ",
        render: (item) => toLabel(FamilyRelation, item.relation),
      },
      {
        key: "fullName",
        header: "Họ và tên",
        render: (item) => displayValue(item.fullName),
      },
      {
        key: "dob",
        header: "Ngày sinh",
        render: (item) => displayValue(item.dob ?? undefined),
      },
      {
        key: "phone",
        header: "Số điện thoại",
        render: (item) => displayValue(item.phone ?? undefined),
      },
      {
        key: "isDependent",
        header: "Phụ thuộc",
        render: (item) => displayBoolean(item.isDependent),
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

  const handleSubmit = async (values: CreateEmployeeFamilyMemberInput) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await employeesApi({ employeeId })["family-members"]({ id: editingItem.id }).put(values);
      } else {
        await employeesApi({ employeeId })["family-members"].post(values);
      }
      setFormOpen(false);
      setEditingItem(null);
      await loadItems();
    } catch {
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await employeesApi({ employeeId })["family-members"]({ id: deletingItem.id }).delete();
      setConfirmOpen(false);
      setDeletingItem(null);
      await loadItems();
    } catch {
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Thành viên gia đình</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý thông tin thân nhân và người phụ thuộc
          </p>
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

      <FamilyMemberForm
        key={editingItem?.id ?? "create-family-member"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={
          editingItem
            ? {
                relation: editingItem.relation,
                fullName: editingItem.fullName,
                dob: editingItem.dob ?? "",
                phone: editingItem.phone ?? "",
                note: editingItem.note ?? "",
                isDependent: editingItem.isDependent ?? false,
              }
            : undefined
        }
        loading={formLoading}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa thành viên gia đình"
        description={
          deletingItem
            ? `Bạn có chắc chắn muốn xóa ${deletingItem.fullName}?`
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
