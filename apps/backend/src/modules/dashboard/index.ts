import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import * as dashboardService from "./dashboard.service";

export const dashboardRoutes = new Elysia({ prefix: "/api/dashboard" })
  .use(authPlugin)
  .get(
    "/statistics",
    async () => {
      const data = await dashboardService.getStatistics();
      return { data };
    },
    { auth: true },
  );
