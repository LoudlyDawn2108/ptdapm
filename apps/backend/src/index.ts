import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { env } from "@hrms/env";
import { Elysia } from "elysia";
import { authPlugin } from "./plugins/auth";
import { dbPlugin } from "./plugins/db";
import { errorPlugin } from "./plugins/error-handler";
import { indexRoutes } from "./routes";
import { authRoutes } from "./routes/auth";
import { contractTypeRoutes } from "./routes/config/contract-types";

const app = new Elysia()
  .use(cors({ origin: env.FRONTEND_URL, credentials: true }))
  .use(swagger())
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(indexRoutes)
  .use(authRoutes)
  .use(contractTypeRoutes)
  .listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
