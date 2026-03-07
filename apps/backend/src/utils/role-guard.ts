import type { RoleCode } from "@hrms/shared";
import { ForbiddenError } from "./errors";

export function requireRole(userRole: RoleCode, ...allowedRoles: RoleCode[]) {
  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenError();
  }
}
