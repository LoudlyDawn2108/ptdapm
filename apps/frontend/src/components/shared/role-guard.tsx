import { useRouteContext } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface RoleGuardProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditional render by role.
 * Reads user from the _authenticated route context.
 */
export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useRouteContext({ from: "/_authenticated" });
  if (!roles.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}
