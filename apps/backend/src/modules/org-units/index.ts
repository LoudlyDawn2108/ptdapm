import {
  createAssignmentSchema,
  createOrgUnitSchema,
  dissolveOrgUnitSchema,
  dropdownQuerySchema,
  idParamSchema,
  mergeOrgUnitSchema,
  updateOrgUnitSchema,
} from "@hrms/shared";
import { Elysia, t } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as assignmentService from "../assignments/assignment.service";
import * as orgUnitService from "./org-unit.service";

export const orgUnitRoutes = new Elysia({ prefix: "/api/org-units" })
  .use(authPlugin)
  .get(
    "/tree",
    async () => {
      const data = await orgUnitService.getTree();
      return { data };
    },
    { auth: true },
  )
  .get(
    "/dropdown",
    async ({ query }) => {
      const data = await orgUnitService.dropdown(query.search, query.limit);
      return { data };
    },
    { auth: true, query: dropdownQuerySchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await orgUnitService.getDetail(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await orgUnitService.create(body, user.id);
      return { data };
    },
    { auth: true, body: createOrgUnitSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await orgUnitService.update(params.id, body);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateOrgUnitSchema },
  )
  .post(
    "/:id/dissolve",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await orgUnitService.dissolve(params.id, body, user.id);
      return { data };
    },
    { auth: true, params: idParamSchema, body: dissolveOrgUnitSchema },
  )
  .post(
    "/:id/merge",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await orgUnitService.merge(params.id, body, user.id);
      return { data };
    },
    { auth: true, params: idParamSchema, body: mergeOrgUnitSchema },
  )
  // ── Assignment management ──────────────────────────────────────────────
  .post(
    "/:id/assignments",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await assignmentService.appoint(params.id, body, user.id);
      return { data };
    },
    {
      auth: true,
      params: idParamSchema,
      body: createAssignmentSchema,
    },
  )
  .post(
    "/:id/assignments/:assignmentId/end",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await assignmentService.dismissAssignment(params.id, params.assignmentId);
      return { data };
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
        assignmentId: t.String(),
      }),
    },
  );
