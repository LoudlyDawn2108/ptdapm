import {
  createEvaluationSchema,
  employeeIdParamSchema,
  listEvaluationsQuerySchema,
  updateEvaluationSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as evaluationsService from "./evaluations.service";

const evaluationParamsSchema = z.object({
  employeeId: z.string().uuid(),
  id: z.string().uuid(),
});

export const evaluationRoutes = new Elysia({ prefix: "/api/employees" })
  .use(authPlugin)
  .get(
    "/:employeeId/evaluations",
    async ({ params, query, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await evaluationsService.list(
        params.employeeId,
        query.page,
        query.pageSize,
        query.evalType,
      );
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema,
      query: listEvaluationsQuerySchema,
    },
  )
  .get(
    "/:employeeId/evaluations/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await evaluationsService.getById(
        params.employeeId,
        params.id,
      );
      return { data };
    },
    { auth: true, params: evaluationParamsSchema },
  )
  .post(
    "/:employeeId/evaluations",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await evaluationsService.create(
        params.employeeId,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema,
      body: createEvaluationSchema,
    },
  )
  .put(
    "/:employeeId/evaluations/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await evaluationsService.update(
        params.employeeId,
        params.id,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: evaluationParamsSchema,
      body: updateEvaluationSchema,
    },
  )
  .delete(
    "/:employeeId/evaluations/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await evaluationsService.remove(
        params.employeeId,
        params.id,
        user.id,
      );
      return { data };
    },
    { auth: true, params: evaluationParamsSchema },
  );
