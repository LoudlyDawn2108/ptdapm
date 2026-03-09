import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "../../db";
import * as schema from "../../db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      auth_users: schema.authUsers,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  user: {
    modelName: "auth_users",
    additionalFields: {
      roleId: { type: "string", required: true, input: true },
      employeeId: { type: "string", required: false },
      status: { type: "string", defaultValue: "active" },
      lastLoginAt: { type: "date", required: false },
      passwordHash: { type: "string", required: false },
    },
  },
  session: {
    expiresIn: 30 * 60,
    updateAge: 0,
    cookieCache: {
      enabled: false,
    },
  },
  advanced: {
    cookiePrefix: "__session",
    useSecureCookies: false,
    generateId: () => crypto.randomUUID(),
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});
