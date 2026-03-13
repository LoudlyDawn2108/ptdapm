import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  GraduationCap,
  BarChart3,
  ClipboardList,
  User,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks";

interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  {
    title: "Bảng điều khiển",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý tài khoản",
    to: "/accounts",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Nhân sự",
    to: "/employees",
    icon: Users,
    roles: ["TCCB", "TCKT"],
  },
  {
    title: "Đơn vị tổ chức",
    to: "/org-units",
    icon: Building2,
    roles: ["ADMIN", "TCCB"],
  },
  {
    title: "Đào tạo",
    to: "/training",
    icon: GraduationCap,
    roles: ["TCCB"],
  },
  {
    title: "Báo cáo",
    to: "/reports",
    icon: BarChart3,
    roles: ["TCCB", "TCKT"],
  },
  {
    title: "Nhật ký hệ thống",
    to: "/audit-logs",
    icon: ClipboardList,
    roles: ["ADMIN"],
  },
];

const configNavItems: NavItem[] = [
  {
    title: "Loại hợp đồng",
    to: "/config/contract-types",
    icon: Settings,
    roles: ["TCCB"],
  },
  {
    title: "Hệ số lương",
    to: "/config/salary-coefficients",
    icon: Settings,
    roles: ["TCCB"],
  },
  {
    title: "Loại phụ cấp",
    to: "/config/allowance-types",
    icon: Settings,
    roles: ["TCCB"],
  },
];

const selfServiceNavItems: NavItem[] = [
  {
    title: "Hồ sơ cá nhân",
    to: "/my/profile",
    icon: User,
  },
  {
    title: "Đơn vị công tác",
    to: "/my/org",
    icon: Building2,
  },
  {
    title: "Đào tạo của tôi",
    to: "/my/training",
    icon: GraduationCap,
    roles: ["EMPLOYEE"],
  },
];

function NavGroup({
  label,
  items,
}: {
  label: string;
  items: NavItem[];
}) {
  const { user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const visibleItems = items.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  if (visibleItems.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={
                  item.to === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(item.to)
                }
              >
                <Link to={item.to}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <h1 className="text-lg font-bold tracking-tight">HRMS</h1>
        <p className="text-xs text-sidebar-foreground/60">
          Trường Đại học Thủy Lợi
        </p>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Chính" items={mainNavItems} />
        <NavGroup label="Cấu hình" items={configNavItems} />
        <NavGroup label="Cá nhân" items={selfServiceNavItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <p className="text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} ĐH Thủy Lợi
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
