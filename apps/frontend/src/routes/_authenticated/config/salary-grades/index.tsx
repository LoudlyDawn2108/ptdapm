import { CatalogListPage } from "@/components/shared/catalog-list-page";
import { salaryGradeListOptions, useDeleteSalaryGrade } from "@/features/config/salary-grades/api";
import { salaryGradeColumns } from "@/features/config/salary-grades/columns";
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

export const Route = createFileRoute("/_authenticated/config/salary-grades/")({
  beforeLoad: authorizeRoute("/config/salary-grades"),
  validateSearch: searchSchema,
  component: SalaryGradesPage,
});

function SalaryGradesPage() {
  const navigate = useNavigate({ from: "/config/salary-grades" });
  const search = Route.useSearch();
  const listPage = useListPage({
    search,
    onNavigate: (update) => navigate({ search: (prev) => ({ ...prev, ...update }) }),
  });
  const deleteMutation = useDeleteSalaryGrade();

  return (
    <CatalogListPage
      title="Ngạch lương"
      description="Quản lý hệ thống ngạch lương và bậc lương"
      addButtonLabel="Thêm ngạch"
      columns={salaryGradeColumns}
      queryOptions={salaryGradeListOptions({
        page: search.page,
        pageSize: search.pageSize,
        search: listPage.debouncedSearch,
      })}
      deleteMutation={deleteMutation}
      deleteConfig={{
        title: "Xóa ngạch lương",
        nameAccessor: "gradeName",
        successMessage: "Đã xóa ngạch lương",
      }}
      searchPlaceholder="Tìm kiếm theo mã ngạch, tên..."
      emptyMessage="Không có ngạch lương nào"
      {...listPage}
    />
  );
}
