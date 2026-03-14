# 07 — Error Handling

## Backend Error Shapes

The backend produces 4 distinct error shapes. The frontend must handle all of them consistently.

| Shape | When | HTTP Status | Example |
|---|---|---|---|
| `{ type: "toast", error: "..." }` | Business logic errors | 400, 403, 404, 409, 500 | `{ type: "toast", error: "Mã nhân viên đã tồn tại" }` |
| `{ type: "field", error: "...", fields: {...} }` | Validation errors (per-field) | 400 | `{ type: "field", error: "Dữ liệu không hợp lệ", fields: { email: "Email không đúng định dạng" } }` |
| `{ error: "..." }` | Rate limiting, auth failures | 401, 429 | `{ error: "Too many requests" }` |
| Plain string | Auth middleware | 401, 403 | `"Unauthorized"` or `"Account is locked"` |

---

## Centralized Error Handler

```typescript
// lib/error-handler.ts
import { toast } from "sonner";

// ──────────────────────────────────────────
// Error Types
// ──────────────────────────────────────────
type ToastError = { type: "toast"; error: string };
type FieldError = {
  type: "field";
  error: string;
  fields: Record<string, string>;
};
type GenericError = { error: string };
type ApiError = ToastError | FieldError | GenericError | string;

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
export function handleApiError(error: ApiError): ApiResponseError {
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
  if ("type" in error && error.type === "field") {
    toast.error(error.error);
    return new ApiResponseError(error.error, error.fields);
  }

  // Toast errors — just show toast
  if ("type" in error && error.type === "toast") {
    toast.error(error.error);
    return new ApiResponseError(error.error);
  }

  // Generic { error } shape (rate limit, etc.)
  if ("error" in error) {
    toast.error(error.error);
    return new ApiResponseError(error.error);
  }

  // Fallback
  toast.error("Lỗi hệ thống");
  return new ApiResponseError("Unknown error");
}
```

---

## RHF Integration Helper

Maps backend field errors to React Hook Form `setError()` calls for inline field messages.

```typescript
// lib/error-handler.ts (continued)
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

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
```

---

## Usage in Mutations

```typescript
// features/employees/api.ts
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateEmployeeInput) => {
      const { data, error } = await api.api.employees.post(body);
      if (error) throw handleApiError(error);
      // ↑ handleApiError shows toast AND throws ApiResponseError
      return data.data;
    },
    onSuccess: () => {
      toast.success("Tạo nhân sự thành công");
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    // onError is NOT needed — handleApiError already showed toast
  });
}
```

```typescript
// In a form component
const createEmployee = useCreateEmployee();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await createEmployee.mutateAsync(values);
    navigate({ to: "/employees" });
  } catch (error) {
    // Backend returned { type: "field" } → show inline errors
    applyFieldErrors(form.setError, error);
  }
});
```

---

## Usage in Queries (via queryFn)

```typescript
// features/employees/api.ts
export const employeeListOptions = (filters: EmployeeFilters) =>
  queryOptions({
    queryKey: employeeKeys.list(filters),
    queryFn: async () => {
      const { data, error } = await api.api.employees.get({ query: filters });
      if (error) throw handleApiError(error);
      // ↑ Shows toast for any error, throws so TanStack Query marks as errored
      return data.data;
    },
  });
```

---

## Global Error Boundary (React)

For unhandled errors that slip through:

```typescript
// components/shared/error-boundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
            <p className="text-muted-foreground mt-2">
              {this.state.error?.message ?? "Vui lòng thử lại sau"}
            </p>
            <button
              className="mt-4 underline"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

---

## TanStack Router Error Component

```typescript
// routes/__root.tsx (or per-route)
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Lỗi</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <a href="/" className="mt-4 underline">
        Về trang chủ
      </a>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">404 — Không tìm thấy</h1>
      <a href="/" className="mt-4 underline">
        Về trang chủ
      </a>
    </div>
  ),
});
```

---

## Toaster Setup

```typescript
// routes/__root.tsx
import { Toaster } from "sonner";

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}
```

---

## Error Flow Summary

```
Backend returns error
  ↓
Eden Treaty: { data: null, error: ApiError }
  ↓
handleApiError(error):
  1. Shows toast notification (sonner)
  2. Returns ApiResponseError (with .fields if field error)
  ↓
throw ApiResponseError
  ↓
In queryFn → TanStack Query marks query as error state
In mutationFn → caught in form onSubmit:
  ↓
applyFieldErrors(form.setError, error)
  ↓
RHF shows inline field error messages
```

---

## Key Rules

1. **Always check `error` from Eden** — `const { data, error } = await api...` — if `error`, throw `handleApiError(error)`.
2. **`handleApiError` is the SINGLE entry point** — it decides toast vs field error. Don't handle errors ad-hoc.
3. **Mutations use `mutateAsync` + try/catch** — to catch field errors for RHF.
4. **Queries auto-show toasts** — `handleApiError` fires toast inside `queryFn`. No extra `onError` needed.
5. **Success toasts are explicit** — only show `toast.success(...)` in `onSuccess` of mutations, not queries.
