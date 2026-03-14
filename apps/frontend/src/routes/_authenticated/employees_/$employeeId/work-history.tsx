import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/work-history",
)({
  component: WorkHistoryTab,
});

function WorkHistoryTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!emp) return null;

  const previousJobs = (emp as any).previousJobs as any[] | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Quá trình công tác trước khi về trường
        </CardTitle>
      </CardHeader>
      <CardContent>
        {previousJobs && previousJobs.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">STT</th>
                  <th className="py-2 pr-4">Nơi công tác</th>
                  <th className="py-2 pr-4">Từ ngày</th>
                  <th className="py-2 pr-4">Đến ngày</th>
                  <th className="py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {previousJobs.map((job: any, i: number) => (
                  <tr key={job.id ?? i} className="border-b last:border-0">
                    <td className="py-2 pr-4">{i + 1}</td>
                    <td className="py-2 pr-4 font-medium">{job.workplace}</td>
                    <td className="py-2 pr-4">{formatDate(job.startedOn)}</td>
                    <td className="py-2 pr-4">{formatDate(job.endedOn)}</td>
                    <td className="py-2">{job.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            Chưa có thông tin quá trình công tác.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
