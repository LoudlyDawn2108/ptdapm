import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { env } from "@hrms/env";
import { Elysia } from "elysia";
import z from "zod";
import { authPlugin } from "./common/plugins/auth";
import { dbPlugin } from "./common/plugins/db";
import { errorPlugin } from "./common/plugins/error-handler";
import { globalRateLimit, loginRateLimit } from "./common/plugins/rate-limit";
import { accountRoutes } from "./modules/accounts";
import { allowanceRoutes } from "./modules/allowances";
import { assignmentRoutes } from "./modules/assignments";
import { authRoutes } from "./modules/auth";
import { bankAccountRoutes } from "./modules/bank-accounts";
import { allowanceTypeRoutes } from "./modules/config/allowance-types";
import { contractTypeRoutes } from "./modules/config/contract-types";
import { salaryGradeRoutes } from "./modules/config/salary-grades";
import { dashboardRoutes } from "./modules/dashboard";
import { employeeRoutes } from "./modules/employees";
import { employeeExportRoutes } from "./modules/employees-export";
import { familyMemberRoutes } from "./modules/family-members";
import { orgUnitRoutes } from "./modules/org-units";
import { partyMembershipRoutes } from "./modules/party-memberships";
import { previousJobRoutes } from "./modules/previous-jobs";
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
        zod: (schema: z.ZodType) =>
          z.toJSONSchema(schema, {
            unrepresentable: "any",
            io: "input",
          }) as Record<string, unknown>,
      },
    }),
  )
  .use(errorPlugin)
  .use(globalRateLimit)
  .use(loginRateLimit)
  .use(dbPlugin)
  .use(authPlugin)
  .get("/", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .use(authRoutes)
  .use(allowanceRoutes)
  .use(employeeExportRoutes)
  .use(employeeRoutes)
  .use(familyMemberRoutes)
  .use(bankAccountRoutes)
  .use(allowanceRoutes)
  .use(employeeExportRoutes)
  .use(employeeRoutes)
  .use(familyMemberRoutes)
  .use(bankAccountRoutes)
  .use(contractTypeRoutes)
  .use(salaryGradeRoutes)
  .use(allowanceTypeRoutes)
  .use(orgUnitRoutes)
  .use(assignmentRoutes)
  .use(dashboardRoutes)
  .use(previousJobRoutes)
  .use(partyMembershipRoutes)
  .use(previousJobRoutes)
  .use(partyMembershipRoutes)
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
