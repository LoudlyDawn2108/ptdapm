import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField, SectionTitle } from "@/components/shared/read-only-field";
import { useMyEmployeeDetail } from "@/features/employees/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/my/profile/salary")({
  component: SalaryTab,
});

type SalaryGradeSummary = {
  id?: string;
  gradeId?: string;
  salaryGradeId?: string;
  gradeName?: string | null;
  stepName?: string | null;
  coefficient?: string | number | null;
};

type EmployeeAllowanceRow = {
  id: string;
  allowanceTypeId?: string | null;
  allowanceName?: string | null;
  amount?: number | string | null;
  note?: string | null;
  status?: string | null;
  allowanceTypeStatus?: string | null;
};

type SalaryAggregate = {
  employee?: Record<string, unknown> | null;
  salaryGradeStep?: SalaryGradeSummary | null;
  allowances?: EmployeeAllowanceRow[];
};

function AllowanceStatusBadge({ status }: { status?: string }) {
  const isActive = !status || status === "ACTIVE" || status === "active";

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

function SalaryTab() {
  const { aggregate, employee: emp, isLoading } = useMyEmployeeDetail();

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const salaryAggregate = aggregate as unknown as SalaryAggregate | undefined;
  const salary = salaryAggregate?.salaryGradeStep;
  const allowances = salaryAggregate?.allowances;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-2">
      <SectionTitle title="Thông tin hệ số lương" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReadOnlyField label="Ngạch viên chức" value={salary?.gradeName} />
        <ReadOnlyField label="Bậc lương" value={salary?.stepName} />
        <ReadOnlyField label="Hệ số lương" value={salary?.coefficient?.toString()} />
      </div>

      <SectionTitle title="Thông tin phụ cấp" />

      {allowances && allowances.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-slate-700">
                <th className="rounded-l-lg px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Tên loại phụ cấp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Mức phụ cấp
                </th>
                <th className="rounded-r-lg px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {allowances.map((a, i) => (
                <tr key={a.id ?? i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{a.allowanceName ?? "—"}</td>
                  <td className="px-4 py-3">{a.amount == null ? "—" : a.amount}</td>
                  <td className="px-4 py-3">
                    <AllowanceStatusBadge status={a.status ?? undefined} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <p className="text-sm">Chưa có thông tin phụ cấp.</p>
        </div>
      )}
    </div>
  );
}
