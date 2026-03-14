# 06 — State Management

## The Four State Domains

Every piece of state in the app belongs to exactly ONE of these categories:

| Domain | Tool | Examples |
|---|---|---|
| **Server state** | TanStack Query | Employees, accounts, config, training, audit logs |
| **URL state** | TanStack Router search params | Table filters, page, sort order, active tab |
| **Auth state** | Zustand (`useAuthStore`) | Current user, role, session |
| **UI state** | Zustand (`useUIStore`) or React `useState` | Sidebar collapsed, modal open, theme |

**Golden rule**: If data comes from the server, it lives in TanStack Query. Never put server data in Zustand.

---

## Server State (TanStack Query)

### When to use
- ANY data fetched from the backend API
- Employee lists, employee details, config catalogs, dropdown options, reports, audit logs
- Training courses, registrations, results

### Why not Zustand for server data?
- TanStack Query handles caching, background refetch, deduplication, stale tracking, and garbage collection automatically
- Zustand would require you to manually manage all of this
- Multiple components reading the same data get deduplicated fetches for free

### Pattern
```typescript
// features/employees/api.ts defines queryOptions
// Route loader calls ensureQueryData (prefetch)
// Component calls useSuspenseQuery or useQuery (consume)

// This is the ONLY way to read server data:
const { data, isLoading, error } = useQuery(employeeListOptions(filters));
```

---

## URL State (TanStack Router Search Params)

### When to use
- Table pagination (page, pageSize)
- Search/filter values
- Sort column + direction
- Active tab in multi-tab views
- Any state that should survive page refresh or be shareable via URL

### Why URL state?
- **Bookmarkable**: user can save or share a filtered view
- **Refresh-safe**: state survives F5
- **Back-button friendly**: browser history tracks state changes
- **SSR-ready**: if you ever add SSR, URL state works automatically

### Pattern
```typescript
// Define with Zod schema in route
const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(20),
  search: z.string().optional(),
  tab: z.enum(["personal", "family", "contracts"]).default("personal"),
});

export const Route = createFileRoute("/_authenticated/employees/")({
  validateSearch: searchSchema,
  component: EmployeeListPage,
});

// Read in component
function EmployeeListPage() {
  const { page, search, tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  // Update URL state (triggers re-render + re-fetch)
  const setPage = (newPage: number) =>
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });

  const setSearch = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, search: value, page: 1 }) });
}
```

---

## Auth State (Zustand)

### When to use
- Current user object (username, role, fullName)
- Auth status (logged in or not)
- Quick role checks in components

### Store Definition

```typescript
// stores/auth.ts
import { create } from "zustand";
import type { AuthUser } from "@hrms/shared";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

### Important Notes
- **No persistence**: Auth is cookie-based. On page load, `_authenticated.tsx` calls `/auth/session` and populates the store. No need for `localStorage`.
- **Zustand is a mirror**: The source of truth is the session cookie → backend `/auth/session` endpoint → TanStack Query cache. Zustand just provides convenient synchronous access.
- **Sync from TanStack Query**: When `sessionOptions()` returns data, also call `setUser()`. This keeps Zustand in sync.

### Role Helper Hook

```typescript
// features/auth/hooks.ts
import { useAuthStore } from "@/stores/auth";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  return {
    user,
    isAdmin: user?.role === "ADMIN",
    isTCCB: user?.role === "TCCB",
    isTCKT: user?.role === "TCKT",
    isEmployee: user?.role === "EMPLOYEE",
    hasRole: (...roles: string[]) => user ? roles.includes(user.role) : false,
  };
}
```

---

## UI State (Zustand or React State)

### When to use Zustand (`useUIStore`)
- State shared across distant components (sidebar collapsed state, global theme)
- State that must survive component unmount but NOT page refresh

### When to use React `useState`
- State local to one component (dialog open, dropdown open, hover state)
- If only ONE component cares about it, use `useState`

### Store Definition

```typescript
// stores/ui.ts
import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
```

### Decision Tree: Where does this state go?

```
Is it from the server (API)?
  YES → TanStack Query
  NO ↓

Should it survive page refresh / be in URL?
  YES → TanStack Router search params
  NO ↓

Is it shared across multiple distant components?
  YES → Zustand store
  NO ↓

Is it local to one component?
  YES → React useState
```

---

## Anti-Patterns (Don't Do This)

### ❌ Server data in Zustand
```typescript
// BAD — don't cache server data in Zustand
const useEmployeeStore = create((set) => ({
  employees: [],
  fetchEmployees: async () => {
    const data = await api.employees.get();
    set({ employees: data });
  },
}));
```

### ❌ Filters in Zustand instead of URL
```typescript
// BAD — filters should be in URL, not Zustand
const useFilterStore = create((set) => ({
  search: "",
  page: 1,
  setSearch: (s) => set({ search: s, page: 1 }),
}));
```

### ❌ Giant global store
```typescript
// BAD — one store for everything
const useGlobalStore = create((set) => ({
  user: null,
  employees: [],
  sidebarOpen: true,
  currentFilter: {},
  // ... mixing concerns
}));
```

### ✅ Correct: Separate concerns
```typescript
// Server data → TanStack Query (features/employees/api.ts)
// Filters → URL search params (route validateSearch)
// Auth → Zustand (stores/auth.ts)
// UI → Zustand or useState (stores/ui.ts)
```
