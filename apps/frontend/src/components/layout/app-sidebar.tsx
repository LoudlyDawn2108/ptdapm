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
import { commonStrings } from "@/lib/strings";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  CircleUserRound,
  ClipboardList,
  type LucideIcon,
  Settings,
  UsersRound,
} from "lucide-react";
import tluLogo from "../../../assets/tlu-logo.png";
import { sidebarStrings as t } from "./strings";

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
    label: t.groups.accounts,
    items: [
      {
        title: t.items.accountList,
        to: "/accounts",
        icon: CircleUserRound,
      },
    ],
  },
  {
    label: t.groups.personnel,
    items: [
      {
        title: t.items.personnelList,
        to: "/employees",
        icon: UsersRound,
      },
      {
        title: t.items.orgChart,
        to: "/org-units",
        icon: Building2,
      },
    ],
  },
  {
    label: t.groups.orgStructure,
    items: [
      {
        title: t.items.salaryGrades,
        to: "/config/salary-grades",
        icon: Settings,
      },
      {
        title: t.items.allowances,
        to: "/config/allowance-types",
        icon: Settings,
      },
      {
        title: t.items.contracts,
        to: "/config/contract-types",
        icon: ClipboardList,
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
              <SidebarMenuButton size="lg" asChild tooltip={commonStrings.app.name}>
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img src={tluLogo} alt="TLU Logo" className="size-7 object-contain" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{commonStrings.app.name}</span>
                    <span className="truncate text-xs">{commonStrings.app.orgName}</span>
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
