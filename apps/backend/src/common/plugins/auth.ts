import { Elysia, status } from "elysia";
import {
  buildAuthUser,
  getSessionFromHeaders,
  isUserLocked,
} from "../../modules/auth/auth.service";
import { auth } from "../auth";

export const authPlugin = new Elysia({ name: "better-auth" })
  .all("/api/auth/*", (ctx) => {
    if (["POST", "GET"].includes(ctx.request.method)) {
      return auth.handler(ctx.request);
    }
    return new Response("Method Not Allowed", { status: 405 });
  })
  .macro({
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
