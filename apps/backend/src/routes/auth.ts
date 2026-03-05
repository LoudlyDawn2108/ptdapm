import Elysia from "elysia";
import { authPlugin } from "../plugins/auth";

export const authRoutes = new Elysia({ prefix: "/auth" }).use(authPlugin).get(
  "/me",
  ({ user, session }) => ({
    user,
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
    },
  }),
  { auth: true },
);
