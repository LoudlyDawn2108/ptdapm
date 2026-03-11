import {
  createTrainingCourseSchema,
  idParamSchema,
  listTrainingCoursesQuerySchema,
  updateTrainingCourseSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as trainingCoursesService from "./training-courses.service";

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
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingCoursesService.getById(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
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
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingCoursesService.update(
        params.id,
        body,
        user.id,
      );
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateTrainingCourseSchema },
  );
