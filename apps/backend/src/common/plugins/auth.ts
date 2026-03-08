import { Elysia, status } from "elysia";
import {
  buildAuthUser,
  getSessionFromHeaders,
  isUserLocked,
} from "../../modules/auth/auth.service";
import { auth } from "../auth";

// --- Better-auth catch-all handler — register ONCE at app level (src/index.ts)
export const betterAuthHandler = new Elysia({ name: "better-auth-handler" }).all(
  "/api/auth/*",
  (ctx) => {
    if (["POST", "GET"].includes(ctx.request.method)) {
      return auth.handler(ctx.request);
    }
    return new Response("Method Not Allowed", { status: 405 });
  },
);

// --- Auth macro — safe to .use() in every module (no routes, only macro)
export const authPlugin = new Elysia({ name: "auth-macro" }).macro({
  auth: {
    async resolve({ request: { headers } }) {
      const result = await getSessionFromHeaders(headers);

      if (!result) return status(401, "Unauthorized");

      const { user, session } = result;

      if (await isUserLocked(user.id, user.status)) {
        return status(403, "Account is locked");
      }

      return { user: await buildAuthUser(user), session };
    },
  },
});
