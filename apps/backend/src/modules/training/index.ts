import { listMyTrainingQuerySchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import * as myTrainingService from "./my-training.service";

const listMyAvailableTrainingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

export const myTrainingRoutes = new Elysia({ prefix: "/api/my" })
  .use(authPlugin)
  .get(
    "/training",
    async ({ query, user }) => {
      const data = await myTrainingService.list(
        user.employeeId,
        query.page,
        query.pageSize,
        query.participationStatus,
      );
      return { data };
    },
    { auth: true, query: listMyTrainingQuerySchema },
  )
  .get(
    "/training/available",
    async ({ query }) => {
      const data = await myTrainingService.listAvailable(
        query.page,
        query.pageSize,
      );
      return { data };
    },
    { auth: true, query: listMyAvailableTrainingQuerySchema },
  )
  .get(
    "/training/courses/:courseId",
    async ({ params, user }) => {
      const data = await myTrainingService.getCourseDetail(
        params.courseId,
        user.employeeId,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
    },
  );
