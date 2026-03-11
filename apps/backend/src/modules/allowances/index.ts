import {
  createEmployeeAllowanceSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeAllowanceSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
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
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await allowanceService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeAllowanceSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, id } = params;
      const data = await allowanceService.update(employeeId, id, body);
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
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, id } = params;
      const data = await allowanceService.remove(employeeId, id);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.and(idParamSchema),
    },
  );
