import {
  createEmployeePreviousJobSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeePreviousJobSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as previousJobService from "./previous-job.service";

export const previousJobRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/previous-jobs",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await previousJobService.listByEmployee(
        params.employeeId,
        query.page,
        query.pageSize,
      );
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, query: paginationSchema },
  )
  .post(
    "/",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await previousJobService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeePreviousJobSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await previousJobService.update(params.employeeId, params.id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.and(idParamSchema),
      body: updateEmployeePreviousJobSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await previousJobService.remove(params.employeeId, params.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema.and(idParamSchema) },
  );
