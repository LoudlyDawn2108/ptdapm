import Elysia from "elysia";

export const indexRoutes = new Elysia().get("/", () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));
