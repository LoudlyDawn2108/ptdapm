import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import { employeeDetailOptions } from "@/features/employees/api";
import { formatDate } from "@/lib/date-utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/work-history")({
  component: WorkHistoryTab,
});

function WorkHistoryTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const aggregate = data?.data as any;
  const previousJobs = aggregate?.previousJobs as any[] | undefined;

  if (isLoading) return <FormSkeleton fields={3} />;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {previousJobs && previousJobs.length > 0 ? (
        previousJobs.map((job: any) => (
          <div key={job.id} className="grid grid-cols-[2fr_1fr_1fr] gap-4">
            <ReadOnlyField label="Tên nơi công tác" value={job.workplace} />
            <ReadOnlyField label="Từ ngày" value={formatDate(job.startedOn)} />
            <ReadOnlyField label="Đến ngày" value={formatDate(job.endedOn)} />
          </div>
        ))
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">
          Chưa có thông tin quá trình công tác.
        </p>
      )}
    </div>
  );
}
