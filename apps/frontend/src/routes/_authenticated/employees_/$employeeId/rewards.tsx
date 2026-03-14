import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { EvalType } from "@hrms/shared";
import { formatDate } from "@/lib/date-utils";
import { Award, AlertTriangle } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/rewards",
)({
  component: RewardsTab,
});

function RewardsTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!emp) return null;

  const evaluations = (emp as any).evaluations as any[] | undefined;

  const rewards =
    evaluations?.filter((e: any) => e.evalType === "REWARD") ?? [];
  const disciplines =
    evaluations?.filter((e: any) => e.evalType === "DISCIPLINE") ?? [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Khen thưởng ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-4 w-4 text-yellow-500" />
            Khen thưởng
            {rewards.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {rewards.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rewards.length > 0 ? (
            <div className="space-y-3">
              {rewards.map((r: any, i: number) => (
                <div
                  key={r.id ?? i}
                  className="rounded-lg border p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{r.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(r.issuedOn)}
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-sm text-muted-foreground">
                      {r.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có khen thưởng.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Kỷ luật ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Kỷ luật
            {disciplines.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {disciplines.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {disciplines.length > 0 ? (
            <div className="space-y-3">
              {disciplines.map((d: any, i: number) => (
                <div
                  key={d.id ?? i}
                  className="rounded-lg border border-destructive/20 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{d.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(d.issuedOn)}
                    </span>
                  </div>
                  {d.description && (
                    <p className="text-sm text-muted-foreground">
                      {d.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có kỷ luật.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
