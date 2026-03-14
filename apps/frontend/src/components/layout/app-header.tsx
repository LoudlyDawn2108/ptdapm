import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLogout } from "@/features/auth/api";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@hrms/shared";
import { Link, useMatches } from "@tanstack/react-router";
import { ChevronsUpDown, Loader2, LogOut } from "lucide-react";

const BREADCRUMB_LABELS: Record<string, string> = {
  "": "Trang chủ",
  accounts: "Tài khoản",
  employees: "Nhân sự",
  new: "Thêm mới",
  "org-units": "Đơn vị tổ chức",
  config: "Cấu hình",
  "contract-types": "Loại hợp đồng",
  "salary-coefficients": "Hệ số lương",
  "salary-grades": "Ngạch lương",
  "allowance-types": "Loại phụ cấp",
  training: "Đào tạo",
  reports: "Báo cáo",
  "audit-logs": "Nhật ký",
  my: "Cá nhân",
  profile: "Hồ sơ",
  org: "Đơn vị công tác",
};

function getLabel(segment: string): string {
  return BREADCRUMB_LABELS[segment] ?? segment;
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppHeader() {
  const matches = useMatches();
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const breadcrumbs = matches
    .filter((m) => m.id !== "__root__" && m.id !== "/_authenticated")
    .map((m) => {
      const segments = m.pathname.replace(/\/$/, "").split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1] ?? "";
      return {
        label: getLabel(lastSegment),
        path: m.pathname,
      };
    });

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <BreadcrumbItem key={crumb.path}>
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={crumb.path}>
                <BreadcrumbLink asChild>
                  <Link to={crumb.path}>{crumb.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-2 text-left hover:bg-accent/50 focus-visible:outline-none"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.fullName ?? user?.username)}
                </AvatarFallback>
              </Avatar>
              <div className="grid text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.fullName ?? user?.username ?? "Người dùng"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.role ? Role[user.role]?.label : ""}
                </span>
              </div>
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
