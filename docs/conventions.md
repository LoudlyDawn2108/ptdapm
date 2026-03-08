# HRMS — Shared Conventions

> Architecture bible for all devs. Feed this to your coding agent alongside your dev assignment doc.
>
> **Stack**: Monorepo (Turborepo + Bun) · Elysia 1.4 · React 19 · Drizzle ORM · PostgreSQL

---

## 1. Backend — Elysia Route Pattern

Every module follows a **thin controller + service layer** architecture, colocated in the same folder:

```
modules/<module>/
  index.ts              → Route definitions (thin controller — validation + delegation)
  <module>.service.ts   → Business logic (queries, conflict checks, etc.)
  <module>.test.ts      → Tests (colocated with the module)
```

> **Reference implementation**: `modules/config/contract-types/` — full CRUD route + service. Copy this pattern for new modules.

**Key conventions**:
- **Validation**: Zod schemas from `@hrms/shared` in `body`/`params`/`query` options (Elysia 1.4 supports Zod natively via Standard Schema). Route-specific query extensions (e.g., `paginationSchema.extend(...)`) use `zod` directly in the route file.
- **Auth**: `.use(authPlugin)` once per route group — provides `{ auth: true }` option and exposes `user` + `session` in context. Plugin is deduplicated by name.
- **Role guard**: `requireRole(user.role, "ADMIN", "TCCB")` — throws `ForbiddenError`. No return value.
- **Error handling**: Throw `AppError` subclasses — global `errorPlugin` catches and returns `{ error: string }` with correct HTTP status.
- **Pagination**: `buildPaginatedResponse()` + `countRows()` from `common/utils/pagination.ts`.
- **Response shape**: Always wrap results in `{ data }`. Eden Treaty discriminates via `data` (non-null) vs `error` (non-null). No `success` field.
- **No explicit return types on handlers**: Let TypeScript infer from service layer.
- **Service layer**: All business logic in `*.service.ts`. Routes are thin controllers.
- Prefix all API routes with `/api/`
- Employee sub-entities nest under `/api/employees/:employeeId/<sub-entity>`

---

## 2. Backend — Folder Structure & Registering Routes

> **Reference**: See `apps/backend/src/index.ts` for route registration pattern, `common/` for shared infrastructure.

```
apps/backend/src/
├── common/                       # Shared infrastructure (all devs import from here)
│   ├── plugins/                  # auth.ts, db.ts, error-handler.ts, rate-limit.ts
│   ├── utils/                    # errors.ts, pagination.ts, role-guard.ts, user-context.ts
│   └── auth/index.ts             # better-auth config
├── db/
│   ├── index.ts                  # DB connection
│   ├── seed/                     # users.ts, roles.ts
│   └── schema/                   # Domain-grouped schemas (10 files, 27 tables)
├── modules/                      # Feature modules — each dev works here
│   ├── auth/                     # 🔐 Dev 1
│   ├── config/contract-types/    # 🏢 Dev 2 (reference CRUD implementation)
│   └── ...                       # See dev assignment docs for full module list
└── index.ts                      # App entry — registers all module routes
```

**Registering a new module**: Import routes in `src/index.ts` and `.use()` them. See existing registrations as pattern.

**Notes**:
- `errorPlugin` registered first with `{ as: "global" }` — catches errors from all child plugins
- `globalRateLimit` + `loginRateLimit` use `onRequest` hooks (before body parsing)
- `authPlugin` deduplicates by name — safe to `.use()` in multiple places
- Only `auth/` and `config/contract-types/` are currently implemented. **Do NOT create empty folders for future modules.**

---

## 3. Frontend — Route File Pattern (TanStack Router)

> **Reference**: See `apps/frontend/src/routes/` for existing route files.

```
apps/frontend/src/routes/
├── __root.tsx                          # Root layout
├── _authenticated.tsx                  # Auth guard layout
├── _authenticated/
│   ├── employees/index.tsx             # /employees (list)
│   ├── employees_/$employeeId.tsx      # Employee detail layout (tab navigation + <Outlet />)
│   ├── employees_/$employeeId/
│   │   ├── index.tsx                   # Default tab (personal info)
│   │   ├── family.tsx                  # /employees/:id/family
│   │   ├── contracts.tsx               # /employees/:id/contracts
│   │   └── ...                         # Each dev adds their tab files here
│   ├── config/...                      # Config pages
│   └── my/...                          # Self-service pages
└── login.tsx                           # /login (outside auth guard)
```

**Key conventions**:
- `_authenticated.tsx` = layout route that checks auth, redirects to `/login` if unauthenticated
- `employees_/$employeeId.tsx` = pathless layout for employee detail (tab nav + `<Outlet />`)
- Each dev adds their tab files into `$employeeId/`

---

## 4. Shared Package — Validators (DTOs)

> **Reference**: See `packages/shared/src/validators/config.ts` for validator pattern, `constants/enums.ts` for enum definitions.

**Key conventions**:
- All Zod schemas for entity CRUD go in `@hrms/shared` — used by both backend (validation) and frontend (form validation)
- Enum-typed arrays need explicit cast: `z.enum(CODES as [Code, ...Code[]])` — cast to specific union, not `string`
- Common schemas (`paginationSchema`, `idParamSchema`) in `validators/common.ts`
- `Input` types inferred from Zod with `z.infer<>`
- **Do NOT put entity interfaces in shared** — `Date` fields become `string` after JSON serialization. Backend gets types from Drizzle, frontend from Eden Treaty.

---

## 5. Drizzle Schema — Tables

> **Reference**: See `apps/backend/src/db/schema/contracts.ts` for table definition pattern.

**Key conventions**:
- `.$type<EnumCode>()` on all `varchar` columns storing enum codes — narrows type from `string` to union
- Always `{ withTimezone: true }` on timestamps
- Export `$inferSelect` / `$inferInsert` type aliases after every table definition:
  ```typescript
  export const contractTypes = pgTable("contract_types", { ... });
  export type ContractType = typeof contractTypes.$inferSelect;
  export type NewContractType = typeof contractTypes.$inferInsert;
  ```
- Schema ownership: Each dev owns their schema files. Coordinate before modifying another dev's table.

---

## 6. Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| DB table | `snake_case` (plural) | `employee_degrees` |
| DB column | `snake_case` | `full_name`, `created_at` |
| Drizzle table var | `camelCase` | `employeeDegrees` |
| TypeScript type | `PascalCase` | `EmployeeDegree` |
| Zod schema | `camelCase` + `Schema` | `createEmployeeDegreeSchema` |
| API endpoint | `kebab-case` | `/api/employees/:id/bank-accounts` |
| Route file | `kebab-case.tsx` | `bank-accounts.tsx` |
| Component | `PascalCase.tsx` | `EmployeeTable.tsx` |
| Store | `camelCase.ts` | `auth.ts` |
| Enum constant | `PascalCase` | `Gender`, `WorkStatus` |
| Enum key | `UPPER_SNAKE_CASE` | `GIANG_VIEN_CHINH` |

---

## 7. API Response Format

All endpoints return one of:

```typescript
// Single item
{ data: { id: "...", ... } }

// List (paginated)
{ data: { items: [...], total: 100, page: 1, pageSize: 20 } }

// Toast error (shown as toast notification on frontend)
{ type: "toast", error: "Mô tả lỗi bằng tiếng Việt" }

// Field error (shown inline on form inputs on frontend)
{ type: "field", error: "Dữ liệu không hợp lệ", fields: { "fieldName": "Lỗi cụ thể" } }
```

Eden Treaty: `const { data, error } = await api...get()`. Check `error` non-null for error path. No `success` field.

---

## 8. Error Handling

> **Reference**: See `common/utils/errors.ts` for error classes, `common/plugins/error-handler.ts` for the global handler, `@hrms/shared` types `ErrorResponse` for the discriminated union type.

- All errors have a `type` discriminator: `"toast"` (generic message) or `"field"` (per-field validation errors)
- Throw `AppError` subclasses for toast errors: `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409)
- Throw `FieldValidationError<T>` for service-level field errors — generic `T` constrains `fields` keys to the body type (compile-time safety)
- Elysia schema validation errors (body/query/params) are automatically converted to `"field"` type by `errorPlugin`
- **Always throw, never** `set.status` + return
- Role guard: `requireRole(user.role, "ADMIN", "TCCB")` — throws `ForbiddenError`

---

## 9. Frontend Architecture Plan

> **Status**: Planned — no design mockups yet.

### Tech Stack

| Layer | Library | Purpose |
|-------|---------|---------|
| Framework | React 19 | UI rendering |
| Routing | TanStack Router | File-based routing with type-safe params/search |
| State | Zustand | Client-side state (auth, UI) — NOT for server data |
| API Client | Eden Treaty | End-to-end type-safe API calls (derived from Elysia) |
| Forms | React Hook Form + Zod | Form state + validation (reuse `@hrms/shared` schemas) |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| UI Components | shadcn/ui (radix-maia style, zinc base) | Accessible primitives |
| Icons | Lucide React | Consistent icon set |
| Date | date-fns | Date formatting |

### Key Decisions

> **Reference**: See `apps/frontend/src/api/client.ts` for Eden Treaty setup, `stores/auth.ts` for Zustand pattern.

- **Eden Treaty** for all API calls — never raw `fetch`. Returns `{ data, error }`.
- **Zustand** for auth state + UI state only. One store per domain, not one global store.
- **React Hook Form + `zodResolver`** for forms — reuse `@hrms/shared` schemas.
- **shadcn/ui** for components — install via `npx shadcn@latest add <component>`.
- **Role-based UI**: Use `user.role` from auth store to conditionally render. Backend enforces via `requireRole()` — frontend checks are UX only.

### Auth Flow

1. App loads → `_authenticated.tsx` checks session via `/auth/session`
2. If authenticated → render sidebar + nav + `<Outlet />`
3. If 401 → redirect to `/login`
4. Login → `/auth/login` POST → store user → redirect to `/`
5. Logout → `/auth/logout` POST → clear user → redirect to `/login`

### TODO (When Design is Ready)

1. **Dev 1**: Login page form, `_authenticated.tsx` auth guard
2. **Dev 3**: Sidebar, top nav, page header, data table, form field wrappers
3. **All devs**: Implement assigned pages using shadcn/ui components

---

## 10. Environment Variables

```bash
# .env (root — used by backend via --env-file ../../.env)
DATABASE_URL=postgres://user:pass@localhost:5432/hrms
BETTER_AUTH_SECRET=your-secret-key-here
PORT=3000
FRONTEND_URL=http://localhost:5173

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

> **Reference**: See `packages/env/` for `@t3-oss/env-core` + Zod validation setup. All backend code uses `import { env } from "@hrms/env"` — never `process.env`.
