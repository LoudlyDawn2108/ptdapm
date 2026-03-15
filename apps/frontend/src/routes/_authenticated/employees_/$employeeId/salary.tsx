import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField, SectionTitle } from "@/components/shared/read-only-field";
import { Button } from "@/components/ui/button";
import { employeeDetailOptions } from "@/features/employees/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/salary")({
  component: SalaryTab,
});

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
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const aggregate = data?.data as any;
  const emp = aggregate?.employee;
  const salary = aggregate?.salaryGradeStep;
  const allowances = aggregate?.allowances as any[] | undefined;

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-2">
      {/* ── Section 1: Thông tin hệ số lương ── */}
      <SectionTitle
        title="Thông tin hệ số lương"
        action={
          <Button size="sm" variant="default">
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Sửa hệ số lương
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReadOnlyField label="Ngạch viên chức" value={salary?.gradeName} />
        <ReadOnlyField label="Bậc lương" value={salary?.stepName} />
        <ReadOnlyField label="Hệ số lương" value={salary?.coefficient?.toString()} />
      </div>

      {/* ── Section 2: Thông tin phụ cấp ── */}
      <SectionTitle
        title="Thông tin phụ cấp"
        action={
          <Button size="sm" variant="default">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Thêm phụ cấp
          </Button>
        }
      />

      {allowances && allowances.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-slate-700">
                <th className="rounded-l-lg px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Tên loại phụ cấp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Trạng thái
                </th>
                <th className="rounded-r-lg px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {allowances.map((a: any, i: number) => (
                <tr key={a.id ?? i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{a.allowanceName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <AllowanceStatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
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
