import {
  createContractTypeSchema,
  idParamSchema,
  paginationSchema,
  updateContractTypeSchema,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../plugins/auth";
import * as contractTypeService from "../../services/contract-type.service";
import { requireRole } from "../../utils/role-guard";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const contractTypeRoutes = new Elysia({ prefix: "/api/config/contract-types" })
  .use(authPlugin)
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
