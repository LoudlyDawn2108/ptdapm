import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { useLogout } from "@/features/auth/api";
import { Role } from "@hrms/shared";

export function AppHeader() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-none">
            {user?.fullName ?? user?.username ?? "Người dùng"}
          </p>
          <p className="text-xs text-muted-foreground">
            {user?.role ? Role[user.role]?.label : ""}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          title="Đăng xuất"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
