import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { env } from "@hrms/env";
import { Elysia } from "elysia";
import z from "zod";
import { authPlugin, betterAuthHandler } from "./common/plugins/auth";
import { dbPlugin } from "./common/plugins/db";
import { errorPlugin } from "./common/plugins/error-handler";
import { globalRateLimit, loginRateLimit } from "./common/plugins/rate-limit";
import { accountRoutes } from "./modules/accounts";
import { authRoutes } from "./modules/auth";
import { contractTypeRoutes } from "./modules/config/contract-types";
import { evaluationRoutes } from "./modules/evaluations";
import { terminationRoutes } from "./modules/terminations";
import { trainingCourseRoutes } from "./modules/training-courses";
import { trainingRegistrationRoutes } from "./modules/training-registrations";
import { trainingResultRoutes } from "./modules/training-results";
import { myTrainingRoutes } from "./modules/my/training";

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
  .use(contractTypeRoutes)
  .use(accountRoutes)
  .use(terminationRoutes)
  .use(evaluationRoutes)
  .use(trainingCourseRoutes)
  .use(trainingRegistrationRoutes)
  .use(trainingResultRoutes)
  .use(myTrainingRoutes)
  .listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
