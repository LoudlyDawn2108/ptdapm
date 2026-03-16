import { ContractTypeFormDialog } from "@/features/config/contract-types/ContractTypeFormDialog";
import {
  contractTypeListOptions,
  useDeleteContractType,
} from "@/features/config/contract-types/api";
import type { ContractTypeRow } from "@/features/config/contract-types/columns";
import { contractTypeColumns } from "@/features/config/contract-types/columns";
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

export const Route = createFileRoute("/_authenticated/config/contract-types/")({
  beforeLoad: authorizeRoute("/config/contract-types"),
  validateSearch: searchSchema,
  component: ContractTypesPage,
});

function ContractTypesPage() {
  const navigate = useNavigate({ from: "/config/contract-types/" });
  const search = Route.useSearch();
  const listPage = useListPage({
    search,
    onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
  });
  const deleteMutation = useDeleteContractType();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ContractTypeRow | null>(null);

  return (
    <>
      <CatalogListPage
        title="Loại hợp đồng"
        description="Quản lý danh mục loại hợp đồng lao động"
        addButtonLabel="Thêm danh mục hợp đồng"
        columns={contractTypeColumns}
        queryOptions={contractTypeListOptions({
          page: search.page,
          pageSize: search.pageSize,
          search: listPage.debouncedSearch,
        })}
        deleteMutation={deleteMutation}
        deleteConfig={{
          title: "Xóa loại hợp đồng",
          nameAccessor: "contractTypeName",
          successMessage: "Đã xóa loại hợp đồng",
        }}
        searchPlaceholder="Tìm kiếm theo tên..."
        emptyMessage="Không có loại hợp đồng nào"
        onAddClick={() => setShowCreateDialog(true)}
        onEditClick={(item) => setEditingItem(item as ContractTypeRow)}
        {...listPage}
      />

      <ContractTypeFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <ContractTypeFormDialog
        open={!!editingItem}
        onOpenChange={(open) => { if (!open) setEditingItem(null); }}
        editingItem={editingItem}
      />
    </>
  );
}
