# 05 — Routing & Authentication

## TanStack Router Setup

File-based routing with `@tanstack/router-plugin/vite`. Route files in `src/routes/` are auto-discovered and generate `routeTree.gen.ts`.

---

## Route Hierarchy

```
__root.tsx                          ← Root layout (Toaster, global providers)
├── login.tsx                       ← Public: /login
└── _authenticated.tsx              ← Auth guard layout (checks session)
    ├── index.tsx                   ← Dashboard: /
    ├── accounts/index.tsx          ← /accounts (Admin only)
    ├── employees/
    │   ├── index.tsx               ← /employees (list)
    │   ├── new.tsx                 ← /employees/new (create)
    │   └── $employeeId.tsx         ← /employees/:id (detail shell + tabs)
    │       ├── index.tsx           ← Default tab (personal info)
    │       ├── family.tsx          ← /employees/:id/family
    │       ├── bank-accounts.tsx   ← /employees/:id/bank-accounts
    │       ├── contracts.tsx       ← /employees/:id/contracts
    │       └── ...                 ← More tabs per dev ownership
    ├── org-units/
    │   ├── index.tsx               ← /org-units (tree view)
    │   └── $unitId.tsx             ← /org-units/:id (detail)
    ├── config/
    │   ├── contract-types.tsx      ← /config/contract-types
    │   ├── salary-coefficients.tsx ← /config/salary-coefficients
    │   └── allowance-types.tsx     ← /config/allowance-types
    ├── training/
    │   ├── index.tsx               ← /training (course list)
    │   └── $courseId.tsx           ← /training/:id (course detail)
    ├── reports/index.tsx           ← /reports
    ├── audit-logs/index.tsx        ← /audit-logs (Admin)
    └── my/
        ├── profile.tsx             ← /my/profile (self-service)
        ├── org.tsx                 ← /my/org
        └── training.tsx            ← /my/training
```

---

## Root Layout

```typescript
// routes/__root.tsx
import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}
```

---

## Authentication Guard (Layout Route)

The `_authenticated.tsx` layout protects all child routes. Uses `beforeLoad` for router-level enforcement (no flash of unauthenticated content).

```typescript
// routes/_authenticated.tsx
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { sessionOptions } from "@/features/auth/api";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionOptions(),
      );
      // Pass user to all child routes via context
      return { user: session.user };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

## Session Query (Auth Feature)

```typescript
// features/auth/api.ts
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { AuthUser } from "@hrms/shared";

export const authKeys = {
  session: ["auth", "session"] as const,
};

export const sessionOptions = () =>
  queryOptions({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data, error } = await api.auth.session.get();
      if (error) throw new Error("Not authenticated");
      return data.data; // { user, session: { expiresAt } }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — session doesn't change often
    retry: false,              // Don't retry auth — redirect on failure
  });

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.auth.logout.post();
    },
    onSuccess: () => {
      queryClient.clear(); // Wipe all cached data on logout
      window.location.href = "/login"; // Hard redirect to clear all state
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const { data, error } = await api.auth.login.post(credentials);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate session query to refetch user info
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}
```

---

## Login Page (redirect if already authenticated)

```typescript
// routes/login.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionOptions } from "@/features/auth/api";
import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    try {
      // If already logged in, redirect to dashboard
      await context.queryClient.ensureQueryData(sessionOptions());
      throw redirect({ to: "/" });
    } catch (e) {
      if (e instanceof Error && e.message === "Not authenticated") {
        return; // Not logged in — show login page
      }
      throw e; // Re-throw redirect
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

---

## Role-Based Route Protection

### Option A: Pathless Layout Routes (recommended for route groups)

```typescript
// routes/_authenticated/_admin.tsx
// All routes under _authenticated/_admin/ require ADMIN role
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_admin")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "ADMIN") {
      throw redirect({ to: "/" });
    }
  },
  component: ({ children }) => <>{children}</>,
});

// Then: routes/_authenticated/_admin/accounts/index.tsx
// Automatically protected by _admin layout
```

### Option B: Inline Guard (for individual routes)

```typescript
// routes/_authenticated/audit-logs/index.tsx
export const Route = createFileRoute("/_authenticated/audit-logs/")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "ADMIN") {
      throw redirect({ to: "/" });
    }
  },
  component: AuditLogsPage,
});
```

### Option C: Component-Level Guard (for conditional UI)

```typescript
// components/shared/role-guard.tsx
import { useRouteContext } from "@tanstack/react-router";
import type { AuthUser } from "@hrms/shared";

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { user } = useRouteContext({ from: "/_authenticated" });
  if (!roles.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}

// Usage:
// <RoleGuard roles={["ADMIN", "TCCB"]}>
//   <Button>Edit Employee</Button>
// </RoleGuard>
```

---

## Search Params (Type-Safe URL State)

TanStack Router + Zod gives you type-safe, validated URL search params. Use this for all table filters/pagination/sorting.

```typescript
// routes/_authenticated/employees/index.tsx
import { z } from "zod";

const employeeSearchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  workStatus: z.string().optional(),
  contractStatus: z.string().optional(),
  gender: z.string().optional(),
  orgUnitId: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const Route = createFileRoute("/_authenticated/employees/")({
  validateSearch: employeeSearchSchema,
  // ...
});

// In component — reading + updating search params:
function EmployeeListPage() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();

  const updateFilters = (patch: Partial<typeof filters>) => {
    navigate({
      search: (prev) => ({ ...prev, ...patch, page: 1 }), // Reset page on filter change
    });
  };

  return (
    <>
      <Input
        placeholder="Search..."
        defaultValue={filters.search}
        onChange={(e) => updateFilters({ search: e.target.value })}
      />
      {/* Table uses filters from URL */}
    </>
  );
}
```

---

## Idle Session Timeout (30 minutes — per spec UC 4.2)

```typescript
// hooks/use-idle-timeout.ts
import { useEffect, useRef } from "react";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useIdleTimeout(onTimeout: () => void) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(onTimeout, IDLE_TIMEOUT_MS);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer(); // Start initial timer

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [onTimeout]);
}

// Usage in _authenticated.tsx layout:
// useIdleTimeout(() => {
//   toast.warning("Phiên đăng nhập hết hạn do không hoạt động");
//   logoutMutation.mutate();
// });
```

---

## Key Rules

1. **`beforeLoad` for auth/role checks** — runs before component renders, no flash.
2. **Context flows down** — `_authenticated` puts `user` in context; all child routes access it.
3. **Search params are the source of truth for filters** — bookmarkable, shareable, survives refresh.
4. **Session is cached in TanStack Query** — `staleTime: 5min`, no redundant fetches.
5. **Logout clears everything** — `queryClient.clear()` + hard redirect.
