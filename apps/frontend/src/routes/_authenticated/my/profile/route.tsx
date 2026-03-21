import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyEmployeeDetail } from "@/features/employees/api";
import { useBreadcrumbOverrides } from "@/lib/breadcrumb-context";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

const TAB_ITEMS = [
  { value: "", label: "Thông tin chung", path: "" },
  { value: "family", label: "Thông tin gia đình", path: "/family" },
  { value: "work-history", label: "Lịch sử công tác", path: "/work-history" },
  { value: "education", label: "Trình độ học vấn", path: "/education" },
  // { value: "party", label: "Đảng/Đoàn", path: "/party" },
  { value: "salary", label: "Lương và phụ cấp", path: "/salary" },
  { value: "contracts", label: "Hợp đồng", path: "/contracts" },
  // { value: "assignments", label: "Bổ nhiệm", path: "/assignments" },
  { value: "rewards", label: "Khen thưởng/Kỷ luật", path: "/rewards" },
] as const;

export const Route = createFileRoute("/_authenticated/my/profile")({
  component: MyProfileLayout,
});

function MyProfileLayout() {
  const navigate = useNavigate({ from: "/my/profile" });
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { setOverrides } = useBreadcrumbOverrides();

  const { employee: emp, isLoading } = useMyEmployeeDetail();

  useEffect(() => {
    setOverrides([{ segment: "my", label: "Hồ sơ cá nhân", collapseAfter: true }]);

    return () => setOverrides([]);
  }, [setOverrides]);

  // Determine active tab from current path
  const basePath = "/my/profile";
  const activeTab = (() => {
    const suffix = currentPath.replace(basePath, "").replace(/^\//, "");
    return suffix || "";
  })();

  if (isLoading) {
    return <FormSkeleton fields={8} />;
  }

  if (!emp) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy thông tin hồ sơ cá nhân.</p>
      </div>
    );
  }

  const navigateToTab = (path: (typeof TAB_ITEMS)[number]["path"]) => {
    switch (path) {
      case "":
        return navigate({ to: "/my/profile" });
      case "/family":
        return navigate({ to: "/my/profile/family" });
      case "/work-history":
        return navigate({ to: "/my/profile/work-history" });
      case "/education":
        return navigate({ to: "/my/profile/education" });
      // case "/party":
      //   return navigate({ to: "/my/profile/party" });
      case "/salary":
        return navigate({ to: "/my/profile/salary" });
      case "/contracts":
        return navigate({ to: "/my/profile/contracts" });
      // case "/assignments":
      //   return navigate({ to: "/my/profile/assignments" });
      case "/rewards":
        return navigate({ to: "/my/profile/rewards" });
      default:
        return navigate({ to: "/my/profile" });
    }
  };

  return (
    <div>
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
        <TabsList className="w-full justify-start overflow-x-auto" aria-label="Hồ sơ cá nhân">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} aria-label={`Tab ${tab.label}`}>
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
