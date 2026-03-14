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
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  ChartColumn,
  CircleUserRound,
  ClipboardList,
  GraduationCap,
  type LucideIcon,
  Settings,
  User,
  UsersRound,
} from "lucide-react";
import tluLogo from "../../../assets/tlu-logo.png";

interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  roles?: string[];
}

interface NavGroupConfig {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroupConfig[] = [
  {
    label: "Tài khoản",
    items: [
      {
        title: "Danh sách tài khoản",
        to: "/accounts",
        icon: CircleUserRound,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    label: "Hồ sơ nhân sự",
    items: [
      {
        title: "Danh sách hồ sơ",
        to: "/employees",
        icon: UsersRound,
        roles: ["TCCB", "TCKT"],
      },
      {
        title: "Sơ đồ tổ chức",
        to: "/org-units",
        icon: Building2,
        roles: ["ADMIN", "TCCB"],
      },
      {
        title: "Thống kê",
        to: "/reports",
        icon: ChartColumn,
        roles: ["TCCB", "TCKT"],
      },
    ],
  },
  {
    label: "Cơ cấu tổ chức",
    items: [
      {
        title: "Hệ số lương",
        to: "/config/salary-coefficients",
        icon: Settings,
        roles: ["TCCB"],
      },
      {
        title: "Phụ cấp",
        to: "/config/allowance-types",
        icon: Settings,
        roles: ["TCCB"],
      },
      {
        title: "Hợp đồng",
        to: "/config/contract-types",
        icon: ClipboardList,
        roles: ["TCCB"],
      },
    ],
  },
  {
    label: "Đào tạo",
    items: [
      {
        title: "Đào tạo",
        to: "/training",
        icon: GraduationCap,
        roles: ["TCCB"],
      },
    ],
  },
  {
    label: "Cá nhân",
    items: [
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
    ],
  },
];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
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
                isActive={item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to)}
              >
                <Link to={item.to}>
                  <item.icon />
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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src={tluLogo} alt="TLU Logo" className="size-7 object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Quản lý nhân sự</span>
                  <span className="truncate text-xs">Trường Đại học Thủy Lợi</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
