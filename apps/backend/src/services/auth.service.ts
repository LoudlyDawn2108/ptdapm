import type { AuthUser } from "@hrms/shared";
import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { authRoles, authUsers, session as sessionTable } from "../db/schema/auth";

export async function buildAuthUser(user: {
  id: string;
  username?: string | null;
  name: string;
  email: string;
  roleId: string;
  status?: string | null;
  employeeId?: string | null;
}): Promise<AuthUser> {
  const roleRow = await db
    .select({ roleCode: authRoles.roleCode })
    .from(authRoles)
    .where(eq(authRoles.id, user.roleId))
    .limit(1);

  return {
    id: user.id,
    username: user.username ?? "",
    fullName: user.name,
    email: user.email,
    role: (roleRow[0]?.roleCode ?? "EMPLOYEE") as AuthUser["role"],
    status: user.status ?? "active",
    employeeId: user.employeeId ?? null,
  };
}

export async function getSessionFromHeaders(headers: Headers) {
  return auth.api.getSession({ headers });
}

export async function isUserLocked(
  userId: string,
  status: string | undefined | null,
): Promise<boolean> {
  if (status === "locked") {
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
    return true;
  }
  return false;
}

export async function signIn(username: string, password: string) {
  return auth.api.signInUsername({
    body: { username, password },
    asResponse: true,
  });
}

export async function signOut(headers: Headers) {
  return auth.api.signOut({
    headers,
    asResponse: true,
  });
}

export async function updateLastLogin(username: string) {
  await db
    .update(authUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(authUsers.username, username));
}

export function forwardCookies(from: Response, to: Headers) {
  for (const cookie of from.headers.getSetCookie()) {
    to.append("Set-Cookie", cookie);
  }
}
