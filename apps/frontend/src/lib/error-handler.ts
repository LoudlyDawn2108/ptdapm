import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

// ──────────────────────────────────────────
// Error Types (matching backend response shapes)
// ──────────────────────────────────────────
type ToastError = { type: "toast"; error: string };
type FieldError = {
  type: "field";
  error: string;
  fields: Record<string, string>;
};
type GenericError = { error: string };
type ApiError = ToastError | FieldError | GenericError | string;

function isFieldError(error: unknown): error is FieldError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "error" in error &&
    "fields" in error &&
    error.type === "field"
  );
}

function isToastError(error: unknown): error is ToastError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "error" in error &&
    error.type === "toast"
  );
}

function isGenericError(error: unknown): error is GenericError {
  return typeof error === "object" && error !== null && "error" in error;
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
export function handleApiError(error: unknown): ApiResponseError {
  // Plain string (401/403 from auth middleware)
  if (typeof error === "string") {
    const message =
      error === "Unauthorized"
        ? "Phiên đăng nhập hết hạn"
        : error === "Account is locked"
          ? "Tài khoản đã bị khóa"
          : error;
    toast.error(message);
    return new ApiResponseError(message);
  }

  // Field validation errors — show toast + return fields for RHF
  if (isFieldError(error)) {
    toast.error(error.error);
    return new ApiResponseError(error.error, error.fields);
  }

  // Toast errors — just show toast
  if (isToastError(error)) {
    toast.error(error.error);
    return new ApiResponseError(error.error);
  }

  // Generic { error } shape (rate limit, etc.)
  if (isGenericError(error) && typeof error.error === "string") {
    toast.error(error.error);
    return new ApiResponseError(error.error);
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
