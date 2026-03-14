import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ContractDocStatus } from "@hrms/shared";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/contracts",
)({
  component: ContractsTab,
});

function ContractsTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!emp) return null;

  const contracts = (emp as any).contracts as any[] | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Danh sách hợp đồng</CardTitle>
      </CardHeader>
      <CardContent>
        {contracts && contracts.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Số hợp đồng</th>
                  <th className="py-2 pr-4">Loại HĐ</th>
                  <th className="py-2 pr-4">Ngày bắt đầu</th>
                  <th className="py-2 pr-4">Ngày kết thúc</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c: any, i: number) => {
                  const statusLabel =
                    ContractDocStatus[
                      c.status as keyof typeof ContractDocStatus
                    ]?.label ?? c.status;
                  return (
                    <tr key={c.id ?? i} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium font-mono text-xs">
                        {c.contractNumber ?? "—"}
                      </td>
                      <td className="py-2 pr-4">
                        {c.contractTypeName ?? "—"}
                      </td>
                      <td className="py-2 pr-4">{formatDate(c.startDate)}</td>
                      <td className="py-2 pr-4">{formatDate(c.endDate)}</td>
                      <td className="py-2 pr-4">
                        <StatusBadgeFromCode
                          code={c.status}
                          label={statusLabel}
                        />
                      </td>
                      <td className="py-2">{c.note ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            Chưa có hợp đồng nào.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
