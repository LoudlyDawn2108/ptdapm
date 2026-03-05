import Elysia from "elysia";
import { authPlugin } from "../plugins/auth";
import { requireRole } from "../utils/role-guard";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)
  .get(
    "/me",
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
