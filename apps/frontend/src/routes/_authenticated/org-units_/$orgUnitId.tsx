import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { QueryError } from "@/components/shared/query-error";
import { RoleGuard } from "@/components/shared/role-guard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgUnitFormDialog } from "@/features/org-units/OrgUnitFormDialog";
import { orgUnitDetailOptions } from "@/features/org-units/api";
import { useBreadcrumbOverrides } from "@/lib/breadcrumb-context";
import { authorizeRoute } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const TAB_ITEMS = [
  { value: "", label: "Thông tin chung", path: "" },
  { value: "staff", label: "Nhân sự", path: "/staff" },
  { value: "children", label: "Đơn vị trực thuộc", path: "/children" },
] as const;

export const Route = createFileRoute("/_authenticated/org-units_/$orgUnitId")({
  beforeLoad: authorizeRoute("/org-units"),
  component: OrgUnitDetailLayout,
});

function OrgUnitDetailLayout() {
  const { orgUnitId } = Route.useParams();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { setOverrides } = useBreadcrumbOverrides();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: orgDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(orgUnitDetailOptions(orgUnitId));

  const unit = orgDetail?.data;

  // Set breadcrumb: "Sơ đồ tổ chức > DV001 - Ban Giám hiệu"
  useEffect(() => {
    if (unit) {
      setOverrides([
        { segment: orgUnitId, label: `${unit.unitCode} - ${unit.unitName}`, collapseAfter: true },
      ]);
    }
    return () => setOverrides([]);
  }, [orgUnitId, unit?.unitCode, unit?.unitName, setOverrides]);

  // Determine active tab from current path
  const basePath = `/org-units/${orgUnitId}`;
  const activeTab = (() => {
    const suffix = currentPath.replace(basePath, "").replace(/^\//, "");
    return suffix || "";
  })();

  const navigateToTab = (path: string) => {
    switch (path) {
      case "":
        return navigate({ to: "/org-units/$orgUnitId", params: { orgUnitId } });
      case "/staff":
        return navigate({ to: "/org-units/$orgUnitId/staff", params: { orgUnitId } });
      case "/children":
        return navigate({ to: "/org-units/$orgUnitId/children", params: { orgUnitId } });
      default:
        return navigate({ to: "/org-units/$orgUnitId", params: { orgUnitId } });
    }
  };

  if (isError) {
    return <QueryError error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return <FormSkeleton fields={6} />;
  }

  if (!unit) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy đơn vị tổ chức.</p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Action Buttons ─────────────── */}
      <RoleGuard roles={["ADMIN"]}>
        <div className="flex justify-end gap-2 mb-4">
          {unit.status === "active" && (
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa đơn vị
            </Button>
          )}
        </div>
      </RoleGuard>

      {/* ── Tab Navigation ───────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          const tab = TAB_ITEMS.find((t) => t.value === val);
          if (tab) {
            void navigateToTab(tab.path);
          }
        }}
        className="mb-6"
      >
        <TabsList className="w-full justify-start" aria-label="Chi tiết đơn vị">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} aria-label={`Tab ${tab.label}`}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ── Tab Content (child routes) ──── */}
      <Outlet />

      {/* ── Edit Dialog ──────────────────── */}
      <OrgUnitFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingItem={unit}
      />
    </div>
  );
}
