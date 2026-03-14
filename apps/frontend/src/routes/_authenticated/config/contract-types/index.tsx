import { CatalogListPage } from "@/components/shared/catalog-list-page";
import {
  contractTypeListOptions,
  useDeleteContractType,
} from "@/features/config/contract-types/api";
import { contractTypeColumns } from "@/features/config/contract-types/columns";
import { contractTypeStrings as t } from "@/features/config/contract-types/strings";
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

export const Route = createFileRoute("/_authenticated/config/contract-types/")({
  beforeLoad: authorizeRoute("/config/contract-types"),
  validateSearch: searchSchema,
  component: ContractTypesPage,
});

function ContractTypesPage() {
  const navigate = useNavigate({ from: "/config/contract-types" });
  const search = Route.useSearch();
  const listPage = useListPage({
    search,
    onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
  });
  const deleteMutation = useDeleteContractType();

  return (
    <CatalogListPage
      title={t.page.title}
      description={t.page.description}
      addButtonLabel={t.page.addButton}
      columns={contractTypeColumns}
      queryOptions={contractTypeListOptions({
        page: search.page,
        pageSize: search.pageSize,
        search: listPage.debouncedSearch,
      })}
      deleteMutation={deleteMutation}
      deleteConfig={{
        title: t.delete.title,
        nameAccessor: "contractTypeName",
        successMessage: t.delete.success,
      }}
      searchPlaceholder={t.page.searchPlaceholder}
      emptyMessage={t.page.emptyMessage}
      {...listPage}
    />
  );
}
