import { createAssignmentSchema, idParamSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as assignmentService from "./assignment.service";

const orgUnitIdParam = z.object({ id: z.uuid() });
const assignmentIdParam = z.object({ id: z.uuid(), assignmentId: z.uuid() });

export const assignmentRoutes = new Elysia({ prefix: "/api/org-units" })
  .use(authPlugin)
  .get(
    "/:id/assignments",
    async ({ params }) => {
      const data = await assignmentService.listByOrgUnit(params.id);
      return { data };
    },
    { auth: true, params: orgUnitIdParam },
  )
  .post(
    "/:id/assignments",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await assignmentService.appoint(params.id, body, user.id);
      return { data };
    },
    { auth: true, params: orgUnitIdParam, body: createAssignmentSchema },
  )
  .delete(
    "/:id/assignments/:assignmentId",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await assignmentService.dismiss(params.id, params.assignmentId, user.id);
      return { data };
    },
    { auth: true, params: assignmentIdParam },
  );
