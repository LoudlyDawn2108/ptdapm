import {
  createAllowanceTypeSchema,
  dropdownQuerySchema,
  idParamSchema,
  paginationSchema,
  updateAllowanceTypeSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../../common/plugins/auth";
import { requireRole } from "../../../common/utils/role-guard";
import * as allowanceTypeService from "./allowance-type.service";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const allowanceTypeRoutes = new Elysia({ prefix: "/api/config/allowance-types" })
  .use(authPlugin)
  .get(
    "/dropdown",
    async ({ query }) => {
      const data = await allowanceTypeService.dropdown(query.search, query.limit);
      return { data };
    },
    { auth: true, query: dropdownQuerySchema },
  )
  .get(
    "/",
    async ({ query }) => {
      const data = await allowanceTypeService.list(query.page, query.pageSize, query.search);
      return { data };
    },
    { auth: true, query: listQuerySchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await allowanceTypeService.getById(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await allowanceTypeService.create(body);
      return { data };
    },
    { auth: true, body: createAllowanceTypeSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await allowanceTypeService.update(params.id, body);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateAllowanceTypeSchema },
  );
