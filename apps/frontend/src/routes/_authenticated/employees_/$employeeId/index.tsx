import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Gender, FamilyRelation } from "@hrms/shared";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/",
)({
  component: GeneralInfoTab,
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

function GeneralInfoTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={6} />;
  if (!emp) return null;

  const genderLabel =
    Gender[emp.gender as keyof typeof Gender]?.label ?? emp.gender;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Thông tin cá nhân ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoRow label="Họ tên" value={emp.fullName} />
            <InfoRow label="Ngày sinh" value={formatDate(emp.dob)} />
            <InfoRow label="Giới tính" value={genderLabel} />
            <InfoRow label="CCCD/CMND" value={emp.nationalId} />
            <InfoRow label="Quê quán" value={emp.hometown} />
            <InfoRow label="Địa chỉ" value={emp.address} />
            <InfoRow label="Mã số thuế" value={emp.taxCode} />
            <InfoRow label="Số BHXH" value={emp.socialInsuranceNo} />
            <InfoRow label="Số BHYT" value={emp.healthInsuranceNo} />
          </dl>
        </CardContent>
      </Card>

      {/* ── Liên hệ ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoRow label="Email" value={emp.email} />
            <InfoRow label="Số điện thoại" value={emp.phone} />
            <InfoRow
              label="Quốc tịch"
              value={emp.isForeigner ? "Người nước ngoài" : "Việt Nam"}
            />
            {emp.isForeigner && (
              <>
                <InfoRow label="Số Visa" value={(emp as any).visaNumber} />
                <InfoRow
                  label="Hạn Visa"
                  value={formatDate((emp as any).visaExpiry)}
                />
                <InfoRow label="Số Hộ chiếu" value={(emp as any).passportNumber} />
                <InfoRow
                  label="Hạn Hộ chiếu"
                  value={formatDate((emp as any).passportExpiry)}
                />
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* ── Thông tin gia đình ── */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Thông tin gia đình</CardTitle>
        </CardHeader>
        <CardContent>
          {(emp as any).familyMembers?.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Quan hệ</th>
                    <th className="py-2 pr-4">Họ tên</th>
                    <th className="py-2 pr-4">Ngày sinh</th>
                    <th className="py-2 pr-4">SĐT</th>
                    <th className="py-2">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {((emp as any).familyMembers as any[]).map(
                    (member: any, i: number) => (
                      <tr key={member.id ?? i} className="border-b last:border-0">
                        <td className="py-2 pr-4">
                          {FamilyRelation[
                            member.relation as keyof typeof FamilyRelation
                          ]?.label ?? member.relation}
                        </td>
                        <td className="py-2 pr-4 font-medium">
                          {member.fullName}
                        </td>
                        <td className="py-2 pr-4">
                          {formatDate(member.dob)}
                        </td>
                        <td className="py-2 pr-4">{member.phone ?? "—"}</td>
                        <td className="py-2">{member.note ?? "—"}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có thông tin gia đình.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
