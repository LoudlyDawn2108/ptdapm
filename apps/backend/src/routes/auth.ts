import { loginSchema } from "@hrms/shared";
import type { SessionInfo } from "@hrms/shared";
import Elysia from "elysia";
import { authPlugin } from "../plugins/auth";
import {
  buildAuthUser,
  forwardCookies,
  getSessionFromHeaders,
  signIn,
  signOut,
  updateLastLogin,
} from "../services/auth.service";
import { requireRole } from "../utils/role-guard";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)
  .post(
    "/login",
    async ({ body }) => {
      const res = await signIn(body.username, body.password);

      if (!res.ok) {
        const parsed = await res.json();
        return new Response(
          JSON.stringify({
            error: parsed.message ?? "Invalid credentials",
          }),
          { status: res.status, headers: { "Content-Type": "application/json" } },
        );
      }

      const cookieHeader = res.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; ");

      const [sessionResult] = await Promise.all([
        getSessionFromHeaders(new Headers({ cookie: cookieHeader })),
        updateLastLogin(body.username),
      ]);

      if (!sessionResult) {
        return new Response(
          JSON.stringify({
            error: "Failed to establish session",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const authUser = await buildAuthUser(sessionResult.user);

      const sessionInfo = { expiresAt: sessionResult.session.expiresAt };

      const responseHeaders = new Headers({ "Content-Type": "application/json" });
      forwardCookies(res, responseHeaders);

      const data: SessionInfo = {
        user: authUser,
        session: sessionInfo,
      };

      return new Response(JSON.stringify({ data }), { status: 200, headers: responseHeaders });
    },
    { body: loginSchema },
  )
  .post(
    "/logout",
    async ({ request }) => {
      const res = await signOut(request.headers);

      const responseHeaders = new Headers({ "Content-Type": "application/json" });
      forwardCookies(res, responseHeaders);

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: responseHeaders,
      });
    },
    { auth: true },
  )
  .get(
    "/session",
    ({ user, session }): { data: SessionInfo } => ({
      data: {
        user,
        session: { expiresAt: session.expiresAt },
      },
    }),
    { auth: true },
  )
  .get(
    "/admin-test",
    ({ user }) => {
      requireRole(user.role, "ADMIN");
      return { message: "Admin access granted" };
    },
    { auth: true },
  );
