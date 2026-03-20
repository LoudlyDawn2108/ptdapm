import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { useMyEmployeeDetail } from "@/features/employees/api";
import type { EmployeeEvaluation } from "@/features/employees/types";
import { formatDate } from "@/lib/date-utils";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my/profile/rewards")({
  component: RewardsTab,
});

function RewardsTab() {
  const { aggregate, isLoading } = useMyEmployeeDetail();

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!aggregate) return null;

  const evaluations = (aggregate?.evaluations ?? []) as EmployeeEvaluation[];
  const rewards = evaluations.filter((e) => e.evalType === "REWARD");
  const disciplines = evaluations.filter((e) => e.evalType === "DISCIPLINE");

  return (
    <div className="space-y-6">
      {/* ── Khen thưởng Section ── */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Award className="h-4 w-4 text-yellow-500" />
            Khen thưởng
          </h3>
        </div>

        {rewards.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                  <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại khen thưởng</th>
                  <th className="px-4 py-3 text-left font-medium">Tên khen thưởng</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày quyết định</th>
                  <th className="px-4 py-3 text-left font-medium">Số quyết định</th>
                  <th className="px-4 py-3 text-left font-medium">Nội dung</th>
                  <th className="rounded-r-lg px-4 py-3 text-left font-medium">Số tiền thưởng</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r, i) => (
                  <tr key={r.id ?? i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">{r.rewardType ?? "—"}</td>
                    <td className="px-4 py-3">{r.rewardName ?? "—"}</td>
                    <td className="px-4 py-3">{formatDate(r.decisionOn)}</td>
                    <td className="px-4 py-3">{r.decisionNo ?? "—"}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">{r.content ?? "—"}</td>
                    <td className="px-4 py-3">
                      {r.rewardAmount ? Number(r.rewardAmount).toLocaleString("vi-VN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">Chưa có khen thưởng.</p>
        )}
      </div>

      {/* ── Kỷ luật Section ── */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Kỷ luật
          </h3>
        </div>

        {disciplines.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                  <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại kỷ luật</th>
                  <th className="px-4 py-3 text-left font-medium">Tên kỷ luật</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày quyết định</th>
                  <th className="px-4 py-3 text-left font-medium">Lý do</th>
                  <th className="rounded-r-lg px-4 py-3 text-left font-medium">Hình thức xử lý</th>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((d, i) => (
                  <tr key={d.id ?? i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">{d.disciplineType ?? "—"}</td>
                    <td className="px-4 py-3">{d.disciplineName ?? "—"}</td>
                    <td className="px-4 py-3">{formatDate(d.decisionOn)}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">{d.reason ?? "—"}</td>
                    <td className="px-4 py-3">{d.actionForm ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">Chưa có kỷ luật.</p>
        )}
      </div>
    </div>
  );
}
