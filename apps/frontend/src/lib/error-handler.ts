import type { FieldErrorResponse, ToastErrorResponse } from "@hrms/shared";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

// ──────────────────────────────────────────
// Eden Treaty Error Shape
// ──────────────────────────────────────────
/**
 * Shape of the error object returned by Eden Treaty on non-2xx responses.
 * Eden wraps every HTTP error as `{ status, value }` where `value` is
 * the parsed response body from the backend.
 */
export interface EdenApiError {
  status: number;
  value: unknown;
}

// ──────────────────────────────────────────
// Type Guards (applied to the unwrapped error.value)
// ──────────────────────────────────────────
function isFieldError(value: unknown): value is FieldErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "error" in value &&
    "fields" in value &&
    value.type === "field"
  );
}

function isToastError(value: unknown): value is ToastErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "error" in value &&
    value.type === "toast"
  );
}

function isGenericError(value: unknown): value is { error: string } {
  return typeof value === "object" && value !== null && "error" in value;
}

// Extended Error with optional field errors (for RHF integration)
export class ApiResponseError extends Error {
  fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiResponseError";
    this.fields = fields;
  }
}

// ──────────────────────────────────────────
// Main handler — call this from queryFn / mutationFn
// ──────────────────────────────────────────
export function handleApiError(edenError: EdenApiError): ApiResponseError {
  // Guard: skip redirect on login page to avoid infinite loops (login errors can also be 401)
  if (edenError.status === 401 && !window.location.pathname.startsWith("/login")) {
    toast.error("Phiên đăng nhập hết hạn");
    window.location.href = "/login";
    return new ApiResponseError("Phiên đăng nhập hết hạn");
  }

  const value = edenError.value;

  // Plain string (401/403 from auth middleware)
  if (typeof value === "string") {
    const message =
      value === "Unauthorized"
        ? "Phiên đăng nhập hết hạn"
        : value === "Account is locked"
          ? "Tài khoản đã bị khóa"
          : value;
    toast.error(message);
    return new ApiResponseError(message);
  }

  // Field validation errors — show toast + return fields for RHF
  if (isFieldError(value)) {
    toast.error(value.error);
    return new ApiResponseError(value.error, value.fields);
  }

  // Toast errors — just show toast
  if (isToastError(value)) {
    toast.error(value.error);
    return new ApiResponseError(value.error);
  }

  // Generic { error } shape (rate limit, etc.)
  if (isGenericError(value) && typeof value.error === "string") {
    toast.error(value.error);
    return new ApiResponseError(value.error);
  }

  // Fallback
  toast.error("Lỗi hệ thống");
  return new ApiResponseError("Unknown error");
}

// ──────────────────────────────────────────
// RHF Integration — map backend field errors to setError
// ──────────────────────────────────────────
export function applyFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: unknown,
) {
  if (error instanceof ApiResponseError && error.fields) {
    for (const [field, message] of Object.entries(error.fields)) {
      setError(field as Path<T>, { message });
    }
  }
}
