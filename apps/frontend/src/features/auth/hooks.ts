import type { RoleCode } from "@hrms/shared";
import { useRouteContext } from "@tanstack/react-router";

/**
 * Convenient hook for accessing the authenticated user from route context.
 * Must be called inside the `/_authenticated` subtree.
 */
export function useAuth() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  return {
    user,
    isAdmin: user?.role === "ADMIN",
    isTCCB: user?.role === "TCCB",
    isTCKT: user?.role === "TCKT",
    isEmployee: user?.role === "EMPLOYEE",
    hasRole: (...roles: RoleCode[]) => (user ? roles.includes(user.role) : false),
  };
}
