import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { sessionOptions } from "@/features/auth/api";
import { useAuthStore } from "@/stores/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIdleTimeout } from "@/hooks/use-idle-timeout";
import { useLogout } from "@/features/auth/api";
import { toast } from "sonner";
import { useCallback } from "react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionOptions(),
      );
      // Sync user to Zustand for convenient synchronous access
      useAuthStore.getState().setUser(session.user);
      // Pass user to all child routes via context
      return { user: session.user };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const logoutMutation = useLogout();

  const handleIdleTimeout = useCallback(() => {
    toast.warning("Phiên đăng nhập hết hạn do không hoạt động");
    logoutMutation.mutate();
  }, [logoutMutation]);

  useIdleTimeout(handleIdleTimeout);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
