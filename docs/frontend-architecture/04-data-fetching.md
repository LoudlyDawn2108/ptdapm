# 04 — Data Fetching (Eden + TanStack Query)

## Strategy Overview

| Layer | Responsibility |
|---|---|
| **Eden Treaty** | Type-safe HTTP calls (`api.employees.get(...)`) — the "fetch" |
| **TanStack Query** | Caching, deduplication, background refetch, loading/error states — the "cache" |
| **Route Loaders** | Prefetching via `queryClient.ensureQueryData()` — the "preload" |

**Rule**: Eden makes the call. TanStack Query manages the lifecycle. Route loaders trigger prefetching.

---

## Query Client Setup

```typescript
// api/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,           // 30 seconds — good for HRMS data
      retry: 1,                     // Retry once on failure
      refetchOnWindowFocus: false,  // Don't refetch when tab is focused
    },
    mutations: {
      retry: 0,                     // Don't retry mutations
    },
  },
});
```

---

## Router Context (wire QueryClient into router)

```typescript
// main.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./api/query-client";

const router = createRouter({
  routeTree,
  context: { queryClient },
});

// Register router type for type-safe useNavigate, Link, etc.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## Query Options Factory Pattern

Each feature defines `queryOptions` functions. These are composable — usable in both `useQuery()` and route `loader`.

```typescript
// features/employees/api.ts
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";

// ──────────────────────────────────────────
// Query Keys (hierarchical, for targeted invalidation)
// ──────────────────────────────────────────
export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

// ──────────────────────────────────────────
// Query Options (composable)
// ──────────────────────────────────────────
export const employeeListOptions = (filters: {
  page: number;
  pageSize: number;
  search?: string;
  workStatus?: string;
  // ... other filters
}) =>
  queryOptions({
    queryKey: employeeKeys.list(filters),
    queryFn: async () => {
      const { data, error } = await api.api.employees.get({
        query: filters,
      });
      if (error) throw handleApiError(error);
      return data.data; // { items, total, page, pageSize }
    },
  });

export const employeeDetailOptions = (employeeId: string) =>
  queryOptions({
    queryKey: employeeKeys.detail(employeeId),
    queryFn: async () => {
      const { data, error } = await api.api.employees({ employeeId }).get();
      if (error) throw handleApiError(error);
      return data.data;
    },
  });
```

---

## Route Loader Pattern (Prefetch on Navigation)

```typescript
// routes/_authenticated/employees/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { employeeListOptions } from "@/features/employees/api";

// Zod schema validates URL search params
const employeeSearchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  workStatus: z.string().optional(),
  gender: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/employees/")({
  // Type-safe, validated search params from URL
  validateSearch: employeeSearchSchema,

  // Declare which search params trigger re-loading
  loaderDeps: ({ search }) => search,

  // Prefetch data (non-blocking — uses cache if available)
  loader: ({ context: { queryClient }, deps: filters }) => {
    queryClient.ensureQueryData(employeeListOptions(filters));
  },

  component: EmployeeListPage,
});
```

---

## Mutation Pattern

```typescript
// features/employees/api.ts (continued)
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateEmployeeInput) => {
      const { data, error } = await api.api.employees.post(body);
      if (error) throw handleApiError(error);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate list queries so they refetch
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUpdateEmployee(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateEmployeeInput) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        .put(body);
      if (error) throw handleApiError(error);
      return data.data;
    },
    onSuccess: (updatedEmployee) => {
      // Update detail cache directly (optimistic-ish)
      queryClient.setQueryData(
        employeeKeys.detail(employeeId),
        updatedEmployee,
      );
      // Also invalidate list to reflect changes
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        .delete();
      if (error) throw handleApiError(error);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
```

---

## Page Component (consuming queries)

```typescript
// Inside EmployeeListPage component
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { employeeListOptions } from "@/features/employees/api";

function EmployeeListPage() {
  const filters = Route.useSearch();
  const { data } = useSuspenseQuery(employeeListOptions(filters));

  // data = { items: Employee[], total: number, page: number, pageSize: number }
  return (
    <DataTable
      data={data.items}
      columns={employeeColumns}
      pageCount={Math.ceil(data.total / data.pageSize)}
      // ... pagination/sorting props
    />
  );
}
```

---

## Dropdown / Combobox Pattern (per combobox plan)

```typescript
// hooks/use-dropdown-query.ts
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

type DropdownOption = { value: string; label: string };

export function dropdownOptions(
  key: string,
  fetchFn: (search: string) => Promise<DropdownOption[]>,
  search: string,
) {
  return queryOptions({
    queryKey: ["dropdown", key, search],
    queryFn: () => fetchFn(search),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
```

```typescript
// features/config/contract-types/api.ts
export async function fetchContractTypeDropdown(
  search: string,
): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["contract-types"].dropdown.get({
    query: { search, limit: 20 },
  });
  if (error) throw handleApiError(error);
  return data.data;
}
```

---

## Nested Sub-Resource Pattern

For employee sub-entities (family, bank accounts, etc.), scope queries under the parent:

```typescript
// features/employees-sub/family/api.ts
export const familyKeys = {
  all: (employeeId: string) =>
    ["employees", employeeId, "family-members"] as const,
  list: (employeeId: string, filters: Record<string, unknown>) =>
    [...familyKeys.all(employeeId), filters] as const,
};

export const familyListOptions = (
  employeeId: string,
  filters: { page: number; pageSize: number },
) =>
  queryOptions({
    queryKey: familyKeys.list(employeeId, filters),
    queryFn: async () => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["family-members"].get({ query: filters });
      if (error) throw handleApiError(error);
      return data.data;
    },
  });
```

---

## Key Rules

1. **Never call `fetch()` or `api.*` directly in components** — always go through `queryOptions` + `useQuery`/`useSuspenseQuery` or `useMutation`.
2. **Query keys are hierarchical** — `["employees", "list", filters]` allows targeted invalidation (invalidate all lists, or just one filter combo).
3. **Route loaders call `ensureQueryData`** — this prefetches without blocking navigation. Data is instant if cached.
4. **Mutations always invalidate** — after create/update/delete, invalidate related query keys so lists refresh.
5. **Error handling is centralized** — `handleApiError()` converts backend errors to thrown `Error` objects (with `.fields` for RHF).
