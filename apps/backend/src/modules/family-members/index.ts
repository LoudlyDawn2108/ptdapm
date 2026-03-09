import {
  createEmployeeFamilyMemberSchema,
  employeeIdParamSchema,
  idParamSchema,
  paginationSchema,
  updateEmployeeFamilyMemberSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import * as familyMemberService from "./family-member.service";

export const familyMemberRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/family-members",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
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
    async ({ params, body }) => {
      const data = await familyMemberService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeeFamilyMemberSchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const data = await familyMemberService.update(params.id, body);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateEmployeeFamilyMemberSchema },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const data = await familyMemberService.remove(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  );
