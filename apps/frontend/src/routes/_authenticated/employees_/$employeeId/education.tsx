import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import {
  EducationLevel,
  TrainingLevel,
  AcademicTitle,
  AcademicRank,
} from "@hrms/shared";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/education",
)({
  component: EducationTab,
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

function EducationTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const eduLabel =
    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ??
    emp.educationLevel;
  const trainingLabel =
    TrainingLevel[emp.trainingLevel as keyof typeof TrainingLevel]?.label ??
    emp.trainingLevel;
  const titleLabel =
    AcademicTitle[emp.academicTitle as keyof typeof AcademicTitle]?.label ??
    emp.academicTitle;
  const rankLabel =
    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ??
    emp.academicRank;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Trình độ & Chức danh ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trình độ học vấn</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoRow label="Trình độ văn hóa" value={eduLabel} />
            <InfoRow label="Trình độ đào tạo" value={trainingLabel} />
            <InfoRow label="Chức danh nghề nghiệp" value={titleLabel} />
            <InfoRow label="Chức danh khoa học" value={rankLabel} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đơn vị & Chức vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoRow label="Đơn vị công tác" value={emp.currentOrgUnitName} />
            <InfoRow label="Chức vụ" value={emp.currentPositionTitle} />
          </dl>
        </CardContent>
      </Card>

      {/* ── Bằng cấp ── */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Bằng cấp</CardTitle>
        </CardHeader>
        <CardContent>
          {(emp as any).degrees?.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Tên bằng</th>
                    <th className="py-2 pr-4">Trường</th>
                    <th className="py-2 pr-4">Ngành</th>
                    <th className="py-2 pr-4">Năm TN</th>
                    <th className="py-2">Xếp loại</th>
                  </tr>
                </thead>
                <tbody>
                  {((emp as any).degrees as any[]).map(
                    (d: any, i: number) => (
                      <tr key={d.id ?? i} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{d.degreeName}</td>
                        <td className="py-2 pr-4">{d.institution ?? "—"}</td>
                        <td className="py-2 pr-4">{d.major ?? "—"}</td>
                        <td className="py-2 pr-4">{d.graduationYear ?? "—"}</td>
                        <td className="py-2">{d.classification ?? "—"}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có bằng cấp.</p>
          )}
        </CardContent>
      </Card>

      {/* ── Chứng chỉ ── */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Chứng chỉ</CardTitle>
        </CardHeader>
        <CardContent>
          {(emp as any).certificates?.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Tên chứng chỉ</th>
                    <th className="py-2 pr-4">Nơi cấp</th>
                    <th className="py-2 pr-4">Ngày cấp</th>
                    <th className="py-2">Ngày hết hạn</th>
                  </tr>
                </thead>
                <tbody>
                  {((emp as any).certificates as any[]).map(
                    (c: any, i: number) => (
                      <tr key={c.id ?? i} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">
                          {c.certificateName}
                        </td>
                        <td className="py-2 pr-4">{c.issuedBy ?? "—"}</td>
                        <td className="py-2 pr-4">
                          {formatDate(c.issuedOn)}
                        </td>
                        <td className="py-2">{formatDate(c.expiresOn)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có chứng chỉ.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
