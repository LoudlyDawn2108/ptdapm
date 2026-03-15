import {
  createForeignWorkPermitSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateForeignWorkPermitSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as foreignWorkPermitService from "./foreign-work-permit.service";

export const foreignWorkPermitRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/foreign-work-permits",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await foreignWorkPermitService.listByEmployee(
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
      const data = await foreignWorkPermitService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createForeignWorkPermitSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await foreignWorkPermitService.update(params.employeeId, params.id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
      body: updateForeignWorkPermitSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await foreignWorkPermitService.remove(params.employeeId, params.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema.merge(idParamSchema) },
  );
