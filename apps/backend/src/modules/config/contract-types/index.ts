import {
  createContractTypeSchema,
  dropdownQuerySchema,
  idParamSchema,
  paginationSchema,
  updateContractTypeSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../../common/plugins/auth";
import { requireRole } from "../../../common/utils/role-guard";
import * as contractTypeService from "./contract-type.service";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const contractTypeRoutes = new Elysia({ prefix: "/api/config/contract-types" })
  .use(authPlugin)
  .get(
    "/dropdown",
    async ({ query }) => {
      const data = await contractTypeService.dropdown(query.search, query.limit);
      return { data };
    },
    { auth: true, query: dropdownQuerySchema },
  )
  .get(
    "/",
    async ({ query }) => {
      const data = await contractTypeService.list(query.page, query.pageSize, query.search);
      return { data };
    },
    { auth: true, query: listQuerySchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await contractTypeService.getById(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await contractTypeService.create(body);
      return { data };
    },
    { auth: true, body: createContractTypeSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await contractTypeService.update(params.id, body);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateContractTypeSchema },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await contractTypeService.remove(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  );
