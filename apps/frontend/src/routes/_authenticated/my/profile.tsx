import { api } from "@/api/client";
import { EmployeeDisplay } from "@/components/employees/EmployeeDisplay";
import { PageHeader } from "@/components/ui/PageHeader";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/my/profile")({
  component: MyProfilePage,
});

function MyProfilePage() {
  type EmployeePayload = Awaited<ReturnType<typeof api.employees.me.get>>["data"];
  type EmployeeData = EmployeePayload extends { data: infer T } ? T : null;

  const [employee, setEmployee] = React.useState<EmployeeData>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasEmployee, setHasEmployee] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadEmployee = async () => {
      const { data, error } = await api.employees.me.get();

      if (!isMounted) return;

      if (data?.data) {
        setEmployee(data.data);
        setHasEmployee(true);
      } else if (error) {
        setHasEmployee(false);
      }

      setIsLoading(false);
    };

    loadEmployee();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hồ sơ cá nhân"
        description={employee?.fullName ?? ""}
        actions={
          hasEmployee ? (
            <button
              type="button"
              disabled
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-muted-foreground opacity-50 transition"
            >
              {/* TODO: implement edit profile navigation */}
              Chỉnh sửa
            </button>
          ) : null
        }
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Đang tải hồ sơ...
        </div>
      ) : hasEmployee && employee ? (
        <EmployeeDisplay data={employee} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Chưa có hồ sơ nhân sự
        </div>
      )}
    </div>
  );
}
