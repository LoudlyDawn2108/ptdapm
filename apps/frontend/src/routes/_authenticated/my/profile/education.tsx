import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField, SectionTitle } from "@/components/shared/read-only-field";
import { Button } from "@/components/ui/button";
import { getFileUrl, useMyEmployeeDetail } from "@/features/employees/api";
import type { Certification, Degree } from "@/features/employees/types";
import { AcademicRank, EducationLevel } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my/profile/education")({
  component: EducationTab,
});

function EducationTab() {
  const { aggregate, employee: emp, isLoading } = useMyEmployeeDetail();
  const degrees = aggregate?.degrees as Degree[] | undefined;
  const certifications = (aggregate?.certifications ?? []) as Certification[];

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const eduLabel =
    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ?? emp.educationLevel;
  const rankLabel =
    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ?? emp.academicRank;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Trình độ văn hóa" value={eduLabel} />
        <ReadOnlyField label="Học hàm/Học vị" value={rankLabel} />
      </div>

      <SectionTitle title="Thông tin bằng cấp" />

      {degrees && degrees.length > 0 ? (
        <div className="space-y-3">
          {degrees.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] items-end"
            >
              <ReadOnlyField label="Tên bằng" value={d.degreeName} />
              <ReadOnlyField label="Nơi cấp" value={d.school} />
              <div className="flex items-center gap-2 pb-0.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!d.degreeFileId}
                  onClick={() =>
                    d.degreeFileId &&
                    window.open(getFileUrl(d.degreeFileId), "_blank", "noopener,noreferrer")
                  }
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Xem PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có bằng cấp.</p>
      )}

      <SectionTitle title="Thông tin chứng chỉ" />

      {certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] items-end"
            >
              <ReadOnlyField label="Tên chứng chỉ" value={c.certName} />
              <ReadOnlyField label="Nơi cấp" value={c.issuedBy} />
              <div className="flex items-center gap-2 pb-0.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!c.certFileId}
                  onClick={() =>
                    c.certFileId &&
                    window.open(getFileUrl(c.certFileId), "_blank", "noopener,noreferrer")
                  }
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Xem PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có chứng chỉ.</p>
      )}
    </div>
  );
}
