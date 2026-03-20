import {
  ACADEMIC_RANK_CODES,
  CONTRACT_STATUS_CODES,
  EMPLOYEE_PROFILE_MANAGE_ROLES,
  EMPLOYEE_PROFILE_VIEW_ROLES,
  GENDER_CODES,
  WORK_STATUS_CODES,
  createEmployeeSchema,
  paginationSchema,
  updateEmployeeSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { requireRole } from "../../common/utils/role-guard";
import * as employeeService from "./employee.service";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  orgUnitId: z.string().optional(),
  workStatus: z.enum(WORK_STATUS_CODES).optional(),
  contractStatus: z.enum(CONTRACT_STATUS_CODES).optional(),
  gender: z.enum(GENDER_CODES).optional(),
  academicRank: z.enum(ACADEMIC_RANK_CODES).optional(),
  positionTitle: z.string().optional(),
});

export const employeeRoutes = new Elysia({ prefix: "/api/employees" })
  .use(authPlugin)
  .get(
    "/me",
    async ({ user }) => {
      if (user.employeeId) {
        const data = await employeeService.getAggregateById(user.employeeId, user.role);
        return { data };
      }

      const employee = await employeeService.getByEmail(user.email ?? "");
      if (!employee) throw new NotFoundError("Không tìm thấy hồ sơ nhân viên");
      const data = await employeeService.getAggregateById(employee.id, user.role);
      return { data };
    },
    { auth: true },
  )
  .get(
    "/import/template",
    async ({ user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await employeeService.generateImportTemplate();
      return new Response(data, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="import-template.xlsx"',
        },
      });
    },
    { auth: true },
  )
  .post(
    "/import",
    async ({ body, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const file = body.file;
      if (!file) throw new BadRequestError("File không được để trống");
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        throw new BadRequestError("Chỉ hỗ trợ file Excel (.xlsx, .xls)");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestError("File quá lớn (tối đa 5MB)");
      }
      const buffer = await file.arrayBuffer();
      const data = await employeeService.importFromExcel(buffer);
      return { data };
    },
    {
      auth: true,
      body: z.object({ file: z.instanceof(File) }),
    },
  )
  .get(
    "/",
    async ({ query, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_VIEW_ROLES);
      const data = await employeeService.list(
        query.page,
        query.pageSize,
        query.search,
        query.orgUnitId,
        query.workStatus as Parameters<typeof employeeService.list>[4],
        query.contractStatus as Parameters<typeof employeeService.list>[5],
        query.gender as Parameters<typeof employeeService.list>[6],
        query.academicRank as Parameters<typeof employeeService.list>[7],
        query.positionTitle,
      );
      return { data };
    },
    { auth: true, query: listQuerySchema },
  )
  .get(
    "/:employeeId",
    async ({ params, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_VIEW_ROLES);
      const data = await employeeService.getAggregateById(params.employeeId, user.role);
      return { data };
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }) },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await employeeService.create(body);
      return { data };
    },
    { auth: true, body: createEmployeeSchema },
  )
  .put(
    "/:employeeId",
    async ({ params, body, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await employeeService.update(params.employeeId, body);
      return { data };
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }), body: updateEmployeeSchema },
  )
  .delete(
    "/:employeeId",
    async ({ params, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_MANAGE_ROLES);
      const data = await employeeService.remove(params.employeeId);
      return { data };
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }) },
  );
