import { createTerminationSchema, employeeIdParamSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { ForbiddenError } from "../../common/utils/errors";
import { requireRole } from "../../common/utils/role-guard";
import * as terminationService from "./termination.service";

export const terminationRoutes = new Elysia({
  prefix: "/api/employees/:employeeId",
})
  .use(authPlugin)
  .get(
    "/termination",
    async ({ params, user }) => {
      const isHr = user.role === "ADMIN" || user.role === "TCCB";
      const isOwner =
        !!user.employeeId && user.employeeId === params.employeeId;

      if (!isHr && !isOwner) {
        throw new ForbiddenError("Không có quyền xem thông tin thôi việc này.");
      }

      const data = await terminationService.getByEmployeeId(params.employeeId);
      return { data };
    },
    { auth: true, params: employeeIdParamSchema },
  )
  .post(
    "/terminate",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await terminationService.terminate(
        params.employeeId,
        body,
        user.id,
      );
      return { data };
    },
    {
      auth: true,
      params: employeeIdParamSchema,
      body: createTerminationSchema,
    },
  );
