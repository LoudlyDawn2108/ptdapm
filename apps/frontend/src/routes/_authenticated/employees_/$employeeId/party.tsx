import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeDetail } from "@/features/employees/api";
import { formatDate } from "@/lib/date-utils";
import { PartyOrgType } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/party")({
  component: PartyTab,
});

function PartyTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, isLoading } = useEmployeeDetail(employeeId);

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!aggregate) return null;

  const memberships = aggregate?.partyMemberships;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {memberships && memberships.length > 0 ? (
        memberships.map((m, i) => {
          const typeLabel =
            PartyOrgType[m.organizationType as keyof typeof PartyOrgType]?.label ??
            m.organizationType;
          return (
            <Card key={m.id ?? i}>
              <CardHeader>
                <CardTitle className="text-base">Thông tin {typeLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b">
                    <dt className="text-sm text-muted-foreground">Tổ chức</dt>
                    <dd className="col-span-2 text-sm font-medium">{typeLabel}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b">
                    <dt className="text-sm text-muted-foreground">Ngày gia nhập</dt>
                    <dd className="col-span-2 text-sm font-medium">{formatDate(m.joinedOn)}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2">
                    <dt className="text-sm text-muted-foreground">Chi tiết</dt>
                    <dd className="col-span-2 text-sm font-medium">{m.details || "—"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card className="md:col-span-2">
          <CardContent className="py-8">
            <p className="text-center text-sm text-muted-foreground">
              Chưa có thông tin Đảng/Đoàn.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
