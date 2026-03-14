import type { RoleCode } from "@hrms/shared";

export function isAdmin(role: RoleCode): boolean {
  return role === "ADMIN";
}

export function isTCCB(role: RoleCode): boolean {
  return role === "TCCB";
}

export function isTCKT(role: RoleCode): boolean {
  return role === "TCKT";
}

export function isEmployee(role: RoleCode): boolean {
  return role === "EMPLOYEE";
}

export function hasRole(role: RoleCode, ...roles: RoleCode[]): boolean {
  return roles.includes(role);
}

/**
 * Check if a role has write access (can create/edit/delete HR data).
 * Only ADMIN and TCCB have write access.
 */
export function hasWriteAccess(role: RoleCode): boolean {
  return role === "ADMIN" || role === "TCCB";
}
