import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks";
import { employeeDetailOptions } from "@/features/employees/api";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { Pencil, UserX } from "lucide-react";

const TAB_ITEMS = [
  { value: "", label: "Thông tin chung", path: "" },
  { value: "family", label: "Thông tin gia đình", path: "/family" },
  { value: "work-history", label: "Lịch sử công tác", path: "/work-history" },
  { value: "education", label: "Trình độ học vấn", path: "/education" },
  { value: "salary", label: "Lương và phụ cấp", path: "/salary" },
  { value: "contracts", label: "Hợp đồng", path: "/contracts" },
  { value: "rewards", label: "Khen thưởng/Kỷ luật", path: "/rewards" },
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
  const aggregate = data?.data as any;
  const emp = aggregate?.employee;

  // Determine active tab from current path
  const basePath = `/employees/${employeeId}`;
  const activeTab = (() => {
    const suffix = currentPath.replace(basePath, "").replace(/^\//, "");
    return suffix || "";
  })();

  const canEdit =
    user && (user.role === "TCCB" || user.role === "ADMIN") && emp?.workStatus !== "terminated";

  if (isLoading) {
    return <FormSkeleton fields={8} />;
  }

  if (!emp) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy thông tin nhân sự.</p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Action Buttons ───────────────── */}
      <div className="flex items-center justify-end gap-3 mb-4">
        {canEdit && (
          <Button variant="outline" asChild>
            <Link to="/employees/$employeeId/edit" params={{ employeeId }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa hồ sơ
            </Link>
          </Button>
        )}
        {canEdit && emp.workStatus !== "terminated" && (
          <Button variant="destructive">
            <UserX className="mr-2 h-4 w-4" />
            Đánh dấu thôi việc
          </Button>
        )}
      </div>

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
