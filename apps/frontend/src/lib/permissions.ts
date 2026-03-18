import {
  EMPLOYEE_PROFILE_MANAGE_ROLES,
  EMPLOYEE_PROFILE_VIEW_ROLES,
  type RoleCode,
} from "@hrms/shared";
import { redirect } from "@tanstack/react-router";

// HOW TO ADD A NEW PROTECTED ROUTE:
//   1. Add the route path + allowed roles to ROUTE_PERMISSIONS below
//   2. In your route file, add: beforeLoad: authorizeRoute("/your-route")
//   3. The sidebar reads from this map automatically — no duplicate config
//
// Routes NOT listed here are accessible to ALL authenticated users.

export const ROUTE_PERMISSIONS: Record<string, RoleCode[]> = {
  // --- Tài khoản ---
  "/accounts": ["ADMIN"],

  // --- Hồ sơ nhân sự ---
  "/employees": [...EMPLOYEE_PROFILE_VIEW_ROLES],
  "/employees/new": [...EMPLOYEE_PROFILE_MANAGE_ROLES],
  "/org-units": ["ADMIN", "TCCB"],

  // --- Cơ cấu tổ chức (config) ---
  "/config/salary-grades": ["ADMIN", "TCCB"],
  "/config/allowance-types": ["ADMIN", "TCCB"],
  "/config/contract-types": ["ADMIN", "TCCB"],

  // --- Đào tạo ---
  "/training": ["ADMIN", "TCCB"],
  "/my/training": ["EMPLOYEE"],
};

export function canAccessRoute(role: RoleCode, path: string): boolean {
  if (ROUTE_PERMISSIONS[path]) {
    return ROUTE_PERMISSIONS[path].includes(role);
  }

  for (const [routePath, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path.startsWith(`${routePath}/`)) {
      return roles.includes(role);
    }
  }

  return true;
}

export function getRouteRoles(path: string): RoleCode[] | undefined {
  return ROUTE_PERMISSIONS[path];
}

/**
 * beforeLoad guard for TanStack Router routes.
 *
 * Usage:
 * ```ts
 * export const Route = createFileRoute("/_authenticated/accounts/")({
 *   beforeLoad: authorizeRoute("/accounts"),
 *   component: AccountsPage,
 * });
 * ```
 */
export function authorizeRoute(routePath: string) {
  const allowedRoles = ROUTE_PERMISSIONS[routePath];
  return authorizeRoles(...(allowedRoles ?? []));
}

export function authorizeRoles(...allowedRoles: readonly RoleCode[]) {
  return ({ context }: { context: { user: { role: RoleCode } } }) => {
    if (allowedRoles.length === 0) return;

    if (!allowedRoles.includes(context.user.role)) {
      throw redirect({ to: "/forbidden" });
    }
  };
}
