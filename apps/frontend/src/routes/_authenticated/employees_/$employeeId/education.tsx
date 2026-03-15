import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField, SectionTitle } from "@/components/shared/read-only-field";
import { Button } from "@/components/ui/button";
import { employeeDetailOptions } from "@/features/employees/api";
import { AcademicRank, EducationLevel } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/education")({
  component: EducationTab,
});

function EducationTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const aggregate = data?.data as any;
  const emp = aggregate?.employee;
  const degrees = aggregate?.degrees as any[] | undefined;
  const certifications = aggregate?.certifications as any[] | undefined;

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const eduLabel =
    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ?? emp.educationLevel;
  const rankLabel =
    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ?? emp.academicRank;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {/* ── Top row: Trình độ văn hóa + Học hàm/Học vị ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Trình độ văn hóa" value={eduLabel} />
        <ReadOnlyField label="Học hàm/Học vị" value={rankLabel} />
      </div>

      {/* ── Bằng cấp ── */}
      <SectionTitle title="Thông tin bằng cấp" />
      {degrees && degrees.length > 0 ? (
        <div className="space-y-4">
          {degrees.map((d: any, i: number) => (
            <div
              key={d.id ?? i}
              className="grid grid-cols-1 items-end gap-4 md:grid-cols-[2fr_1fr_auto]"
            >
              <ReadOnlyField label="Tên bằng" value={d.degreeName} />
              <ReadOnlyField label="Nơi cấp" value={d.school} />
              <Button size="default" className="md:self-end">
                <Eye data-icon="inline-start" />
                Xem PDF
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có bằng cấp.</p>
      )}

      {/* ── Chứng chỉ ── */}
      <SectionTitle title="Thông tin chứng chỉ" />
      {certifications && certifications.length > 0 ? (
        <div className="space-y-4">
          {certifications.map((c: any, i: number) => (
            <div
              key={c.id ?? i}
              className="grid grid-cols-1 items-end gap-4 md:grid-cols-[2fr_1fr_auto]"
            >
              <ReadOnlyField label="Tên chứng chỉ" value={c.certificateName} />
              <ReadOnlyField label="Nơi cấp" value={c.issuedBy} />
              <Button size="default" className="md:self-end">
                <Eye data-icon="inline-start" />
                Xem PDF
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có chứng chỉ.</p>
      )}
    </div>
  );
}
