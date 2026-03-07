# HRMS — Phân công công việc & Quy ước phát triển

> **4 Full-Stack Developers** · **Monorepo (Turborepo + Bun)** · **Elysia + React + Drizzle**
>
> Phân chia theo **table/route ownership** — mỗi dev sở hữu toàn bộ stack (BE route → DB schema → FE page) cho các bảng được giao.

---

## Mục lục

1. [Tổng quan phân công](#1-tổng-quan-phân-công)
2. [Chi tiết Dev 1 — Auth + Hợp đồng + Bằng cấp/Chứng chỉ](#2-dev-1--auth--hợp-đồng--bằng-cấpchứng-chỉ)
3. [Chi tiết Dev 2 — Tổ chức + Cấu hình + Thống kê](#3-dev-2--tổ-chức--cấu-hình--thống-kê)
4. [Chi tiết Dev 3 — Nhân sự Core](#4-dev-3--nhân-sự-core)
5. [Chi tiết Dev 4 — Đào tạo + Đánh giá + Nghiệp vụ HR](#5-dev-4--đào-tạo--đánh-giá--nghiệp-vụ-hr)
6. [Phasing & Dependencies](#6-phasing--dependencies)
7. [Git Branching Strategy](#7-git-branching-strategy)
8. [Shared Conventions](#8-shared-conventions)
9. [Pending Spec Decisions (M1–M4)](#9-pending-spec-decisions-m1m4)

---

## 1. Tổng quan phân công

### Bảng tổng hợp

| Dev | Theme | Tables | Complexity | Pages |
|-----|-------|--------|------------|-------|
| **Dev 1** 🔐 | Auth + Hợp đồng + Bằng cấp/CC | 12 | **16 pts** | /login, /accounts, /audit-log, employee tabs (bằng cấp, chứng chỉ, GPLĐNN, hợp đồng) |
| **Dev 2** 🏢 | Tổ chức + Cấu hình + Thống kê | 7 | **15 pts** | /org-units, /config/*, /employees (list only), /dashboard, /my/org |
| **Dev 3** 👤 | Nhân sự Core | 6 | **16 pts** | Employee add, detail container + tabs (cá nhân, gia đình, ngân hàng, công tác, đảng/đoàn, phụ cấp), view/print/export, /my/profile |
| **Dev 4** 🎓 | Đào tạo + Đánh giá + Nghiệp vụ HR | 6 | **15 pts** | Employee tabs (đánh giá, thôi việc), training CRUD, self-service training |

### Complexity Scoring

| Size | Points | Definition |
|------|--------|------------|
| **S** | 1 | Simple CRUD, single table, no special UI |
| **M** | 2 | CRUD + validation logic, 2+ related tables, or complex UI (tree, tabs) |
| **L** | 3 | Multi-step workflow, complex state machine, or cross-module integration |

---

## 2. Dev 1 — 🔐 Auth + Hợp đồng + Bằng cấp/Chứng chỉ

**Theme**: Auth/Admin infrastructure + file upload system + document-heavy employee tabs

### Owned Tables (12)

| Table | Size | Notes |
|-------|------|-------|
| `auth_users` (user table) | M(2) | better-auth user entity with custom fields (role, status) |
| `auth_roles` | S(1) | Static role catalog |
| `session` | S(1) | better-auth managed — session CRUD |
| `account` | S(1) | better-auth managed — OAuth/credential accounts |
| `verification` | S(1) | better-auth managed — email verification |
| `audit_logs` | M(2) | Log listing + filtering + export |
| `files` | M(2) | File upload/download infrastructure — **shared by all devs** |
| `employment_contracts` | L(3) | Contract CRUD + status transitions + file attachments |
| `contract_appendices` | S(1) | Sub-entity of contracts |
| `employee_degrees` | S(1) | Employee tab: bằng cấp |
| `employee_certifications` | S(1) | Employee tab: chứng chỉ |
| `employee_foreign_work_permits` | S(1) | Employee tab: GPLĐNN |
| | **Total: 16** | |

### Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `auth/` | `POST /auth/login`, `POST /auth/logout`, `GET /auth/session` |
| `accounts/` | CRUD `/api/accounts` (user management by ADMIN) |
| `audit-logs/` | `GET /api/audit-logs` (list, filter, export) |
| `files/` | `POST /api/files/upload`, `GET /api/files/:id` |
| `contracts/` | CRUD `/api/employees/:id/contracts`, `/api/employees/:id/contracts/:cid/appendices` |
| `degrees/` | CRUD `/api/employees/:id/degrees` |
| `certifications/` | CRUD `/api/employees/:id/certifications` |
| `foreign-permits/` | CRUD `/api/employees/:id/foreign-permits` |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `login.tsx` | Login page |
| `_authenticated/accounts/index.tsx` | Account management |
| `_authenticated/audit-log/index.tsx` | Audit log viewer |
| `_authenticated/employees_/$employeeId/contracts.tsx` | Employee contract tab |
| `_authenticated/employees_/$employeeId/degrees.tsx` | Employee degrees tab |
| `_authenticated/employees_/$employeeId/certifications.tsx` | Employee certifications tab |
| `_authenticated/employees_/$employeeId/foreign-permits.tsx` | Employee foreign permits tab |

### Key Responsibilities

- **Auth flow end-to-end**: Login, logout, session management, auth guard middleware
- **File upload infrastructure**: Multipart upload, file storage, download — **other devs will reuse this**
- **RBAC middleware**: Route-level role checking (ADMIN, TCCB, TCKT, EMPLOYEE)

---

## 3. Dev 2 — 🏢 Tổ chức + Cấu hình + Thống kê

**Theme**: Organization tree + configuration catalogs + read-heavy pages

### ⚡ CRITICAL PATH

Dev 2 must deliver **Org Unit API** and **Config Catalog APIs** in Phase 1 — other devs depend on these for dropdown data (org unit picker, salary grade picker, contract type picker, etc.)

### Owned Tables (7)

| Table | Size | Notes |
|-------|------|-------|
| `org_units` | L(3) | Tree structure (parent_id), CRUD + merge/dissolve workflow |
| `org_unit_status_events` | M(2) | Event log for org unit state changes |
| `employee_assignments` | M(2) | Assignment/dismissal to org positions |
| `salary_grades` | S(1) | Config catalog: bậc lương |
| `salary_grade_steps` | S(1) | Config catalog: hệ số lương |
| `allowance_types` | S(1) | Config catalog: loại phụ cấp |
| `contract_types` | S(1) | Config catalog: loại hợp đồng |
| | **Total: 15** (includes 4 pts for dashboard/statistics) | |

### Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `org-units/` | CRUD `/api/org-units`, `POST /api/org-units/:id/merge`, `POST /api/org-units/:id/dissolve` |
| `assignments/` | CRUD `/api/employees/:id/assignments` |
| `config/salary-grades/` | CRUD `/api/config/salary-grades`, `/api/config/salary-grades/:id/steps` |
| `config/allowance-types/` | CRUD `/api/config/allowance-types` |
| `config/contract-types/` | CRUD `/api/config/contract-types` |
| `dashboard/` | `GET /api/dashboard/statistics` (aggregation queries) |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `_authenticated/org-units/index.tsx` | Org unit tree view + CRUD |
| `_authenticated/config/salary-grades.tsx` | Salary grade config |
| `_authenticated/config/allowance-types.tsx` | Allowance type config |
| `_authenticated/config/contract-types.tsx` | Contract type config |
| `_authenticated/employees/index.tsx` | Employee list page (**list only**, detail is Dev 3) |
| `_authenticated/employees_/$employeeId/assignments.tsx` | Employee assignment tab |
| `_authenticated/dashboard/index.tsx` | Dashboard with statistics |
| `_authenticated/my/org.tsx` | Self-service: view own org info |

### Key Responsibilities

- **Org unit tree UI**: Render hierarchical tree + drag-and-drop or manual move
- **Config catalog pattern**: Reusable CRUD pattern for all config tables (template for other devs)
- **Statistics dashboard**: Aggregation queries, chart components
- **Shared dropdown data APIs**: `/api/org-units/select`, `/api/config/*/select` (used by all)

---

## 4. Dev 3 — 👤 Nhân sự Core

**Theme**: Employee entity + personal sub-entity tabs + shared layout/UI components

### Owned Tables (6)

| Table | Size | Notes |
|-------|------|-------|
| `employees` | L(3) | Main entity — complex form with many fields, create + edit |
| `employee_family_members` | M(2) | Sub-entity tab with add/edit/delete |
| `employee_bank_accounts` | S(1) | Simple sub-entity tab |
| `employee_previous_jobs` | S(1) | Simple sub-entity tab |
| `employee_party_memberships` | M(2) | Sub-entity with date ranges, status tracking |
| `employee_allowances` | M(2) | Sub-entity linked to allowance_types (Dev 2's catalog) |
| | **Total: 16** (includes 5 pts for layout/components/view/export) | |

### Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `employees/` | CRUD `/api/employees`, `GET /api/employees/:id` (aggregate detail) |
| `family-members/` | CRUD `/api/employees/:id/family-members` |
| `bank-accounts/` | CRUD `/api/employees/:id/bank-accounts` |
| `previous-jobs/` | CRUD `/api/employees/:id/previous-jobs` |
| `party-memberships/` | CRUD `/api/employees/:id/party-memberships` |
| `allowances/` | CRUD `/api/employees/:id/allowances` |
| `employees-export/` | `GET /api/employees/:id/export`, `GET /api/employees/export` (list export) |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `_authenticated/employees_/$employeeId.tsx` | Employee detail **layout container** (tab navigation) |
| `_authenticated/employees_/$employeeId/index.tsx` | Personal info tab (default) |
| `_authenticated/employees_/$employeeId/family.tsx` | Family members tab |
| `_authenticated/employees_/$employeeId/bank-accounts.tsx` | Bank accounts tab |
| `_authenticated/employees_/$employeeId/work-history.tsx` | Previous jobs tab |
| `_authenticated/employees_/$employeeId/party.tsx` | Party memberships tab |
| `_authenticated/employees_/$employeeId/allowances.tsx` | Allowances tab |
| `_authenticated/employees/new.tsx` | Create new employee |
| `_authenticated/my/profile.tsx` | Self-service: view/edit own profile |

### Key Responsibilities

- **Employee detail layout**: Tab-based container layout — **all devs add their tabs into this layout**
- **Shared UI components**: Table component, form components, modal pattern, tab pattern
- **Employee view/print/export**: PDF/print view of employee record
- **Reusable sub-entity CRUD pattern**: Template for tab-level CRUD (used by Dev 1 and Dev 4)

---

## 5. Dev 4 — 🎓 Đào tạo + Đánh giá + Nghiệp vụ HR

**Theme**: Operational HR features + training lifecycle + DB infrastructure

### Owned Tables (6)

| Table | Size | Notes |
|-------|------|-------|
| `employee_evaluations` | M(2) | Reward/discipline with file attachments |
| `employee_terminations` | M(2) | Termination workflow with approval |
| `training_courses` | L(3) | Full CRUD + status workflow (draft → open → in_progress → completed → closed) |
| `training_course_types` | S(1) | Config catalog for training types |
| `training_registrations` | M(2) | Registration + approval workflow |
| `training_results` | M(2) | Result entry + pass/fail |
| | **Total: 15** (includes 3 pts for DB setup + self-service) | |

### Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `evaluations/` | CRUD `/api/employees/:id/evaluations` |
| `terminations/` | `POST /api/employees/:id/terminate`, `GET /api/employees/:id/termination` |
| `training-courses/` | CRUD `/api/training-courses`, `POST /api/training-courses/:id/open`, `/close`, etc. |
| `config/training-types/` | CRUD `/api/config/training-types` |
| `training-registrations/` | CRUD `/api/training-courses/:id/registrations` |
| `training-results/` | CRUD `/api/training-courses/:id/results` |
| `my/training/` | `GET /api/my/training` (self-service: own courses, register) |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `_authenticated/employees_/$employeeId/evaluations.tsx` | Employee evaluations tab |
| `_authenticated/training/index.tsx` | Training course list |
| `_authenticated/training/$courseId.tsx` | Training course detail + registrations + results |
| `_authenticated/config/training-types.tsx` | Training type config |
| `_authenticated/my/training.tsx` | Self-service: training courses + registration |

### Key Responsibilities

- **DB migration infrastructure**: Set up `drizzle-kit` workflow, seed data scripts, migration conventions
- **Training state machine**: Status transitions (draft → open_registration → in_progress → completed → closed)
- **Self-service training portal**: Employee registers for courses, views own results
- **Termination workflow**: Archive employee data, status transition

---

## 6. Phasing & Dependencies

### Phase 0 — Foundation (Week 1)

> **Goal**: Everyone can develop independently after this phase.

| Dev | Tasks | Deliverables |
|-----|-------|-------------|
| **Dev 1** | Auth flow (login/logout/session) + RBAC middleware | Working auth, `useAuth()` hook, route guards |
| **Dev 2** | Shared types/validators in `@hrms/shared` | Zod schemas for all entities, API type definitions |
| **Dev 3** | Layout shell + shared UI components | Sidebar nav, tab layout, table component, form primitives |
| **Dev 4** | DB migration setup + seed data | `drizzle-kit` workflow, dev seed script, migration conventions doc |

### Phase 1 — Core APIs (Week 2)

> **Goal**: All dropdown/dependency data available. Each dev has a working CRUD.

| Dev | Tasks | Deliverables | Blocks |
|-----|-------|-------------|--------|
| **Dev 1** | Account management + audit log | CRUD accounts, audit log viewer | — |
| **Dev 2** | Org unit CRUD + all config catalogs | Org tree API, salary/allowance/contract config | **⚡ Unblocks Dev 3 (dropdowns)** |
| **Dev 3** | Employee CRUD (create + list + detail container) | Employee form, detail layout with tabs | — |
| **Dev 4** | Training course CRUD + training types | Course CRUD with status workflow | — |

### Phase 2 — Feature Completion (Weeks 3–4)

> **Goal**: All tables/routes implemented. Each dev works on their assigned tabs/pages.

| Dev | Tasks |
|-----|-------|
| **Dev 1** | File upload, contracts tab, degrees tab, certs tab, foreign permits tab |
| **Dev 2** | Assignments, dashboard/statistics, employee list filters, /my/org |
| **Dev 3** | All personal tabs (family, bank, work history, party, allowances), export/print, /my/profile |
| **Dev 4** | Evaluations tab, termination, training registrations + results, /my/training |

### Phase 3 — Integration & Polish (Week 5)

> **Goal**: Cross-module integration, edge cases, UI polish.

| All Devs | Tasks |
|----------|-------|
| Cross-module | Integrate file upload into contracts, evaluations, etc. |
| Cross-module | Wire dropdown data from Dev 2's APIs into all forms |
| Cross-module | Employee detail view: all tabs work together |
| Polish | Error handling, loading states, empty states, responsive layout |
| Testing | Manual QA, fix bugs, edge cases |

### Dependency Graph

```
Phase 0:
  Dev 1 (auth) ──────────────────────────────► All devs (route guards)
  Dev 3 (layout) ────────────────────────────► All devs (UI components)
  Dev 4 (DB setup) ──────────────────────────► All devs (migrations)
  Dev 2 (shared types) ─────────────────────► All devs (Zod schemas)

Phase 1:
  Dev 2 (org + config APIs) ─────────────────► Dev 3 (dropdown data in employee form)
  Dev 1 (file upload) ──────────────────────► Dev 1, Dev 4 (file attachments)

Phase 2:
  Dev 3 (employee detail container) ────────► Dev 1, Dev 4 (add their tabs)
  Dev 2 (assignment API) ───────────────────► Dev 3 (employee org display)

Phase 3:
  All devs integrate and cross-test
```

---

## 7. Git Branching Strategy

### Branch Structure

```
main                          # Production-ready code (protected)
└── develop                   # Integration branch (protected)
    ├── feat/auth             # Dev 1: Auth + accounts + audit
    ├── feat/org-config       # Dev 2: Org units + config catalogs
    ├── feat/employee-core    # Dev 3: Employee entity + tabs
    └── feat/training-eval    # Dev 4: Training + evaluations
```

### Rules

| Rule | Description |
|------|-------------|
| **Branch naming** | `feat/<module>`, `fix/<module>-<desc>`, `chore/<desc>` |
| **Base branch** | Always branch from `develop` |
| **PR target** | Always PR into `develop` |
| **Merge strategy** | Squash merge for feature branches → `develop`. Merge commit for `develop` → `main`. |
| **PR review** | At least 1 other dev reviews before merge |
| **Conflict resolution** | Dev who merges later resolves conflicts |
| **Release** | Merge `develop` → `main` at end of each phase |

### Daily Workflow

```bash
# Start of day: sync with develop
git checkout develop
git pull origin develop
git checkout feat/my-module
git rebase develop              # Keep your branch up to date

# During work: commit often
git add -A
git commit -m "feat(module): description"

# End of day or feature complete: push + PR
git push origin feat/my-module
# Create PR on GitHub/GitLab → develop
```

### Commit Convention

```
<type>(<scope>): <description>

Types: feat, fix, chore, refactor, docs, style, test
Scope: auth, org, employee, training, config, shared, ui, db
```

**Examples**:
```
feat(auth): add login endpoint with better-auth session
feat(employee): add family members CRUD tab
fix(org): fix tree rendering with empty children
chore(db): add seed data for salary grades
refactor(shared): extract table component to shared UI
```

### Handling Shared Code Changes

When you need to modify shared code (`packages/shared/`, `apps/frontend/src/components/ui/`, etc.):

1. **Small changes** (adding a type, a new enum value): Include in your feature branch
2. **Large shared changes** (new shared component, new validator pattern): Create a separate branch `chore/shared-<desc>`, PR and merge to `develop` first, then rebase your feature branch
3. **Communicate**: Post in team chat before modifying shared code to avoid conflicts

---

## 8. Shared Conventions

### 8.1 Backend — Elysia Route Pattern

Every module follows a **thin controller + service layer** architecture, colocated in the same folder:

```
modules/<module>/
  index.ts              → Route definitions (thin controller — validation + delegation)
  <module>.service.ts   → Business logic (queries, conflict checks, etc.)
  <module>.test.ts      → Tests (colocated with the module)
```

**Route file (`index.ts`):**

```typescript
// apps/backend/src/modules/config/<module>/index.ts
import { createXxxSchema, idParamSchema, paginationSchema, updateXxxSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../../common/plugins/auth";
import { requireRole } from "../../../common/utils/role-guard";
import * as xxxService from "./xxx.service";

// Route-specific query extensions live in the route file, not in @hrms/shared
const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const xxxRoutes = new Elysia({ prefix: "/api/<module>" })
  .use(authPlugin)
  .get(
    "/",
    async ({ query }) => {
      const data = await xxxService.list(query.page, query.pageSize, query.search);
      return { data };
    },
    { auth: true, query: listQuerySchema },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await xxxService.getById(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  )
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await xxxService.create(body);
      return { data };
    },
    { auth: true, body: createXxxSchema },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await xxxService.update(params.id, body);
      return { data };
    },
    { auth: true, params: idParamSchema, body: updateXxxSchema },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
      const data = await xxxService.remove(params.id);
      return { data };
    },
    { auth: true, params: idParamSchema },
  );
```

**Service file (`xxx.service.ts`):**

```typescript
// apps/backend/src/modules/<module>/xxx.service.ts
import type { CreateXxxInput, PaginatedResponse, UpdateXxxInput } from "@hrms/shared";
import { type SQL, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { type Xxx, xxxTable } from "../../db/schema";
import { ConflictError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";

export async function list(
  page: number,
  pageSize: number,
  search?: string,
): Promise<PaginatedResponse<Xxx>> {
  const where: SQL | undefined = search
    ? ilike(xxxTable.name, `%${search}%`)
    : undefined;

  const [items, total] = await Promise.all([
    db.select().from(xxxTable).where(where)
      .limit(pageSize).offset((page - 1) * pageSize)
      .orderBy(xxxTable.createdAt),
    countRows(xxxTable, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<Xxx> {
  const [item] = await db.select().from(xxxTable).where(eq(xxxTable.id, id));
  if (!item) throw new NotFoundError("Không tìm thấy ...");
  return item;
}

export async function create(data: CreateXxxInput): Promise<Xxx> {
  // Conflict check (unique name, etc.)
  const existing = await db.select({ id: xxxTable.id }).from(xxxTable)
    .where(eq(xxxTable.name, data.name)).limit(1);
  if (existing.length > 0) throw new ConflictError("... đã tồn tại");

  const [created] = await db.insert(xxxTable).values(data).returning();
  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(id: string, data: UpdateXxxInput): Promise<Xxx> {
  await getById(id); // throws NotFoundError if missing
  const [updated] = await db.update(xxxTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(xxxTable.id, id)).returning();
  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string) {
  await getById(id);
  await db.delete(xxxTable).where(eq(xxxTable.id, id));
  return { id };
}
```

**Key conventions**:
- **Validation**: Use Zod schemas from `@hrms/shared` (Elysia 1.4 natively supports Zod via Standard Schema — no plugin needed). Route-specific query compositions (e.g., `paginationSchema.extend(...)`) can use `zod` directly in the route file.
- **Auth**: Use `authPlugin` once — it provides the `{ auth: true }` option and exposes `user` + `session` in the handler context. The plugin is deduplicated by name, so `.use(authPlugin)` in multiple places is safe.
- **Role guard**: Use `requireRole(user.role, "ADMIN", "TCCB")` — throws `ForbiddenError` if role is not allowed. No return value to check.
- **Error handling**: Throw `AppError` subclasses (`BadRequestError`, `NotFoundError`, `ConflictError`, `ForbiddenError`, `UnauthorizedError`) — the global `errorPlugin` catches them and returns `{ error: string }` with the correct HTTP status. Eden Treaty uses the `error` field (non-null) to discriminate success vs failure.
- **Pagination**: Use `buildPaginatedResponse()` + `countRows()` from `common/utils/pagination.ts`. Paginated responses always return `{ items: T[], total, page, pageSize }`.
- **No explicit return types on handlers**: Let TypeScript infer return types from the service layer. Drizzle returns `Date` objects for timestamps, which Elysia serializes to ISO strings in JSON responses. Always wrap the result in `{ data }` — Eden Treaty uses the presence of `data` vs `error` to discriminate success vs failure.
- **Service layer**: All business logic (DB queries, conflict checks, validation beyond Zod) lives in the module's `*.service.ts` file. Routes are thin controllers that delegate to services.
- Prefix all API routes with `/api/`
- Employee sub-entities nest under `/api/employees/:employeeId/<sub-entity>`

### 8.2 Backend — Folder Structure & Registering Routes

#### Folder Structure

```
apps/backend/src/
├── common/                              # Shared infrastructure (all devs import from here)
│   ├── plugins/
│   │   ├── auth.ts                      # Auth macro plugin ({ auth: true } option)
│   │   ├── db.ts                        # DB connection plugin
│   │   └── error-handler.ts             # Global errorPlugin
│   ├── utils/
│   │   ├── errors.ts                    # AppError, BadRequestError, NotFoundError, etc.
│   │   ├── pagination.ts               # withPagination, countRows, buildPaginatedResponse
│   │   ├── role-guard.ts               # requireRole (throw-based)
│   │   └── user-context.ts             # User context utilities
│   └── auth/
│       └── index.ts                     # better-auth config (betterAuth instance)
│
├── db/                                  # Database layer (shared infrastructure)
│   ├── index.ts                         # DB connection
│   ├── seed/
│   │   ├── users.ts
│   │   └── roles.ts
│   └── schema/                          # Domain-grouped schemas
│       ├── index.ts
│       ├── audit.ts
│       ├── auth.ts
│       ├── campuses.ts
│       ├── contracts.ts
│       ├── employees.ts
│       ├── evaluations.ts
│       ├── files.ts
│       ├── organization.ts
│       ├── salary.ts
│       └── training.ts
│
├── modules/                             # Feature modules — each dev works here
│   ├── auth/                            # 🔐 Dev 1 — Auth flow
│   │   ├── index.ts                     # Routes: POST /auth/login, /logout, GET /auth/session
│   │   ├── auth.service.ts
│   │   └── auth.test.ts
│   ├── accounts/                        # 🔐 Dev 1 — User account management (ADMIN)
│   │   ├── index.ts                     # Routes: CRUD /api/accounts
│   │   └── accounts.service.ts
│   ├── audit-logs/                      # 🔐 Dev 1 — Audit log viewer
│   │   ├── index.ts                     # Routes: GET /api/audit-logs
│   │   └── audit-logs.service.ts
│   ├── files/                           # 🔐 Dev 1 — File upload infrastructure (shared by all)
│   │   ├── index.ts                     # Routes: POST /api/files/upload, GET /api/files/:id
│   │   └── files.service.ts
│   ├── contracts/                       # 🔐 Dev 1 — Employment contracts + appendices
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/contracts, .../appendices
│   │   └── contracts.service.ts
│   ├── degrees/                         # 🔐 Dev 1 — Employee degrees tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/degrees
│   │   └── degrees.service.ts
│   ├── certifications/                  # 🔐 Dev 1 — Employee certifications tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/certifications
│   │   └── certifications.service.ts
│   ├── foreign-permits/                 # 🔐 Dev 1 — Employee foreign work permits tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/foreign-permits
│   │   └── foreign-permits.service.ts
│   ├── org-units/                       # 🏢 Dev 2 — Organization tree
│   │   ├── index.ts                     # Routes: CRUD /api/org-units, merge, dissolve
│   │   └── org-units.service.ts
│   ├── assignments/                     # 🏢 Dev 2 — Employee assignments to org positions
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/assignments
│   │   └── assignments.service.ts
│   ├── config/                          # Config catalogs (5 catalogs, same CRUD pattern)
│   │   ├── contract-types/              # 🏢 Dev 2
│   │   │   ├── index.ts                 # Routes: CRUD /api/config/contract-types
│   │   │   └── contract-type.service.ts
│   │   ├── allowance-types/             # 🏢 Dev 2
│   │   │   ├── index.ts                 # Routes: CRUD /api/config/allowance-types
│   │   │   └── allowance-type.service.ts
│   │   ├── salary-grades/               # 🏢 Dev 2
│   │   │   ├── index.ts                 # Routes: CRUD /api/config/salary-grades + steps
│   │   │   └── salary-grade.service.ts
│   │   ├── training-types/              # 🎓 Dev 4 (same config pattern)
│   │   │   ├── index.ts                 # Routes: CRUD /api/config/training-types
│   │   │   └── training-type.service.ts
│   │   └── campuses/                    # Campus config
│   │       ├── index.ts                 # Routes: CRUD /api/config/campuses
│   │       └── campus.service.ts
│   ├── dashboard/                       # 🏢 Dev 2 — Statistics dashboard
│   │   ├── index.ts                     # Routes: GET /api/dashboard/statistics
│   │   └── dashboard.service.ts
│   ├── employees/                       # 👤 Dev 3 — Employee core entity
│   │   ├── index.ts                     # Routes: CRUD /api/employees, GET /api/employees/:id
│   │   └── employees.service.ts
│   ├── family-members/                  # 👤 Dev 3 — Employee family tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/family-members
│   │   └── family-members.service.ts
│   ├── bank-accounts/                   # 👤 Dev 3 — Employee bank accounts tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/bank-accounts
│   │   └── bank-accounts.service.ts
│   ├── previous-jobs/                   # 👤 Dev 3 — Employee work history tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/previous-jobs
│   │   └── previous-jobs.service.ts
│   ├── party-memberships/               # 👤 Dev 3 — Employee party/union memberships tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/party-memberships
│   │   └── party-memberships.service.ts
│   ├── allowances/                      # 👤 Dev 3 — Employee allowances tab
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/allowances
│   │   └── allowances.service.ts
│   ├── employees-export/                # 👤 Dev 3 — Employee export/print
│   │   ├── index.ts                     # Routes: GET /api/employees/:id/export, /api/employees/export
│   │   └── employees-export.service.ts
│   ├── evaluations/                     # 🎓 Dev 4 — Employee evaluations (reward/discipline)
│   │   ├── index.ts                     # Routes: CRUD /api/employees/:id/evaluations
│   │   └── evaluations.service.ts
│   ├── terminations/                    # 🎓 Dev 4 — Employee termination workflow
│   │   ├── index.ts                     # Routes: POST /api/employees/:id/terminate
│   │   └── terminations.service.ts
│   ├── training-courses/                # 🎓 Dev 4 — Training course lifecycle
│   │   ├── index.ts                     # Routes: CRUD /api/training-courses + status transitions
│   │   └── training-courses.service.ts
│   ├── training-registrations/          # 🎓 Dev 4 — Training registrations
│   │   ├── index.ts                     # Routes: CRUD /api/training-courses/:id/registrations
│   │   └── training-registrations.service.ts
│   ├── training-results/                # 🎓 Dev 4 — Training results
│   │   ├── index.ts                     # Routes: CRUD /api/training-courses/:id/results
│   │   └── training-results.service.ts
│   └── my/                              # Self-service routes (multiple devs contribute)
│       ├── training.ts                  # 🎓 Dev 4: GET /api/my/training
│       ├── profile.ts                   # 👤 Dev 3: GET/PUT /api/my/profile
│       └── org.ts                       # 🏢 Dev 2: GET /api/my/org
│
└── index.ts                             # App entry — registers all module routes
```

> **Note**: Only `auth/` and `config/contract-types/` are currently implemented. All other modules above are planned — create them following the same pattern (see Section 8.1) when you start working on them. **Do NOT create empty folders or files in advance.**

#### Registering Routes

```typescript
// apps/backend/src/index.ts
import { authRoutes } from "./modules/auth";
import { contractTypeRoutes } from "./modules/config/contract-types";

const app = new Elysia()
  .use(cors({ origin: env.FRONTEND_URL, credentials: true }))
  .use(swagger())
  .use(errorPlugin)    // Global error handler — must be first
  .use(dbPlugin)       // DB connection
  .use(authPlugin)     // Auth macro + better-auth handler
  .get("/", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(authRoutes)     // /auth/login, /auth/logout, /auth/session
  .use(contractTypeRoutes)  // /api/config/contract-types — add your routes here
  .listen(env.PORT);
```

**Notes**:
- `errorPlugin` should be registered before all routes — it uses `{ as: "global" }` to catch errors from all child plugins.
- `authPlugin` provides the `{ auth: true }` option to all subsequent routes. Routes that `.use(authPlugin)` internally will deduplicate (Elysia deduplicates plugins by `name`).
- When adding a new module, import its routes in `index.ts` and `.use()` it. Module routes live in `modules/<module>/index.ts`.

### 8.3 Frontend — Route File Pattern (TanStack Router)

```
apps/frontend/src/routes/
├── __root.tsx                          # Root layout
├── _authenticated.tsx                  # Auth guard layout
├── _authenticated/
│   ├── dashboard/
│   │   └── index.tsx                   # /dashboard
│   ├── employees/
│   │   ├── index.tsx                   # /employees (list)
│   │   └── new.tsx                     # /employees/new
│   ├── employees_/
│   │   └── $employeeId.tsx             # /employees/:id (detail layout with tabs)
│   │   └── $employeeId/
│   │       ├── index.tsx               # Default tab (personal info)
│   │       ├── family.tsx              # /employees/:id/family
│   │       ├── contracts.tsx           # /employees/:id/contracts
│   │       └── ...                     # Other tabs
│   ├── training/
│   │   ├── index.tsx                   # /training (list)
│   │   └── $courseId.tsx               # /training/:id (detail)
│   ├── org-units/
│   │   └── index.tsx                   # /org-units
│   ├── config/
│   │   ├── salary-grades.tsx           # /config/salary-grades
│   │   └── ...
│   └── my/
│       ├── profile.tsx                 # /my/profile
│       ├── org.tsx                     # /my/org
│       └── training.tsx               # /my/training
└── login.tsx                           # /login (outside auth guard)
```

**Key conventions**:
- `_authenticated.tsx` = layout route that checks auth and redirects to `/login` if not authenticated
- `_authenticated/` = directory for all protected routes
- `employees_/$employeeId.tsx` = pathless layout for employee detail (renders tab navigation + `<Outlet />`)
- `employees_/$employeeId/index.tsx` = default tab
- Each dev adds their tab files into the `$employeeId/` directory

### 8.4 Frontend — Page Component Pattern

```tsx
// apps/frontend/src/routes/_authenticated/<module>/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/<module>/")({
  component: ModulePage,
});

function ModulePage() {
  // Use Eden treaty client for data fetching
  // const { data } = api.api.module.get({ query: { page: 1 } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Module Title</h1>
        <Button>Thêm mới</Button>
      </div>
      {/* Table / Content */}
    </div>
  );
}
```

### 8.5 Shared Package — Adding Validators (DTOs)

The shared package contains **validators/DTOs only** — no entity interface types. Backend gets entity types from Drizzle inference, frontend gets them from Eden Treaty inference.

```typescript
// packages/shared/src/validators/<module>.ts
import { z } from "zod";
import { type CatalogStatusCode, CATALOG_STATUS_CODES } from "../constants/enums";

const catalogStatusSchema = z.enum(
  CATALOG_STATUS_CODES as [CatalogStatusCode, ...CatalogStatusCode[]],
);

export const createContractTypeSchema = z.object({
  contractTypeName: z.string().min(1, "Tên loại hợp đồng không được để trống"),
  minMonths: z.number().int().min(0),
  maxMonths: z.number().int().min(1),
  maxRenewals: z.number().int().min(0),
  renewalGraceDays: z.number().int().min(0),
});

export type CreateContractTypeInput = z.infer<typeof createContractTypeSchema>;

export const updateContractTypeSchema = createContractTypeSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateContractTypeInput = z.infer<typeof updateContractTypeSchema>;

// packages/shared/src/validators/index.ts — Re-export
export * from "./<module>";
```

**Key conventions**:
- All Zod schemas for entity CRUD go in `@hrms/shared` — they are used by both backend (validation) and frontend (form validation).
- Enum-typed arrays need explicit cast for `z.enum()`: `z.enum(CODES as [Code, ...Code[]])` — cast to the specific union, not `string`.
- Common schemas (`paginationSchema`, `idParamSchema`) live in `validators/common.ts`.
- `Input` types (e.g., `CreateContractTypeInput`) are inferred from Zod with `z.infer<>`.
- **Do NOT put entity interfaces in shared** — `Date` fields become `string` after JSON serialization, making a single interface wrong for one side. Let each layer infer its own types.

### 8.6 Drizzle Schema — Adding/Modifying Tables

```typescript
// apps/backend/src/db/schema/<domain>.ts
import type { CatalogStatusCode } from "@hrms/shared";
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const myTable = pgTable("my_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  // Use .$type<EnumCode>() for compile-time safety on enum-like varchar columns
  status: varchar("status", { length: 20 }).$type<CatalogStatusCode>().notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// apps/backend/src/db/schema/index.ts — Re-export
export * from "./<domain>";
```

**Key conventions**:
- Use `.$type<XxxCode>()` on all `varchar` columns that store enum codes (defined in `packages/shared/src/constants/enums.ts`). This narrows the Drizzle select type from `string` to the union type, preventing type mismatches in the service layer.
- Always use `{ withTimezone: true }` on timestamps.
- **Export `$inferSelect` and `$inferInsert` type aliases** after every table definition. This gives clean named types in IDE hover tooltips instead of expanded inline fields. Use them as explicit return types in service functions.
  ```typescript
  export const contractTypes = pgTable("contract_types", { ... });
  export type ContractType = typeof contractTypes.$inferSelect;
  export type NewContractType = typeof contractTypes.$inferInsert;
  ```
- Schema ownership: Each dev owns their schema files. If you need to add a column to another dev's table, **coordinate first**.

### 8.7 Naming Conventions

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
| Store | `camelCase.ts` | `auth.ts` (Zustand slice) |
| Enum constant | `PascalCase` | `Gender`, `WorkStatus` |
| Enum key | `UPPER_SNAKE_CASE` | `GIANG_VIEN_CHINH` |

### 8.8 API Response Format

All endpoints MUST return this shape:

```typescript
// Single item
{ data: { id: "...", ... } }

// List (paginated)
{ data: { items: [...], total: 100, page: 1, pageSize: 20 } }

// Error (returned by errorPlugin, not route handlers)
{ error: "Mô tả lỗi bằng tiếng Việt" }
```

**Eden Treaty discrimination**: On the frontend, `const { data, error } = await api...get()`. If `error` is non-null → error path. If `data` is non-null → success path. No `success` field needed.

### 8.9 Error Handling Pattern

**Throw-based errors**: Throw `AppError` subclasses in service layer or route handlers. The global `errorPlugin` catches them and returns the correct HTTP status + JSON body.

```typescript
// Available error classes (apps/backend/src/common/utils/errors.ts):
import {
  BadRequestError,    // 400
  UnauthorizedError,  // 401
  ForbiddenError,     // 403
  NotFoundError,      // 404
  ConflictError,      // 409
} from "../../common/utils/errors";

// Usage in services:
if (!item) throw new NotFoundError("Không tìm thấy dữ liệu");
if (exists) throw new ConflictError("Loại hợp đồng đã tồn tại");

// Usage in routes (role guard):
import { requireRole } from "../../common/utils/role-guard";
requireRole(user.role, "ADMIN", "TCCB");  // throws ForbiddenError if not allowed
```

**Error response shape** (automatic via `errorPlugin`):
```json
{ "error": "Mô tả lỗi bằng tiếng Việt" }
```

**DO NOT** use `set.status` + return in route handlers. Always throw.

### 8.10 Frontend Architecture Plan

> **Status**: Planned — no design mockups yet. This documents the architecture decisions so all devs can implement consistently once design is ready.

#### Tech Stack

| Layer | Library | Version | Purpose |
|-------|---------|---------|---------|
| Framework | React | 19.0.0 | UI rendering |
| Routing | TanStack Router | 1.163.3 | File-based routing with type-safe params/search |
| State | Zustand | 5.0.3 | Client-side state (auth, UI state) |
| API Client | Eden Treaty | 1.2.0 | End-to-end type-safe API calls (derived from Elysia backend) |
| Forms | React Hook Form + Zod | 7.54.2 + 4.3.6 | Form state + validation (reuse `@hrms/shared` schemas) |
| Styling | Tailwind CSS 4 | 4.1.8 | Utility-first CSS |
| UI Components | shadcn/ui (Radix) | radix-maia style | Accessible, composable primitives |
| Icons | Lucide React | 0.577.0 | Consistent icon set |
| Date | date-fns | 4.1.0 | Date formatting/manipulation |

#### Project Structure

```
apps/frontend/src/
├── api/
│   └── client.ts               # Eden Treaty client (already exists)
├── components/
│   ├── ui/                      # shadcn/ui primitives (Button, Input, Dialog, etc.)
│   ├── layout/                  # Sidebar, TopNav, PageHeader, AuthGuard
│   ├── data-table/              # Reusable table with sorting, pagination, filtering
│   └── forms/                   # Reusable form field wrappers (FormInput, FormSelect, FormDatePicker)
├── hooks/
│   ├── use-pagination.ts        # Pagination state hook (synced with URL search params)
│   └── use-confirm.ts           # Confirmation dialog hook
├── lib/
│   └── utils.ts                 # cn() helper (already exists)
├── stores/
│   ├── auth.ts                  # Auth state — user, login/logout (already exists)
│   └── index.ts                 # Barrel export (already exists)
├── routes/                      # TanStack Router file-based routes (see 8.3)
│   ├── __root.tsx               # Root layout (already exists)
│   ├── login.tsx                # Login page (already exists)
│   ├── index.tsx                # Home/redirect (already exists)
│   ├── _authenticated.tsx       # Auth guard layout (to be built)
│   └── _authenticated/          # All protected routes (see 8.3 for full tree)
└── main.tsx                     # App entry (already exists)
```

#### API Client (Eden Treaty)

Eden Treaty provides end-to-end type safety by importing the backend's `App` type:

```typescript
// apps/frontend/src/api/client.ts (already exists)
import { treaty } from "@elysiajs/eden";
import type { App } from "@hrms/backend";

export const api = treaty<App>(import.meta.env.VITE_API_URL ?? "http://localhost:3000");
```

**Usage in components:**

```typescript
// Type-safe API calls — params, body, query are all typed from the backend route definitions
const { data, error } = await api.api.config["contract-types"].get({
  query: { page: 1, pageSize: 20, search: "..." },
});

// data.data is typed as the backend's return type
// error is typed with the error response shape
```

**Conventions:**
- Always use `api` from `@/api/client` — never raw `fetch`
- Eden Treaty derives types from the backend — when backend routes change, frontend types update automatically (via `@hrms/backend` workspace dependency)
- Eden returns `{ data, error }` — if `error` is non-null, it's an error response. No `success` field to check.

#### State Management (Zustand)

**When to use Zustand:**
- Auth state (current user, session) → `stores/auth.ts`
- UI state shared across routes (sidebar collapsed, theme) → `stores/ui.ts`
- **NOT** for server data — use Eden Treaty calls directly (no client-side cache layer for now)

**Store pattern:**

```typescript
// stores/<domain>.ts
import { create } from "zustand";

interface XxxState {
  someValue: string;
  setSomeValue: (value: string) => void;
}

export const useXxxStore = create<XxxState>((set) => ({
  someValue: "",
  setSomeValue: (value) => set({ someValue: value }),
}));
```

**Conventions:**
- One store per domain (auth, ui), not one global store
- Export individual hooks (`useAuthStore`, `useUiStore`), re-export from `stores/index.ts`
- Keep stores minimal — only state that needs to survive route navigation

#### Auth Flow

```
1. App loads → _authenticated.tsx layout checks session
2. Call api.auth.session.get() → returns user or 401
3. If user → setUser(user) in authStore → render <Outlet />
4. If 401 → redirect to /login
5. Login page → api.auth.login.post({ body }) → setUser → redirect to /
6. Logout → api.auth.logout.post() → clearUser → redirect to /login
```

**Auth guard layout** (`_authenticated.tsx`):
- Calls `/auth/session` on mount
- Shows loading spinner while checking
- Redirects to `/login` if not authenticated
- Renders sidebar + top nav + `<Outlet />` when authenticated

**Role-based UI:**
- Use `user.role` from `useAuthStore` to conditionally render menu items and action buttons
- Backend enforces role checks via `requireRole()` — frontend role checks are for UX only, not security

#### Form Handling (React Hook Form + Zod)

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { createContractTypeSchema, type CreateContractTypeInput } from "@hrms/shared";
import { useForm } from "react-hook-form";

function CreateContractTypeForm() {
  const form = useForm<CreateContractTypeInput>({
    resolver: zodResolver(createContractTypeSchema),
    defaultValues: { contractTypeName: "", minMonths: 0, ... },
  });

  const onSubmit = async (data: CreateContractTypeInput) => {
    const { error } = await api.api.config["contract-types"].post({ body: data });
    if (error) { /* show error toast — error.value has { error: string } */ }
    // success → close dialog, refresh list
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

**Conventions:**
- Reuse Zod schemas from `@hrms/shared` — same validation on frontend and backend
- Use `zodResolver` from `@hookform/resolvers` to connect Zod → React Hook Form
- Form components in `components/forms/` wrap shadcn/ui inputs with React Hook Form's `Controller`/`register`

#### Component Conventions

**Shared UI (Dev 3 builds, all devs use):**
- `components/ui/` — shadcn/ui primitives (install via `npx shadcn@latest add <component>`)
- `components/data-table/` — Reusable table with column definitions, sorting, pagination
- `components/forms/` — Form field wrappers connected to React Hook Form
- `components/layout/` — Sidebar, TopNav, PageHeader

**Page-level components:**
- Each route file is self-contained — defines its own page component
- Extract reusable sub-components within the same route file, or into `components/<module>/` if shared across routes
- Tab components for employee detail live in their own route files (see 8.3)

**Naming:**
- Components: `PascalCase.tsx` (e.g., `DataTable.tsx`, `PageHeader.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-pagination.ts`)
- Stores: `camelCase.ts` (e.g., `auth.ts`)

#### shadcn/ui Configuration

Already configured with `radix-maia` style, `zinc` base color, Lucide icons:

```json
{
  "style": "radix-maia",
  "rsc": false,
  "tailwind": { "baseColor": "zinc", "cssVariables": true },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "hooks": "@/hooks",
    "lib": "@/lib"
  }
}
```

**Adding components:** `npx shadcn@latest add button input dialog table` — installs into `src/components/ui/`.

#### TODO (When Design is Ready)

1. **Dev 1**: Build login page with actual form, implement `_authenticated.tsx` auth guard
2. **Dev 3**: Build sidebar navigation, top nav, page header, data table, form field wrappers
3. **All devs**: Install needed shadcn/ui components and implement their assigned pages
4. Decide on data fetching strategy (direct Eden calls vs. TanStack Query wrapper) based on complexity needs

### 8.11 Environment Variables

```bash
# .env (local development)
DATABASE_URL=postgres://user:pass@localhost:5432/hrms
BETTER_AUTH_SECRET=your-secret-key-here
PORT=3000
FRONTEND_URL=http://localhost:5173

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

---

## Appendix: Quick Reference Card

```
┌────────────────────────────────────────────────────────┐
│  Dev 1 🔐  Auth + HĐ + Bằng cấp       (16 pts)       │
│  Tables: auth_*, audit_logs, files, contracts,          │
│          degrees, certifications, foreign_permits        │
│  Phase 0: Auth flow    Phase 1: Accounts + Audit        │
├────────────────────────────────────────────────────────┤
│  Dev 2 🏢  Tổ chức + Config + Stats    (15 pts)        │
│  Tables: org_units, org_events, assignments,             │
│          salary_grades, allowance_types, contract_types  │
│  Phase 0: Shared types  Phase 1: Org + Config ⚡        │
├────────────────────────────────────────────────────────┤
│  Dev 3 👤  Nhân sự Core                (16 pts)        │
│  Tables: employees, family, bank, prev_jobs,             │
│          party, allowances                               │
│  Phase 0: Layout + UI  Phase 1: Employee CRUD           │
├────────────────────────────────────────────────────────┤
│  Dev 4 🎓  Đào tạo + Đánh giá          (15 pts)       │
│  Tables: evaluations, terminations, training_courses,    │
│          training_types, registrations, results          │
│  Phase 0: DB setup     Phase 1: Training CRUD           │
└────────────────────────────────────────────────────────┘

Branch: feat/<module> → develop → main
Commit: <type>(<scope>): <description>
API: /api/<module> → { data } | { error }
```
