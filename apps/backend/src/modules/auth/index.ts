import { changePasswordSchema, loginSchema } from "@hrms/shared";
import type { SessionInfo } from "@hrms/shared";
import Elysia from "elysia";
import { auth } from "../../common/auth";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import {
  buildAuthUser,
  forwardCookies,
  getSessionFromHeaders,
  isUserLocked,
  signIn,
  signOut,
  updateLastLogin,
} from "./auth.service";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)
  .post(
    "/login",
    async ({ body }) => {
      const username = body.username.trim();
      const res = await signIn(username, body.password);

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
        updateLastLogin(username),
      ]);

      if (!sessionResult) {
        return new Response(
          JSON.stringify({
            error: "Failed to establish session",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      // Reject locked accounts — mirrors authPlugin behavior
      if (await isUserLocked(sessionResult.user.id, sessionResult.user.status)) {
        return new Response(
          JSON.stringify({
            error: "Tài khoản đã bị khóa",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
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
  )
  .post(
    "/change-password",
    async ({ body, request }) => {
      try {
        await auth.api.changePassword({
          body: {
            currentPassword: body.currentPassword,
            newPassword: body.newPassword,
            revokeOtherSessions: false,
          },
          headers: request.headers,
        });
        return { message: "Đổi mật khẩu thành công" };
      } catch (error) {
        const message =
          error instanceof Error && error.message === "Invalid password"
            ? "Mật khẩu hiện tại không đúng"
            : "Không thể đổi mật khẩu";
        return new Response(JSON.stringify({ error: message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    {
      auth: true,
      body: changePasswordSchema,
    },
  );
