import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  user: {
    modelName: "auth_users",
    fields: {
      name: "full_name",
    },
    additionalFields: {
      roleId: { type: "string", fieldName: "role_id", required: true },
      employeeId: { type: "string", fieldName: "employee_id" },
      status: { type: "string", defaultValue: "active" },
      lastLoginAt: { type: "date", fieldName: "last_login_at" },
      passwordHash: { type: "string", fieldName: "password_hash" },
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
  },
});
