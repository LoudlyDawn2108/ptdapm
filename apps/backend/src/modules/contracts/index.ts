import {
  CONTRACT_DOC_STATUS_CODES,
  type ContractDocStatusCode,
  contractIdParamSchema,
  createContractAppendixSchema,
  createEmployeeContractSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateContractAppendixSchema,
  updateEmployeeContractSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as appendixService from "./contract-appendix.service";
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
    "/:contractId",
    async ({ params }) => {
      const { employeeId, contractId } = params;
      const data = await contractService.getByIdForEmployee(employeeId, contractId);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(contractIdParamSchema),
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
    "/:contractId",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, contractId } = params;
      const data = await contractService.update(employeeId, contractId, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(contractIdParamSchema),
      body: updateEmployeeContractSchema,
    },
  )
  .delete(
    "/:contractId",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, contractId } = params;
      const data = await contractService.remove(employeeId, contractId);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(contractIdParamSchema),
    },
  );

const appendixParamsSchema = employeeIdParamSchema.merge(contractIdParamSchema);
const appendixItemParamsSchema = appendixParamsSchema.merge(idParamSchema);

export const contractAppendixRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/contracts/:contractId/appendices",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await appendixService.listByContract(
        params.employeeId,
        params.contractId,
        query.page,
        query.pageSize,
      );
      return { data };
    },
    { auth: true, params: appendixParamsSchema, query: paginationSchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const { employeeId, contractId, id } = params;
      const data = await appendixService.getById(employeeId, contractId, id);
      return { data };
    },
    {
      auth: true,
      params: appendixItemParamsSchema,
    },
  )
  .post(
    "/",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await appendixService.create(
        params.employeeId,
        params.contractId,
        body,
        user.id,
      );
      return { data };
    },
    { auth: true, params: appendixParamsSchema, body: createContractAppendixSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, contractId, id } = params;
      const data = await appendixService.update(employeeId, contractId, id, body);
      return { data };
    },
    {
      auth: true,
      params: appendixItemParamsSchema,
      body: updateContractAppendixSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const { employeeId, contractId, id } = params;
      const data = await appendixService.remove(employeeId, contractId, id);
      return { data };
    },
    {
      auth: true,
      params: appendixItemParamsSchema,
    },
  );
