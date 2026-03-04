export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  role: string;
  status: string;
}

export interface SessionInfo {
  user: AuthUser;
  session: {
    id: string;
    expiresAt: Date;
  };
}
