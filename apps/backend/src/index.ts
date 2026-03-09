import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { env } from "@hrms/env";
import { Elysia } from "elysia";
import z from "zod";
import { authPlugin, betterAuthHandler } from "./common/plugins/auth";
import { dbPlugin } from "./common/plugins/db";
import { errorPlugin } from "./common/plugins/error-handler";
import { globalRateLimit, loginRateLimit } from "./common/plugins/rate-limit";
import { allowanceRoutes } from "./modules/allowances";
import { authRoutes } from "./modules/auth";
import { bankAccountRoutes } from "./modules/bank-accounts";
import { contractTypeRoutes } from "./modules/config/contract-types";
import { employeeRoutes } from "./modules/employees";
import { employeeExportRoutes } from "./modules/employees-export";
import { familyMemberRoutes } from "./modules/family-members";
import { partyMembershipRoutes } from "./modules/party-memberships";
import { previousJobRoutes } from "./modules/previous-jobs";

const app = new Elysia()
  .use(cors({ origin: env.FRONTEND_URL, credentials: true }))
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      exclude: { paths: ["/api/auth/*"] }, // Better-auth handles its own docs
    }),
  )
  .use(errorPlugin)
  .use(globalRateLimit)
  .use(loginRateLimit)
  .use(dbPlugin)
  .use(betterAuthHandler)
  .use(authPlugin)
  .get("/", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .use(authRoutes)
  .use(allowanceRoutes)
  .use(familyMemberRoutes)
  .use(bankAccountRoutes)
  .use(contractTypeRoutes)
  .use(employeeExportRoutes)
  .use(employeeRoutes)
  .use(previousJobRoutes)
  .use(partyMembershipRoutes)
  .listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
