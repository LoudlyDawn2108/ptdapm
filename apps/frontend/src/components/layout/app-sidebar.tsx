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
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/hooks";
import { canAccessRoute } from "@/lib/permissions";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  CircleUserRound,
  ClipboardList,
  GraduationCap,
  type LucideIcon,
  Settings,
  UsersRound,
} from "lucide-react";
import tluLogo from "../../../assets/tlu-logo.png";

interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
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
      },
      {
        title: "Sơ đồ tổ chức",
        to: "/org-units",
        icon: Building2,
      },
    ],
  },
  {
    label: "Cơ cấu tổ chức",
    items: [
      {
        title: "Hệ số lương",
        to: "/config/salary-grades",
        icon: Settings,
      },
      {
        title: "Phụ cấp",
        to: "/config/allowance-types",
        icon: Settings,
      },
      {
        title: "Hợp đồng",
        to: "/config/contract-types",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Đào tạo",
    items: [
      {
        title: "Khóa đào tạo",
        to: "/training",
        icon: GraduationCap,
      },
    ],
  },
  {
    label: "Cá nhân",
    items: [
      {
        title: "Đào tạo của tôi",
        to: "/my/training",
        icon: BookOpen,
      },
    ],
  },
];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const { user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const visibleItems = items.filter((item) => user && canAccessRoute(user.role, item.to));

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
                tooltip={item.title}
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
    <TooltipProvider delayDuration={0}>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip="Quản lý nhân sự">
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
    </TooltipProvider>
  );
}
