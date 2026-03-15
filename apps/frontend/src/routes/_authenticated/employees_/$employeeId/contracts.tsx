import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { employeeDetailOptions } from "@/features/employees/api";
import { formatDate } from "@/lib/date-utils";
import { ContractDocStatus } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/contracts")({
  component: ContractsTab,
});

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active" || status === "valid";

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Đang hoạt động
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Ngừng sử dụng
    </span>
  );
}

function ContractsTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const aggregate = data?.data as any;
  const contracts = aggregate?.contracts as any[] | undefined;

  if (isLoading) return <FormSkeleton fields={3} />;

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Top-right button */}
      <div className="mb-4 flex justify-end">
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Thêm hợp đồng
        </Button>
      </div>

      {/* Table */}
      {contracts && contracts.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại hợp đồng</th>
                <th className="px-4 py-3 text-left font-medium">Ngày ký</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hiệu lực</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hết hạn</th>
                <th className="px-4 py-3 text-left font-medium">Đơn vị công tác</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c: any, i: number) => (
                <tr key={c.id ?? i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{c.contractTypeName ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(c.startDate)}</td>
                  <td className="px-4 py-3">{formatDate(c.startDate)}</td>
                  <td className="px-4 py-3">{formatDate(c.endDate)}</td>
                  <td className="px-4 py-3">{c.departmentName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">Chưa có hợp đồng nào.</p>
      )}
    </div>
  );
}
