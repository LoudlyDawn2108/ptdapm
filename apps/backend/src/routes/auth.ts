import Elysia from "elysia";

export const authRoutes = new Elysia({ prefix: "/auth" }).get("/me", () => ({
  message: "Auth route placeholder",
}));
