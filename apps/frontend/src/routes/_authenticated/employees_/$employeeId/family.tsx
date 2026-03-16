import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import { useEmployeeDetail } from "@/features/employees/api";
import { FamilyRelation } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/family")({
  component: FamilyTab,
});

function FamilyTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, isLoading } = useEmployeeDetail(employeeId);
  const familyMembers = aggregate?.familyMembers;

  if (isLoading) return <FormSkeleton fields={4} />;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {familyMembers && familyMembers.length > 0 ? (
        familyMembers.map((member, i) => {
          const relationLabel =
            FamilyRelation[member.relation as keyof typeof FamilyRelation]?.label ??
            member.relation;

          return (
            <div key={member.id ?? i} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ReadOnlyField label="Họ tên" value={member.fullName} />
              <ReadOnlyField label="Mối quan hệ" value={relationLabel} />
            </div>
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có thông tin gia đình.</p>
      )}
    </div>
  );
}
