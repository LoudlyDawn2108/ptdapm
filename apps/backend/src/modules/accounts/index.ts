import {
  createAccountSchema,
  idParamSchema,
  listAccountsQuerySchema,
  setAccountStatusSchema,
  updateAccountSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as accountService from "./accounts.service";

export const accountRoutes = new Elysia({ prefix: "/api/accounts" })
  .use(authPlugin)
  .get(
    "/",
    async ({ query, user }) => {
      requireRole(user.role, "ADMIN");
      const data = await accountService.list(
        query.page,
        query.pageSize,
        query.search,
        query.role,
        query.status,
      );
      return { data };
    },
    { auth: true, query: listAccountsQuerySchema },
  )
  .get(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN");
      const data = await accountService.getById(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN");
      const data = await accountService.create(body, user.id);
      return { data };
    },
    { auth: true, body: createAccountSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN");
      const data = await accountService.update(params.id, body, user.id);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateAccountSchema },
  )
  .patch(
    "/:id/status",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN");
      const data = await accountService.setStatus(params.id, body.status, user.id);
      return { data };
    },
    { auth: true, params: idParamSchema, body: setAccountStatusSchema },
  );
