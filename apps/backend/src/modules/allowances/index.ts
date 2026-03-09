import {
  createEmployeeAllowanceSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeAllowanceSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import * as allowanceService from "./allowance.service";

export const allowanceRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/allowances",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await allowanceService.listByEmployee(
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
      const data = await allowanceService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeAllowanceSchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const { employeeId, id } = params;
      const data = await allowanceService.update(id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.and(idParamSchema),
      body: updateEmployeeAllowanceSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const { employeeId, id } = params;
      const data = await allowanceService.remove(id);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.and(idParamSchema),
    },
  );
