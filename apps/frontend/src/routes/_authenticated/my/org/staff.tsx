import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { useMyEmployeeDetail } from "@/features/employees/api";
import { orgUnitDetailOptions } from "@/features/org-units/api";
import { formatDate } from "@/lib/date-utils";
import { WorkStatus } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/my/org/staff")({
  component: StaffTab,
});

type AssignmentEntry = {
  id: string;
  employeeId: string;
  positionTitle: string | null;
  startedOn: string | null;
  endedOn: string | null;
  staffCode: string;
  fullName: string;
};

function StaffTab() {
  const { employee } = useMyEmployeeDetail();
  const orgUnitId = employee?.currentOrgUnitId;

  const { data: orgDetail } = useQuery({
    ...orgUnitDetailOptions(orgUnitId ?? ""),
    enabled: !!orgUnitId,
  });

  const unit = orgDetail?.data;
  const assignments = (unit?.assignments ?? []) as AssignmentEntry[];

  return (
    <div className="rounded-xl border bg-card p-6">
      {assignments.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-2.5 text-left font-medium">Mã NS</th>
                <th className="px-4 py-2.5 text-left font-medium">Họ tên</th>
                <th className="px-4 py-2.5 text-left font-medium">Đơn vị công tác</th>
                <th className="px-4 py-2.5 text-left font-medium">Chức vụ</th>
                <th className="px-4 py-2.5 text-left font-medium">Ngày bổ nhiệm</th>
                <th className="rounded-r-lg px-4 py-2.5 text-left font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const isEnded = !!a.endedOn;
                return (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2.5">{a.staffCode}</td>
                    <td className="px-4 py-2.5">{a.fullName}</td>
                    <td className="px-4 py-2.5">{unit?.unitName ?? "—"}</td>
                    <td className="px-4 py-2.5">{a.positionTitle ?? "—"}</td>
                    <td className="px-4 py-2.5">{formatDate(a.startedOn)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadgeFromCode
                        code={isEnded ? "terminated" : "active"}
                        label={isEnded ? "Đã thôi việc" : "Đang công tác"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Chưa có nhân sự trong đơn vị này.
        </p>
      )}
    </div>
  );
}
