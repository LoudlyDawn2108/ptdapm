import { createAssignmentSchema, idParamSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as assignmentService from "./assignment.service";

const orgUnitIdParam = z.object({ orgUnitId: z.uuid() });
const assignmentIdParam = z.object({ orgUnitId: z.uuid(), id: z.uuid() });

export const assignmentRoutes = new Elysia({ prefix: "/api/org-units" })
  .use(authPlugin)
  .get(
    "/:orgUnitId/assignments",
    async ({ params }) => {
      const data = await assignmentService.listByOrgUnit(params.orgUnitId);
      return { data };
    },
    { auth: true, params: orgUnitIdParam },
  )
  .post(
    "/:orgUnitId/assignments",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await assignmentService.appoint(params.orgUnitId, body, user.id);
      return { data };
    },
    { auth: true, params: orgUnitIdParam, body: createAssignmentSchema },
  )
  .delete(
    "/:orgUnitId/assignments/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await assignmentService.dismiss(params.orgUnitId, params.id, user.id);
      return { data };
    },
    { auth: true, params: assignmentIdParam },
  );
