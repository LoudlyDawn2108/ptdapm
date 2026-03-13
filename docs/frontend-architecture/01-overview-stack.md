# 01 — Overview & Current Stack Assessment

## Project Context

**HRMS (Human Resource Management System)** for Thuy Loi University — a monorepo SPA managing accounts, organizational structure, HR profiles, contracts, training, evaluations, reports, and audit logs.

**Monorepo layout**: Bun + Turborepo

```
apps/
  backend/    @hrms/backend   — Elysia REST API
  frontend/   @hrms/frontend  — React + Vite SPA
packages/
  shared/     @hrms/shared    — Validators, types, constants
  env/        @hrms/env       — Environment variable validation
```

---

## Current Stack (already chosen)

| Library | Version | Purpose | Verdict |
|---|---|---|---|
| React | 19.0.0 | UI framework | ✅ Latest stable |
| Vite | 6.1.0 | Build tool + dev server | ✅ Fast HMR, modern |
| TanStack Router | 1.163.3 | File-based routing | ✅ Type-safe search params, loaders |
| Zustand | 5.0.3 | Client state management | ✅ Lightweight, minimal boilerplate |
| React Hook Form | 7.55.0 | Form state management | ✅ Performance-oriented, uncontrolled |
| @hookform/resolvers | 5.2.2 | Schema-based validation | ✅ Bridges RHF ↔ Zod |
| Zod | 4.3.6 | Validation schemas | ✅ Shared with backend via `@hrms/shared` |
| Eden Treaty | 1.2.0 | Type-safe API client for Elysia | ✅ End-to-end type safety |
| shadcn/ui | 3.8.5 | UI component primitives | ✅ Composable, accessible (Radix-based) |
| Radix UI | 1.4.3 | Accessible primitives | ✅ Foundation for shadcn |
| Tailwind CSS | 4.1.8 | Utility-first CSS | ✅ Modern v4 with CSS-first config |
| CVA | 0.7.1 | Component variant management | ✅ Pairs with Tailwind + shadcn |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Class name utilities | ✅ Standard `cn()` helper |
| date-fns | 4.1.0 | Date utilities | ✅ Tree-shakeable, immutable |
| Lucide React | 0.577.0 | Icon set | ✅ Consistent, tree-shakeable |
| Biome | 1.9.4 | Linter + formatter | ✅ Fast, unified tooling |
| TypeScript | 5.7.3 | Type checking | ✅ Across all workspaces |

---

## Backend Contract Summary

The frontend consumes an **Elysia** backend via **Eden Treaty** (type-safe, cookie-based auth):

- **Auth**: Cookie-based sessions (30-min idle timeout), `better-auth` library
- **API prefix**: `/api/*` for resources, `/auth/*` for auth endpoints
- **Success response**: `{ data: <payload> }` — lists use `{ data: { items, total, page, pageSize } }`
- **Error responses** (discriminated union):
  - Toast error: `{ type: "toast", error: "..." }`
  - Field error: `{ type: "field", error: "...", fields: { [fieldName]: "message" } }`
  - Generic: `{ error: "..." }` (rate limit, auth failures)
  - Plain string: `"Unauthorized"` / `"Account is locked"` (auth middleware)
- **Type export**: `export type App = typeof app` from backend → `treaty<App>(...)` on frontend
- **CORS**: credentials enabled, origin restricted to `FRONTEND_URL`

---

## Current Frontend State (as of now)

The frontend is mostly **scaffolding** — very little is implemented:

### What exists
- Root layout (`__root.tsx`) with header/main/footer shell
- Auth guard layout (`_authenticated.tsx`) with session check + sidebar + logout
- Login page placeholder (no form wiring)
- Dashboard index page (placeholder content)
- Eden Treaty client configured with cookie credentials
- Zustand auth store (`user`, `setUser`, `clearUser`)
- `routeTree.gen.ts` (stale — references files that don't exist on disk)

### What's missing
- No shadcn components installed (only `.gitkeep` in `components/ui/`)
- No TanStack Query setup
- No RHF/Zod form usage anywhere
- No reusable data table component
- No error handling utilities
- No toast notification system
- Empty `lib/` and `hooks/` directories
- Login form not wired to API
- No role-based route guards (only basic auth check)

---

## Roles & Access Summary

| Role | Code | Access Scope |
|---|---|---|
| Admin | `ADMIN` | Accounts, audit logs, org units, self-service |
| TCCB (HR Dept) | `TCCB` | Full HR management, org units, config, contracts, training, reports |
| TCKT (Finance) | `TCKT` | Read-only HR profiles, reports, self-service |
| Employee | `EMPLOYEE` | Self-service only (own profile, own org, training registration) |
