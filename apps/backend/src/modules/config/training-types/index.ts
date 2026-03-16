import { dropdownQuerySchema, paginationSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../../common/plugins/auth";
import * as trainingTypeService from "./training-type.service";

const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const trainingTypeConfigRoutes = new Elysia({
  prefix: "/api/config/training-types",
})
  .use(authPlugin)
  .get(
    "/dropdown",
    async ({ query }) => {
      const data = await trainingTypeService.dropdown(
        query.search,
        query.limit,
      );
      return { data };
    },
    { auth: true, query: dropdownQuerySchema },
  )
  .get(
    "/",
    async ({ query }) => {
      const data = await trainingTypeService.list(
        query.page,
        query.pageSize,
        query.search,
      );
      return { data };
    },
    { auth: true, query: listQuerySchema },
  );
