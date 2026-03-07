import type { RoleCode } from "../constants/enums";

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  role: RoleCode;
  status: string;
  employeeId: string | null;
}

export interface SessionInfo {
  user: AuthUser;
  session: {
    expiresAt: Date;
  };
}
