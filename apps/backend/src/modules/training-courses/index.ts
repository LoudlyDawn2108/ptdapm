import {
  createTrainingCourseSchema,
  listTrainingCoursesQuerySchema,
  updateTrainingCourseSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as trainingCoursesService from "./training-courses.service";

const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

export const trainingCourseRoutes = new Elysia({
  prefix: "/api/training-courses",
})
  .use(authPlugin)
  .get(
    "/",
    async ({ query, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingCoursesService.list(
        query.page,
        query.pageSize,
        query.status,
        query.search,
      );
      return { data };
    },
    { auth: true, query: listTrainingCoursesQuerySchema },
  )
  .get(
    "/:courseId",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingCoursesService.getById(params.courseId);
      return { data };
    },
    { auth: true, params: courseIdParamSchema },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingCoursesService.create(body, user.id);
      return { data };
    },
    { auth: true, body: createTrainingCourseSchema },
  )
  .put(
    "/:courseId",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingCoursesService.update(
        params.courseId,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
      body: updateTrainingCourseSchema,
    },
  );
