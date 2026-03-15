import {
  CONTRACT_DOC_STATUS_CODES,
  type ContractDocStatusCode,
  createEmployeeContractSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeContractSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as contractService from "./contract.service";

const contractListQuerySchema = paginationSchema.extend({
  status: z
    .enum(CONTRACT_DOC_STATUS_CODES as [ContractDocStatusCode, ...ContractDocStatusCode[]])
    .optional(),
});

export const contractRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/contracts",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await contractService.listByEmployee(
        params.employeeId,
        query.page,
        query.pageSize,
        query.status,
      );
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, query: contractListQuerySchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const { employeeId, id } = params;
      const data = await contractService.getByIdForEmployee(employeeId, id);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
    },
  )
  .post(
    "/",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await contractService.create(params.employeeId, body, user.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeContractSchema },
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
      body: updateEmployeeContractSchema,
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
