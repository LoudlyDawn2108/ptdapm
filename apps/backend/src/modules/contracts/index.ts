import {
  createEmploymentContractSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmploymentContractSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as contractService from "./contract.service";

export const contractRoutes = new Elysia({ prefix: "/api/employees/:employeeId/contracts" })
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await contractService.listByEmployee(
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
      const data = await contractService.create(params.employeeId, body, user.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmploymentContractSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, id } = params;
      const data = await contractService.update(employeeId, id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
      body: updateEmploymentContractSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, id } = params;
      const data = await contractService.remove(employeeId, id);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
    },
  );
