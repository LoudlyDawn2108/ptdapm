import { Elysia } from "elysia";
import { AppError } from "../utils/errors";

export const errorPlugin = new Elysia({ name: "error-handler" }).onError(
  { as: "global" },
  ({ code, error }) => {
    if (error instanceof AppError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (code === "VALIDATION") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (code === "NOT_FOUND") {
      return new Response(JSON.stringify({ error: "Không tìm thấy route" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({ error: "Lỗi hệ thống" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  },
);
