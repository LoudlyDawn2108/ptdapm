import type { RoleCode } from "../constants/enums";

export interface LoginRequest {
  username: string;
  password: string;
}

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
    id: string;
    expiresAt: Date;
  };
}
