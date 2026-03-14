import {
  createBatchTrainingResultSchema,
  createTrainingResultSchema,
  listTrainingResultsQuerySchema,
  updateTrainingResultSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as trainingResultsService from "./training-results.service";

const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

const resultParamsSchema = z.object({
  courseId: z.string().uuid(),
  id: z.string().uuid(),
});

export const trainingResultRoutes = new Elysia({
  prefix: "/api/training-courses",
})
  .use(authPlugin)
  .get(
    "/:courseId/results",
    async ({ params, query, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingResultsService.list(
        params.courseId,
        query.page,
        query.pageSize,
        query.resultStatus,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
      query: listTrainingResultsQuerySchema,
    },
  )
  .get(
    "/:courseId/results/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingResultsService.getById(
        params.courseId,
        params.id,
      );
      return { data };
    },
    { auth: true, params: resultParamsSchema },
  )
  .post(
    "/:courseId/results",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingResultsService.create(
        params.courseId,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
      body: createTrainingResultSchema,
    },
  )
  .post(
    "/:courseId/results/batch",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingResultsService.createBatch(
        params.courseId,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
      body: createBatchTrainingResultSchema,
    },
  )
  .put(
    "/:courseId/results/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingResultsService.update(
        params.courseId,
        params.id,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: resultParamsSchema,
      body: updateTrainingResultSchema,
    },
  )
  .delete(
    "/:courseId/results/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingResultsService.remove(
        params.courseId,
        params.id,
        user.id,
      );
      return { data };
    },
    { auth: true, params: resultParamsSchema },
  );
