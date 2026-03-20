import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { sessionOptions } from "@/features/auth/api";
import { useLogout } from "@/features/auth/api";
import { useIdleTimeout } from "@/hooks/use-idle-timeout";
import { BreadcrumbContext, type BreadcrumbOverride } from "@/lib/breadcrumb-context";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(sessionOptions());
      return { user: session.user };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const logoutMutation = useLogout();
  const [breadcrumbOverrides, setBreadcrumbOverrides] = useState<BreadcrumbOverride[]>([]);

  const handleIdleTimeout = useCallback(() => {
    toast.warning("Phiên đăng nhập hết hạn do không hoạt động");
    logoutMutation.mutate();
  }, [logoutMutation]);

  useIdleTimeout(handleIdleTimeout);

  return (
    <BreadcrumbContext.Provider
      value={{ overrides: breadcrumbOverrides, setOverrides: setBreadcrumbOverrides }}
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "17.5rem",
            "--sidebar-width-icon": "44px",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbContext.Provider>
  );
}
