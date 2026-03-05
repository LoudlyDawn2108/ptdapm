import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authPlugin } from "./plugins/auth";
import { dbPlugin } from "./plugins/db";
import { indexRoutes } from "./routes";
import { authRoutes } from "./routes/auth";

const app = new Elysia()
  .use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }))
  .use(swagger())
  .use(dbPlugin)
  .use(authPlugin)
  .use(indexRoutes)
  .use(authRoutes)
  .listen(process.env.PORT || 3000);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
