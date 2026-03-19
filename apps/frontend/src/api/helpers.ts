import { type EdenApiError, handleApiError } from "@/lib/error-handler";
import type { ZodType } from "zod";

/**
 * Parse raw form/UI data through a Zod schema before sending to Eden.
 * This ensures the value matches the schema's output type (what Eden expects)
 * while providing runtime validation at the boundary.
 */
export function toApi<T>(schema: ZodType<T>, raw: unknown): T {
  return schema.parse(raw);
}

/**
 * Unwrap an Eden Treaty response, throwing on error.
 * For use in queryFn / mutationFn.
 */
export function unwrap<T>(result: { data: T | null; error: EdenApiError | null }): T {
  if (result.error) {
    throw handleApiError(result.error);
  }
  if (result.data === null || result.data === undefined) {
    throw new Error("Unexpected null response");
  }
  return result.data;
}
