import { CatalogListPage } from "@/components/shared/catalog-list-page";
import {
  allowanceTypeListOptions,
  useDeleteAllowanceType,
} from "@/features/config/allowance-types/api";
import { allowanceTypeColumns } from "@/features/config/allowance-types/columns";
import { allowanceTypeStrings as t } from "@/features/config/allowance-types/strings";
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
      title={t.page.title}
      description={t.page.description}
      addButtonLabel={t.page.addButton}
      columns={allowanceTypeColumns}
      queryOptions={allowanceTypeListOptions({
        page: search.page,
        pageSize: search.pageSize,
        search: listPage.debouncedSearch,
      })}
      deleteMutation={deleteMutation}
      deleteConfig={{
        title: t.delete.title,
        nameAccessor: "allowanceName",
        successMessage: t.delete.success,
      }}
      searchPlaceholder={t.page.searchPlaceholder}
      emptyMessage={t.page.emptyMessage}
      {...listPage}
    />
  );
}
