import {
  createEmployeeSchema,
  paginationSchema,
  updateEmployeeSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as employeeService from "./employee.service";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  orgUnitId: z.string().optional(),
  workStatus: z.string().optional(),
  contractStatus: z.string().optional(),
});

export const employeeRoutes = new Elysia({ prefix: "/api/employees" })
  .use(authPlugin)
  .get(
    "/me",
    async ({ user }) => {
      const data = await employeeService.getByEmail(user.email ?? "");
      return { data };
    },
    { auth: true },
  )
  .get(
    "/",
    async ({ query }) => {
      const data = await employeeService.list(
        query.page,
        query.pageSize,
        query.search,
        query.orgUnitId,
        query.workStatus as Parameters<typeof employeeService.list>[4],
        query.contractStatus as Parameters<typeof employeeService.list>[5],
      );
      return { data };
    },
    { auth: true, query: listQuerySchema },
  )
  .get(
    "/:employeeId",
    async ({ params }) => {
      const data = await employeeService.getAggregateById(params.employeeId);
      return { data };
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }) },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await employeeService.create(body);
      return { data };
    },
    { auth: true, body: createEmployeeSchema },
  )
  .put(
    "/:employeeId",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await employeeService.update(params.employeeId, body);
      return { data };
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }), body: updateEmployeeSchema },
  )
  .delete(
    "/:employeeId",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await employeeService.remove(params.employeeId);
      return { data };
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }) },
  );
