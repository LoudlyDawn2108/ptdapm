import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "@/features/employees/api";
import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { WorkStatus } from "@hrms/shared";
import { useAuth } from "@/features/auth/hooks";
import { ArrowLeft, Pencil } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

const TAB_ITEMS = [
  { value: "", label: "Thông tin chung", path: "" },
  { value: "education", label: "Trình độ & Chức danh", path: "/education" },
  { value: "party", label: "Đảng/Đoàn", path: "/party" },
  { value: "salary", label: "Lương & Phụ cấp", path: "/salary" },
  { value: "contracts", label: "Hợp đồng", path: "/contracts" },
  { value: "rewards", label: "Khen thưởng/Kỷ luật", path: "/rewards" },
  { value: "work-history", label: "Công tác", path: "/work-history" },
] as const;

export const Route = createFileRoute("/_authenticated/employees_/$employeeId")({
  component: EmployeeDetailLayout,
});

function EmployeeDetailLayout() {
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  // Determine active tab from current path
  const basePath = `/employees/${employeeId}`;
  const activeTab = (() => {
    const suffix = currentPath.replace(basePath, "").replace(/^\//, "");
    return suffix || "";
  })();

  const canEdit =
    user &&
    (user.role === "TCCB" || user.role === "ADMIN") &&
    emp?.workStatus !== "terminated";

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Thông tin nhân sự" />
        <FormSkeleton fields={8} />
      </div>
    );
  }

  if (!emp) {
    return (
      <div>
        <PageHeader title="Không tìm thấy" />
        <p className="text-muted-foreground">
          Không tìm thấy thông tin nhân sự.
        </p>
      </div>
    );
  }

  const wsLabel =
    WorkStatus[emp.workStatus as keyof typeof WorkStatus]?.label ??
    emp.workStatus;

  const initials = (emp.fullName ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      {/* ── Header ───────────────────────── */}
      <PageHeader
        title=""
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            {canEdit && (
              <Button asChild>
                <Link
                  to="/employees/$employeeId/edit"
                  params={{ employeeId }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Link>
              </Button>
            )}
          </div>
        }
      >
        {/* Employee identity row */}
        <div className="flex items-center gap-4 mb-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {emp.fullName}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Mã NV: {emp.staffCode ?? "—"}</span>
              <span>·</span>
              <StatusBadgeFromCode code={emp.workStatus} label={wsLabel} />
            </div>
          </div>
        </div>
      </PageHeader>

      {/* ── Tab Navigation ───────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          const tab = TAB_ITEMS.find((t) => t.value === val);
          if (tab) {
            navigate({
              to: `/employees/$employeeId${tab.path}`,
              params: { employeeId },
            } as any);
          }
        }}
        className="mb-6"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ── Tab Content (child routes) ──── */}
      <Outlet />
    </div>
  );
}
