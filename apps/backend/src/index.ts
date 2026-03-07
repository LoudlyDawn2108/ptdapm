import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { env } from "@hrms/env";
import { Elysia } from "elysia";
import { authPlugin } from "./common/plugins/auth";
import { dbPlugin } from "./common/plugins/db";
import { errorPlugin } from "./common/plugins/error-handler";
import { authRoutes } from "./modules/auth";
import { contractTypeRoutes } from "./modules/config/contract-types";

const app = new Elysia()
  .use(cors({ origin: env.FRONTEND_URL, credentials: true }))
  .use(swagger())
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .get("/", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .use(authRoutes)
  .use(contractTypeRoutes)
  .listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
