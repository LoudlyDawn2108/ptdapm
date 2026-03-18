import {
  EMPLOYEE_PROFILE_MANAGE_ROLES,
  EMPLOYEE_PROFILE_VIEW_ROLES,
  createEmployeeBankAccountSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeBankAccountSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as bankAccountService from "./bank-account.service";

export const bankAccountRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/bank-accounts",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_VIEW_ROLES);
      const data = await bankAccountService.listByEmployee(
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
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await bankAccountService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeBankAccountSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await bankAccountService.update(params.employeeId, params.id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
      body: updateEmployeeBankAccountSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await bankAccountService.remove(params.employeeId, params.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema.merge(idParamSchema) },
  );
