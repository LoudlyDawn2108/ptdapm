import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/salary",
)({
  component: SalaryTab,
});

function InfoRow({
  label,
  value,
}: { label: string; value: string | undefined | null }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

function SalaryTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const salary = (emp as any).salaryGradeStep;
  const bankAccounts = (emp as any).bankAccounts as any[] | undefined;
  const allowances = (emp as any).allowances as any[] | undefined;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Hệ số lương ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hệ số lương</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoRow label="Ngạch lương" value={salary?.gradeName} />
            <InfoRow label="Bậc" value={salary?.stepName} />
            <InfoRow
              label="Hệ số"
              value={salary?.coefficient?.toString()}
            />
          </dl>
        </CardContent>
      </Card>

      {/* ── Ngân hàng ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin ngân hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {bankAccounts && bankAccounts.length > 0 ? (
            <dl>
              {bankAccounts.map((b: any, i: number) => (
                <div
                  key={b.id ?? i}
                  className="py-2 border-b last:border-0 space-y-1"
                >
                  <InfoRow label="Ngân hàng" value={b.bankName} />
                  <InfoRow label="Số tài khoản" value={b.accountNo} />
                  {b.isPrimary && (
                    <span className="inline-block mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                      Tài khoản chính
                    </span>
                  )}
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có thông tin ngân hàng.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Phụ cấp ── */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Phụ cấp</CardTitle>
        </CardHeader>
        <CardContent>
          {allowances && allowances.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Loại phụ cấp</th>
                    <th className="py-2 pr-4">Số tiền</th>
                    <th className="py-2">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {allowances.map((a: any, i: number) => (
                    <tr key={a.id ?? i} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">
                        {a.allowanceTypeName ?? a.allowanceTypeId}
                      </td>
                      <td className="py-2 pr-4">
                        {a.amount != null
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(a.amount)
                          : "—"}
                      </td>
                      <td className="py-2">{a.note ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có thông tin phụ cấp.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
