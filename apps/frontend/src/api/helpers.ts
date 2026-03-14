/**
 * Unwrap an Eden Treaty response, throwing on error.
 * For use in queryFn / mutationFn.
 */
export function unwrap<T>(result: { data: T | null; error: unknown }): T {
  if (result.error) {
    throw result.error;
  }
  if (result.data === null || result.data === undefined) {
    throw new Error("Unexpected null response");
  }
  return result.data;
}
