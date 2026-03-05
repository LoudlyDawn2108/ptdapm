import type { AuthUser } from "@hrms/shared";
import { eq } from "drizzle-orm";
import { Elysia, error } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { authRoles, session as sessionTable } from "../db/schema/auth";

export const authPlugin = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: {
    async resolve({ request: { headers } }) {
      const result = await auth.api.getSession({ headers });

      if (!result) return error(401, "Unauthorized");

      const { user, session } = result;

      if (user.status === "locked") {
        await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));
        return error(403, "Account is locked");
      }

      const roleRow = await db
        .select({ roleCode: authRoles.roleCode })
        .from(authRoles)
        .where(eq(authRoles.id, user.roleId))
        .limit(1);

      const roleCode = roleRow[0]?.roleCode ?? "EMPLOYEE";

      const authUser: AuthUser = {
        id: user.id,
        username: user.username ?? "",
        fullName: user.name,
        email: user.email,
        role: roleCode as AuthUser["role"],
        status: user.status ?? "active",
        employeeId: user.employeeId ?? null,
      };

      return { user: authUser, session };
    },
  },
});
