import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { PartyOrgType } from "@hrms/shared";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/party",
)({
  component: PartyTab,
});

function PartyTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!emp) return null;

  const memberships = (emp as any).partyMemberships as any[] | undefined;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {memberships && memberships.length > 0 ? (
        memberships.map((m: any, i: number) => {
          const typeLabel =
            PartyOrgType[m.organizationType as keyof typeof PartyOrgType]
              ?.label ?? m.organizationType;
          return (
            <Card key={m.id ?? i}>
              <CardHeader>
                <CardTitle className="text-base">
                  Thông tin {typeLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b">
                    <dt className="text-sm text-muted-foreground">Tổ chức</dt>
                    <dd className="col-span-2 text-sm font-medium">
                      {typeLabel}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b">
                    <dt className="text-sm text-muted-foreground">
                      Ngày gia nhập
                    </dt>
                    <dd className="col-span-2 text-sm font-medium">
                      {formatDate(m.joinedOn)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2">
                    <dt className="text-sm text-muted-foreground">Chi tiết</dt>
                    <dd className="col-span-2 text-sm font-medium">
                      {m.details || "—"}
                    </dd>
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
