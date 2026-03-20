import type { RoleCode } from "./enums";

export const EMPLOYEE_PROFILE_VIEW_ROLES: readonly RoleCode[] = ["TCCB", "TCKT"];

export const EMPLOYEE_PROFILE_MANAGE_ROLES: readonly RoleCode[] = ["TCCB"];

export function canViewEmployeeProfiles(role: RoleCode): boolean {
  return EMPLOYEE_PROFILE_VIEW_ROLES.includes(role);
}

export function canManageEmployeeProfiles(role: RoleCode): boolean {
  return EMPLOYEE_PROFILE_MANAGE_ROLES.includes(role);
}
