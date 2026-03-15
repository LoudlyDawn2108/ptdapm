import {
  createEmployeeCertificationSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeCertificationSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as certificationService from "./certification.service";

export const certificationRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/certifications",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await certificationService.listByEmployee(
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
      const data = await certificationService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeCertificationSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await certificationService.update(params.employeeId, params.id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
      body: updateEmployeeCertificationSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await certificationService.remove(params.employeeId, params.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema.merge(idParamSchema) },
  );
