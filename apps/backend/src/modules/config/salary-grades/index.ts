import {
  createSalaryGradeSchema,
  createSalaryGradeStepSchema,
  dropdownQuerySchema,
  idParamSchema,
  paginationSchema,
  updateSalaryGradeSchema,
  updateSalaryGradeStepSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../../common/plugins/auth";
import { requireRole } from "../../../common/utils/role-guard";
import * as salaryGradeService from "./salary-grade.service";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

const stepListQuerySchema = z.object({
  activeOnly: z.coerce.boolean().optional().default(false),
});

const gradeIdParam = z.object({ id: z.uuid() });
const stepIdParam = z.object({ id: z.uuid(), stepId: z.uuid() });

export const salaryGradeRoutes = new Elysia({ prefix: "/api/config/salary-grades" })
  .use(authPlugin)
  .get(
    "/dropdown",
    async ({ query }) => {
      const data = await salaryGradeService.dropdown(query.search, query.limit);
      return { data };
    },
    { auth: true, query: dropdownQuerySchema },
  )
  .get(
    "/",
    async ({ query }) => {
      const data = await salaryGradeService.list(query.page, query.pageSize, query.search);
      return { data };
    },
    { auth: true, query: listQuerySchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await salaryGradeService.getById(params.id);
      return { data };
    },
    { auth: true, params: gradeIdParam },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await salaryGradeService.create(body);
      return { data };
    },
    { auth: true, body: createSalaryGradeSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await salaryGradeService.update(params.id, body);
      return { data };
    },
    { auth: true, params: gradeIdParam, body: updateSalaryGradeSchema },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await salaryGradeService.remove(params.id);
      return { data };
    },
    { auth: true, params: gradeIdParam },
  )
  // ── Steps ────────────────────────────────────────────────────────────────
  .get(
    "/:id/steps",
    async ({ params, query }) => {
      const data = await salaryGradeService.listSteps(params.id, query.activeOnly);
      return { data };
    },
    { auth: true, params: gradeIdParam, query: stepListQuerySchema },
  )
  .post(
    "/:id/steps",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await salaryGradeService.createStep(params.id, body);
      return { data };
    },
    { auth: true, params: gradeIdParam, body: createSalaryGradeStepSchema },
  )
  .put(
    "/:id/steps/:stepId",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await salaryGradeService.updateStep(params.id, params.stepId, body);
      return { data };
    },
    { auth: true, params: stepIdParam, body: updateSalaryGradeStepSchema },
  )
  .delete(
    "/:id/steps/:stepId",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await salaryGradeService.removeStep(params.id, params.stepId);
      return { data };
    },
    { auth: true, params: stepIdParam },
  );
