import { listMyTrainingQuerySchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import * as myTrainingService from "./my-training.service";

export const myTrainingRoutes = new Elysia({ prefix: "/api/my" })
  .use(authPlugin)
  .get(
    "/training",
    async ({ query, user }) => {
      const data = await myTrainingService.list(
        user.employeeId,
        query.page,
        query.pageSize,
        query.participationStatus,
      );
      return { data };
    },
    { auth: true, query: listMyTrainingQuerySchema },
  );
