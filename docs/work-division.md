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

**Backend** (`apps/backend/src/routes/`):

| Route file | Endpoints |
|------------|-----------|
| `auth.ts` | `POST /auth/login`, `POST /auth/logout`, `GET /auth/session` |
| `accounts.ts` | CRUD `/api/accounts` (user management by ADMIN) |
| `audit-logs.ts` | `GET /api/audit-logs` (list, filter, export) |
| `files.ts` | `POST /api/files/upload`, `GET /api/files/:id` |
| `contracts.ts` | CRUD `/api/employees/:id/contracts`, `/api/employees/:id/contracts/:cid/appendices` |
| `degrees.ts` | CRUD `/api/employees/:id/degrees` |
| `certifications.ts` | CRUD `/api/employees/:id/certifications` |
| `foreign-permits.ts` | CRUD `/api/employees/:id/foreign-permits` |

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

**Backend** (`apps/backend/src/routes/`):

| Route file | Endpoints |
|------------|-----------|
| `org-units.ts` | CRUD `/api/org-units`, `POST /api/org-units/:id/merge`, `POST /api/org-units/:id/dissolve` |
| `assignments.ts` | CRUD `/api/employees/:id/assignments` |
| `config/salary-grades.ts` | CRUD `/api/config/salary-grades`, `/api/config/salary-grades/:id/steps` |
| `config/allowance-types.ts` | CRUD `/api/config/allowance-types` |
| `config/contract-types.ts` | CRUD `/api/config/contract-types` |
| `dashboard.ts` | `GET /api/dashboard/statistics` (aggregation queries) |

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

**Backend** (`apps/backend/src/routes/`):

| Route file | Endpoints |
|------------|-----------|
| `employees.ts` | CRUD `/api/employees`, `GET /api/employees/:id` (aggregate detail) |
| `family-members.ts` | CRUD `/api/employees/:id/family-members` |
| `bank-accounts.ts` | CRUD `/api/employees/:id/bank-accounts` |
| `previous-jobs.ts` | CRUD `/api/employees/:id/previous-jobs` |
| `party-memberships.ts` | CRUD `/api/employees/:id/party-memberships` |
| `allowances.ts` | CRUD `/api/employees/:id/allowances` |
| `employees-export.ts` | `GET /api/employees/:id/export`, `GET /api/employees/export` (list export) |

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

**Backend** (`apps/backend/src/routes/`):

| Route file | Endpoints |
|------------|-----------|
| `evaluations.ts` | CRUD `/api/employees/:id/evaluations` |
| `terminations.ts` | `POST /api/employees/:id/terminate`, `GET /api/employees/:id/termination` |
| `training-courses.ts` | CRUD `/api/training-courses`, `POST /api/training-courses/:id/open`, `/close`, etc. |
| `config/training-types.ts` | CRUD `/api/config/training-types` |
| `training-registrations.ts` | CRUD `/api/training-courses/:id/registrations` |
| `training-results.ts` | CRUD `/api/training-courses/:id/results` |
| `my/training.ts` | `GET /api/my/training` (self-service: own courses, register) |

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

Every route file follows this structure:

```typescript
// apps/backend/src/routes/<module>.ts
import { Elysia, t } from "elysia";
import { authPlugin } from "../plugins/auth";
import { dbPlugin } from "../plugins/db";

export const moduleRoutes = new Elysia({ prefix: "/api/<module>" })
  .use(dbPlugin)
  .use(authPlugin)
  .get("/", async ({ db, query }) => {
    // List with pagination
    const { page = 1, pageSize = 20, ...filters } = query;
    // ... query logic
    return { success: true, data: { items, total, page, pageSize } };
  }, {
    query: t.Object({
      page: t.Optional(t.Numeric()),
      pageSize: t.Optional(t.Numeric()),
      // ... filter params
    }),
  })
  .get("/:id", async ({ db, params }) => {
    // Get by ID
    return { success: true, data: item };
  })
  .post("/", async ({ db, body }) => {
    // Create
    return { success: true, data: created };
  }, {
    body: t.Object({ /* ... */ }),
  })
  .put("/:id", async ({ db, body, params }) => {
    // Update
    return { success: true, data: updated };
  })
  .delete("/:id", async ({ db, params }) => {
    // Delete
    return { success: true, data: { id: params.id } };
  });
```

**Key conventions**:
- Prefix all API routes with `/api/`
- Use `authPlugin` for all authenticated routes
- Return `ApiResponse<T>` shape: `{ success: boolean, data?: T, error?: string }`
- Return `PaginatedResponse<T>` for list endpoints: `{ items: T[], total, page, pageSize }`
- Use Elysia's `t.Object()` for request validation (mirrors Zod schemas from `@hrms/shared`)
- Employee sub-entities nest under `/api/employees/:employeeId/<sub-entity>`

### 8.2 Backend — Registering Routes

```typescript
// apps/backend/src/index.ts — Add your route import
import { moduleRoutes } from "./routes/module";

const app = new Elysia()
  // ... plugins
  .use(moduleRoutes)  // Add here
  .listen(process.env.PORT || 3000);
```

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

### 8.5 Shared Package — Adding Types and Validators

```typescript
// packages/shared/src/types/<module>.ts
export interface Employee {
  id: string;
  fullName: string;
  // ... fields matching DB schema
}

export interface CreateEmployeeRequest {
  fullName: string;
  // ... only writable fields
}

// packages/shared/src/validators/<module>.ts
import { z } from "zod";

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  // ... validation rules
});

// packages/shared/src/index.ts — Re-export
export * from "./types/<module>";
export * from "./validators/<module>";
```

### 8.6 Drizzle Schema — Adding/Modifying Tables

```typescript
// apps/backend/src/db/schema/<domain>.ts
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const myTable = pgTable("my_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// apps/backend/src/db/schema/index.ts — Re-export
export * from "./<domain>";
```

**Schema ownership**: Each dev owns their schema files. If you need to add a column to another dev's table, **coordinate first**.

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

All endpoints MUST return this shape (defined in `@hrms/shared`):

```typescript
// Single item
{ success: true, data: { id: "...", ... } }

// List (paginated)
{ success: true, data: { items: [...], total: 100, page: 1, pageSize: 20 } }

// Error
{ success: false, error: "Mô tả lỗi bằng tiếng Việt" }
```

### 8.9 Error Handling Pattern

```typescript
// Backend: Use Elysia's error handler
.onError(({ code, error, set }) => {
  if (code === "VALIDATION") {
    set.status = 400;
    return { success: false, error: error.message };
  }
  if (code === "NOT_FOUND") {
    set.status = 404;
    return { success: false, error: "Không tìm thấy dữ liệu" };
  }
  set.status = 500;
  return { success: false, error: "Lỗi hệ thống" };
})
```

### 8.10 Environment Variables

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
API: /api/<module> → { success, data/error }
```
