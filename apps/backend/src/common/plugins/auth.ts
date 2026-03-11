import { Elysia, status } from "elysia";
import {
  buildAuthUser,
  getSessionFromHeaders,
  isUserLocked,
} from "../../modules/auth/auth.service";

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
