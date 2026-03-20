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
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsUpDown, Loader2, LogOut } from "lucide-react";

const BREADCRUMB_LABELS: Record<string, string> = {
  "": "Trang chủ",
  accounts: "Tài khoản",
  employees: "Nhân sự",
  new: "Thêm mới",
  edit: "Chỉnh sửa",
  "org-units": "Đơn vị tổ chức",
  config: "Cấu hình",
  "contract-types": "Loại hợp đồng",
  "salary-coefficients": "Hệ số lương",
  "salary-grades": "Hệ số lương",
  "allowance-types": "Phụ cấp",
  training: "Đào tạo",
  reports: "Báo cáo",
  "audit-logs": "Nhật ký",
  my: "Cá nhân",
  profile: "Hồ sơ",
  org: "Đơn vị công tác",
  family: "Gia đình",
  "work-history": "Lịch sử công tác",
  education: "Học vấn",
  salary: "Lương & phụ cấp",
  contracts: "Hợp đồng",
  rewards: "Khen thưởng",
  party: "Đoàn/Đảng",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getLabel(segment: string): string {
  if (UUID_RE.test(segment)) return "Chi tiết";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: getLabel(seg),
    path: `/${segments.slice(0, i + 1).join("/")}`,
  }));

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
