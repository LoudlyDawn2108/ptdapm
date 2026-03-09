import {
  createEmployeePartyMembershipSchema,
  employeeIdParamSchema,
  employeeSubResourceParamSchema,
  paginationSchema,
  updateEmployeePartyMembershipSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import * as partyMembershipService from "./party-membership.service";

export const partyMembershipRoutes = new Elysia({
  prefix: "/api/employees/:employeeId/party-memberships",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ params, query }) => {
      const data = await partyMembershipService.listByEmployee(
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
      const data = await partyMembershipService.create(params.employeeId, body);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema, body: createEmployeePartyMembershipSchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const data = await partyMembershipService.update(params.employeeId, params.id, body);
      return { data };
    },
    {
      auth: true,
      params: employeeSubResourceParamSchema,
      body: updateEmployeePartyMembershipSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const data = await partyMembershipService.remove(params.employeeId, params.id);
      return { data };
    },
    { auth: true, params: employeeSubResourceParamSchema },
  );
