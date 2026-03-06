import type { AuthUser } from "@hrms/shared";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { authRoles, authUsers } from "../db/schema/auth";
import { authPlugin } from "../plugins/auth";
import { requireRole } from "../utils/role-guard";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)
  .post(
    "/login",
    async ({ body }) => {
      const { username, password } = body;

      const res = await auth.api.signInUsername({
        body: { username, password },
        asResponse: true,
      });

      if (!res.ok) {
        const parsed = await res.json();
        return new Response(
          JSON.stringify({
            success: false,
            error: parsed.message ?? "Invalid credentials",
          }),
          {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const parsed = await res.json();
      const betterAuthUser = parsed.user;

      await db
        .update(authUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(authUsers.username, username));

      const roleRow = await db
        .select({ roleCode: authRoles.roleCode })
        .from(authRoles)
        .where(eq(authRoles.id, betterAuthUser.roleId))
        .limit(1);

      const roleCode = roleRow[0]?.roleCode ?? "EMPLOYEE";

      const authUser: AuthUser = {
        id: betterAuthUser.id,
        username: betterAuthUser.username ?? "",
        fullName: betterAuthUser.name,
        email: betterAuthUser.email,
        role: roleCode as AuthUser["role"],
        status: betterAuthUser.status ?? "active",
        employeeId: betterAuthUser.employeeId ?? null,
      };

      const cookieHeader = res.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; ");

      const sessionResult = await auth.api.getSession({
        headers: new Headers({ cookie: cookieHeader }),
      });

      const sessionInfo = sessionResult
        ? { id: sessionResult.session.id, expiresAt: sessionResult.session.expiresAt }
        : { id: parsed.token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) };

      const responseHeaders = new Headers({ "Content-Type": "application/json" });
      for (const cookie of res.headers.getSetCookie()) {
        responseHeaders.append("Set-Cookie", cookie);
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: { user: authUser, session: sessionInfo },
        }),
        { status: 200, headers: responseHeaders },
      );
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  )
  .post(
    "/logout",
    async ({ request }) => {
      const res = await auth.api.signOut({
        headers: request.headers,
        asResponse: true,
      });

      const responseHeaders = new Headers({ "Content-Type": "application/json" });
      for (const cookie of res.headers.getSetCookie()) {
        responseHeaders.append("Set-Cookie", cookie);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: responseHeaders,
      });
    },
    { auth: true },
  )
  .get(
    "/session",
    ({ user, session }) => ({
      user,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    }),
    { auth: true },
  )
  .get(
    "/admin-test",
    ({ user }) => {
      const denied = requireRole(user.role, "ADMIN");
      if (denied) return denied;
      return { message: "Admin access granted" };
    },
    { auth: true },
  );
