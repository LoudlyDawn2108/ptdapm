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
import { certificationRoutes } from "./modules/certifications";
import { allowanceTypeRoutes } from "./modules/config/allowance-types";
import { contractTypeRoutes } from "./modules/config/contract-types";
import { salaryGradeRoutes } from "./modules/config/salary-grades";
import { contractAppendixRoutes, contractRoutes } from "./modules/contracts";
import { dashboardRoutes } from "./modules/dashboard";
import { degreeRoutes } from "./modules/degrees";
import { employeeRoutes } from "./modules/employees";
import { employeeExportRoutes } from "./modules/employees-export";
import { familyMemberRoutes } from "./modules/family-members";
import { fileRoutes } from "./modules/files";
import { foreignWorkPermitRoutes } from "./modules/foreign-work-permits";
import { orgUnitRoutes } from "./modules/org-units";
import { partyMembershipRoutes } from "./modules/party-memberships";
import { previousJobRoutes } from "./modules/previous-jobs";
import { terminationRoutes } from "./modules/terminations";
import { trainingCourseRoutes } from "./modules/training-courses";
import { trainingRegistrationRoutes } from "./modules/training-registrations";
import { trainingResultRoutes } from "./modules/training-results";
import { myTrainingRoutes } from "./modules/training";
import { evaluationRoutes } from "./modules/evaluations";

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
  .use(fileRoutes)
  .use(familyMemberRoutes)
  .use(bankAccountRoutes)
  .use(contractRoutes)
  .use(contractTypeRoutes)
  .use(salaryGradeRoutes)
  .use(allowanceTypeRoutes)
  .use(orgUnitRoutes)
  .use(assignmentRoutes)
  .use(dashboardRoutes)
  .use(previousJobRoutes)
  .use(partyMembershipRoutes)
  .use(degreeRoutes)
  .use(certificationRoutes)
  .use(foreignWorkPermitRoutes)
  .use(accountRoutes)
  .use(contractAppendixRoutes)
  .use(terminationRoutes)
  .use(evaluationRoutes)
  .use(trainingCourseRoutes)
  .use(trainingRegistrationRoutes)
  .use(trainingResultRoutes)
  .use(myTrainingRoutes)
  .listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
