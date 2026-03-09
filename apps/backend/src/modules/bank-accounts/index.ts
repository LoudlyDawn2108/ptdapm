import {
  createEmployeeBankAccountSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeBankAccountSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import * as bankAccountService from "./bank-account.service";

export const bankAccountRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/bank-accounts",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
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
    async ({ params, body }) => {
      const data = await bankAccountService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeBankAccountSchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const data = await bankAccountService.update(params.id, {
        ...body,
        employeeId: params.employeeId,
      });
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
    async ({ params }) => {
      const data = await bankAccountService.remove(params.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema.merge(idParamSchema) },
  );
