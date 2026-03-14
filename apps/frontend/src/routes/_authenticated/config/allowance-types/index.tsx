import { CatalogListPage } from "@/components/shared/catalog-list-page";
import {
  allowanceTypeListOptions,
  useDeleteAllowanceType,
} from "@/features/config/allowance-types/api";
import { allowanceTypeColumns } from "@/features/config/allowance-types/columns";
import { useListPage } from "@/hooks/use-list-page";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate({ from: "/config/allowance-types" });
  const search = Route.useSearch();
  const listPage = useListPage({
    search,
    onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
  });
  const deleteMutation = useDeleteAllowanceType();

  return (
    <CatalogListPage
      title="Loại phụ cấp"
      description="Quản lý danh mục loại phụ cấp"
      addButtonLabel="Thêm loại phụ cấp"
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
      emptyMessage="Không có loại phụ cấp nào"
      {...listPage}
    />
  );
}
