import { createTerminationSchema, employeeIdParamSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as terminationsService from "./terminations.service";

export const terminationRoutes = new Elysia({ prefix: "/api/employees" })
  .use(authPlugin)
  .post(
    "/:employeeId/terminate",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await terminationsService.terminate(
        params.employeeId,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema,
      body: createTerminationSchema,
    },
  )
  .get(
    "/:employeeId/termination",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await terminationsService.getByEmployeeId(params.employeeId);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema },
  );
