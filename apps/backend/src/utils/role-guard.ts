import type { RoleCode } from "@hrms/shared";
import { error } from "elysia";

/**
 * @example
 * ```ts
 * .get("/admin-only", ({ user }) => {
 *   const denied = requireRole(user.role, "ADMIN");
 *   if (denied) return denied;
 *   return { message: "ok" };
 * }, { auth: true })
 * ```
 */
export function requireRole(userRole: RoleCode, ...allowedRoles: RoleCode[]) {
  if (!allowedRoles.includes(userRole)) {
    return error(403, "Forbidden: insufficient role");
  }
}
