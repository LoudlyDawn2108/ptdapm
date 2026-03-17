import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useEmployeeDetail } from "@/features/employees/api";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { formatDate } from "@/lib/date-utils";
import { OrgUnitStatus } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/assignments")({
  component: AssignmentsTab,
});

type OrgNode = { id: string; unitName: string; status: string; children?: OrgNode[] };

function AssignmentsTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, employee: emp, isLoading } = useEmployeeDetail(employeeId);
  const { data: treeData } = useQuery(orgUnitTreeOptions());

  // Flatten org tree to a lookup map
  const orgMap = useMemo(() => {
    const m = new Map<string, { unitName: string; status: string }>();
    const walk = (nodes: OrgNode[] | undefined) => {
      for (const n of nodes ?? []) {
        m.set(n.id, { unitName: n.unitName, status: n.status });
        walk(n.children);
      }
    };
    walk((treeData?.data ?? []) as OrgNode[]);
    return m;
  }, [treeData?.data]);

  if (isLoading) return <FormSkeleton fields={3} />;

  // Get assignments from the aggregate (contracts with orgUnitId)
  const contracts = (aggregate?.contracts ?? []) as Array<{
    id: string;
    orgUnitId: string;
    effectiveFrom: string;
    effectiveTo?: string;
    status: string;
    contractNo?: string;
    orgUnitName?: string;
  }>;

  // Derive assignment history from contracts with orgUnitId
  const assignmentEntries = contracts
    .filter((c) => c.orgUnitId)
    .map((c) => ({
      id: c.id,
      orgUnitName: c.orgUnitName ?? orgMap.get(c.orgUnitId)?.unitName ?? "—",
      orgUnitStatus: orgMap.get(c.orgUnitId)?.status ?? "active",
      startDate: c.effectiveFrom,
      endDate: c.effectiveTo,
      contractNo: c.contractNo,
      status: c.status,
    }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold">Quá trình bổ nhiệm</h3>
      </div>

      {assignmentEntries.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-2.5 text-left font-medium">Đơn vị</th>
                <th className="px-4 py-2.5 text-left font-medium">Số hợp đồng</th>
                <th className="px-4 py-2.5 text-left font-medium">Ngày bắt đầu</th>
                <th className="px-4 py-2.5 text-left font-medium">Ngày kết thúc</th>
                <th className="rounded-r-lg px-4 py-2.5 text-left font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {assignmentEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5">{entry.orgUnitName}</td>
                  <td className="px-4 py-2.5">{entry.contractNo ?? "—"}</td>
                  <td className="px-4 py-2.5">{formatDate(entry.startDate)}</td>
                  <td className="px-4 py-2.5">{formatDate(entry.endDate) || "—"}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadgeFromCode
                      code={entry.status === "valid" ? "active" : entry.status}
                      label={entry.status === "valid" ? "Đang hoạt động" : entry.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Chưa có thông tin bổ nhiệm.
        </p>
      )}
    </div>
  );
}
