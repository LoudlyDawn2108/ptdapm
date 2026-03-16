import {
  createTrainingRegistrationSchema,
  listTrainingRegistrationsQuerySchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as trainingRegistrationsService from "./training-registrations.service";

const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

const registrationParamsSchema = z.object({
  courseId: z.string().uuid(),
  id: z.string().uuid(),
});

export const trainingRegistrationRoutes = new Elysia({
  prefix: "/api/training-courses",
})
  .use(authPlugin)
  .get(
    "/:courseId/registrations",
    async ({ params, query, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingRegistrationsService.list(
        params.courseId,
        query.page,
        query.pageSize,
        query.participationStatus,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
      query: listTrainingRegistrationsQuerySchema,
    },
  )
  .get(
    "/:courseId/registrations/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingRegistrationsService.getById(
        params.courseId,
        params.id,
      );
      return { data };
    },
    { auth: true, params: registrationParamsSchema },
  )
  .post(
    "/:courseId/registrations",
    async ({ params, body, user }) => {
      const data = await trainingRegistrationsService.create(
        params.courseId,
        body,
        user.id,
        user.employeeId,
        user.role,
      );
      return { data };
    },
    {
      auth: true,
      params: courseIdParamSchema,
      body: createTrainingRegistrationSchema,
    },
  )
  .delete(
    "/:courseId/registrations/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await trainingRegistrationsService.remove(
        params.courseId,
        params.id,
        user.id,
      );
      return { data };
    },
    { auth: true, params: registrationParamsSchema },
  );
