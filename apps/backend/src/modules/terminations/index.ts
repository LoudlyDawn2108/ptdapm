import { createTerminationSchema, employeeIdParamSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as terminationService from "./termination.service";

export const terminationRoutes = new Elysia({
  prefix: "/api/employees/:employeeId",
})
  .use(authPlugin)
  .get(
    "/termination",
    async ({ params }) => {
      const data = await terminationService.getByEmployeeId(params.employeeId);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema },
  )
  .post(
    "/terminate",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await terminationService.terminate(
        params.employeeId,
        body,
        user.id,
      );
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createTerminationSchema },
  );
