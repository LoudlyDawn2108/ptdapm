import {
  EMPLOYEE_PROFILE_MANAGE_ROLES,
  EMPLOYEE_PROFILE_VIEW_ROLES,
  createEmployeeFamilyMemberSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeFamilyMemberSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as familyMemberService from "./family-member.service";

export const familyMemberRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/family-members",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_VIEW_ROLES);
      const data = await familyMemberService.listByEmployee(
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
      const data = await familyMemberService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeFamilyMemberSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await familyMemberService.update(params.employeeId, params.id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema.merge(idParamSchema),
      body: updateEmployeeFamilyMemberSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await familyMemberService.remove(params.employeeId, params.id);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema.merge(idParamSchema) },
  );
