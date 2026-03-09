import {
  createEmployeePreviousJobSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeePreviousJobSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
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
    async ({ params, body }) => {
      const data = await previousJobService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeePreviousJobSchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const data = await previousJobService.update(params.id, body);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateEmployeePreviousJobSchema },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const data = await previousJobService.remove(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  );
