import { AllowanceTypeFormDialog } from "@/features/config/allowance-types/AllowanceTypeFormDialog";
import {
  allowanceTypeListOptions,
  useDeleteAllowanceType,
} from "@/features/config/allowance-types/api";
import type { AllowanceTypeRow } from "@/features/config/allowance-types/columns";
import { allowanceTypeColumns } from "@/features/config/allowance-types/columns";
import { CatalogListPage } from "@/components/shared/catalog-list-page";
import { useListPage } from "@/hooks/use-list-page";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/config/allowance-types/")({
  beforeLoad: authorizeRoute("/config/allowance-types"),
  validateSearch: searchSchema,
  component: AllowanceTypesPage,
});

function AllowanceTypesPage() {
  const navigate = useNavigate({ from: "/config/allowance-types/" });
  const search = Route.useSearch();
  const listPage = useListPage({
    search,
    onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
  });
  const deleteMutation = useDeleteAllowanceType();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<AllowanceTypeRow | null>(null);

  return (
    <>
      <CatalogListPage
        title="Phụ cấp"
        description="Quản lý danh mục phụ cấp"
        addButtonLabel="Thêm danh mục phụ cấp"
        columns={allowanceTypeColumns}
        queryOptions={allowanceTypeListOptions({
          page: search.page,
          pageSize: search.pageSize,
          search: listPage.debouncedSearch,
        })}
        deleteMutation={deleteMutation}
        deleteConfig={{
          title: "Xóa loại phụ cấp",
          nameAccessor: "allowanceName",
          successMessage: "Đã xóa loại phụ cấp",
        }}
        searchPlaceholder="Tìm kiếm theo tên..."
        emptyMessage="Không có danh mục phụ cấp nào"
        onAddClick={() => setShowCreateDialog(true)}
        onEditClick={(item) => setEditingItem(item as AllowanceTypeRow)}
        {...listPage}
      />

      <AllowanceTypeFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <AllowanceTypeFormDialog
        open={!!editingItem}
        onOpenChange={(open) => { if (!open) setEditingItem(null); }}
        editingItem={editingItem}
      />
    </>
  );
}
