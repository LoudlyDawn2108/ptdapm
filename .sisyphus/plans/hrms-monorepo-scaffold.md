# HRMS Monorepo Base Structure — Project Scaffold

## TL;DR

> **Quick Summary**: Set up a production-ready Bun monorepo for the HRMS (Human Resource Management System) of Thuy Loi University, with ElysiaJS backend, React + Shadcn UI frontend, and shared TypeScript packages — all wired together with end-to-end type safety via Eden Treaty.
>
> **Deliverables**:
> - Complete monorepo folder structure with Bun workspaces + Turborepo
> - Backend skeleton: ElysiaJS + Drizzle ORM (ALL 30+ tables) + better-auth (DB sessions, HTTP-only cookie, 30-min sliding expiry)
> - Frontend skeleton: Vite + React + TanStack Router + Shadcn UI + Tailwind CSS v4
> - Shared package: TypeScript types + Zod validators (auth only)
> - Dev tooling: Biome, TypeScript strict mode, VS Code settings
> - Eden Treaty type-safe API client wired between frontend and backend
>
> **Estimated Effort**: Medium-Large (6-10 hours)
> **Task Count**: 8 tasks

---

## Context

### Original Request
Build the base monorepo structure for an HRMS application serving Thuy Loi University. The project needs ElysiaJS backend, React SPA frontend, and shared code between them. Focus on folder organization, config files, library selection, and development workflow — no feature implementation.

### Interview Summary
**Key Discussions**:
- User provided comprehensive requirements document with 11 stakeholder requirements → 40+ features
- Database schema already exists (`database/schema.revised.postgres.sql` — 30+ tables, 799 lines, PostgreSQL)
- 4 user roles: ADMIN, TCCB (HR), TCKT (Finance), EMPLOYEE
- Vietnamese-only interface, on-premise deployment, 500 concurrent users
- **UI Framework**: Shadcn UI (Radix UI + Tailwind CSS v4) — NOT Ant Design
- **Drizzle Schema**: Full conversion of ALL 30+ tables
- **Frontend Approach**: Fresh start — ignore any existing frontend code
- **Tests**: No test infrastructure in scaffold phase

**Research Findings**:
- **ElysiaJS**: Plugin-based modular architecture, guard patterns for route groups, Eden Treaty for e2e type safety
- **Drizzle ORM**: Multi-file schema organization by domain, explicit column mapping (NOT global `casing`), postgres-js driver for Bun
- **TanStack Router**: File-based routing with Vite plugin, `createFileRoute` pattern, route context for auth injection
- **Shadcn UI**: Components in `src/components/ui/`, Tailwind CSS v4 with `@tailwindcss/vite` plugin + CSS-only config, `@theme inline` bridge for CSS variables
- **better-auth**: DB session-based auth, requires mapping to existing `auth_users` table via `modelName` + field mappings, session/account/verification tables already in SQL schema
- **Bun Workspaces**: `workspace:*` protocol, shared package via `exports` field
- **Turborepo**: `dependsOn: ["^build"]` for dependency-aware task orchestration
- **Biome**: Replaces ESLint + Prettier, `extends: "//"` for monorepo configs

### Metis Review
**Identified Gaps** (addressed):
- **better-auth ↔ `auth_users` mismatch**: Resolved via `modelName: "auth_users"`, field mappings for `name→full_name`, `additionalFields` for custom columns. Add `emailVerified`/`image` as nullable to Drizzle schema.
- **Drizzle global `casing` breaks better-auth tables**: Resolved by using explicit column name mapping per-table instead of global `casing: 'snake_case'`.
- **Session sliding expiry config**: Resolved with `expiresIn: 30 * 60` + `updateAge: 0` for true 30-minute sliding window.
- **Materialized views**: Skipped in Drizzle (not natively supported). Documented as future raw SQL work.
- **Drizzle relations scope**: Limited to 2-3 example tables (auth + employees) to prevent scope creep.
- **Zod validators scope**: Limited to auth-related schemas only.
- **npm scope**: Using `@hrms` (domain-descriptive, consistent with draft plan). [DECISION NEEDED: confirm `@hrms` or override]
- **TanStack Router plugin order**: Must be placed BEFORE `react()` in Vite config.
- **Eden Treaty version pinning**: Both apps must have identical `elysia` version.
- **FK ordering in SQL**: `auth_roles` must be declared before `auth_users` in Drizzle `auth.ts`.

---

## Work Objectives

### Core Objective
Create a fully working monorepo scaffold where `bun install && bun run dev` starts both backend and frontend servers, with shared types flowing end-to-end through Eden Treaty.

### Concrete Deliverables
- Root monorepo configuration (5 files: `package.json`, `turbo.json`, `biome.json`, `tsconfig.json`, `.env.example`)
- `apps/backend/` — ElysiaJS application skeleton with FULL Drizzle schema (30+ tables) (~15 files)
- `apps/frontend/` — React SPA skeleton with Shadcn UI + Tailwind CSS v4 (~15 files)
- `packages/shared/` — Shared types and validators (5+ files)
- `.vscode/settings.json` — Workspace settings for Biome

### Definition of Done
- [ ] `bun install` completes without errors
- [ ] `bun run dev` starts both backend (port 3000) and frontend (port 5173)
- [ ] `bun run type-check` passes across all workspaces
- [ ] `bun run lint` passes with zero errors
- [ ] `bun run build` completes for all packages
- [ ] Shared types are importable from both backend and frontend
- [ ] Eden Treaty client compiles without type errors
- [ ] Existing files (`enums.ts`, SQL schema, docs) are untouched

### Must Have
- Bun workspaces with `workspace:*` references
- Turborepo task orchestration with `turbo.json`
- Biome linter/formatter (NOT ESLint/Prettier)
- TypeScript strict mode
- ElysiaJS with plugin architecture (auth, CORS, swagger)
- better-auth integration for DB-session-based auth:
  - `modelName: "auth_users"` with field mappings (`name→full_name`)
  - `additionalFields` for `username`, `employee_id`, `role_id`, `status`, `last_login_at`
  - Sessions stored in `session` table
  - HTTP-only cookie (`__session`) for session token
  - 30-minute sliding expiration (`expiresIn: 1800`, `updateAge: 0`)
- Drizzle ORM with ALL tables from `database/schema.revised.postgres.sql` converted
- TanStack Router file-based routing with Vite plugin (BEFORE `react()`)
- Shadcn UI initialized with `components.json` + Tailwind CSS v4 (`@theme inline` bridge)
- react-hook-form + `@hookform/resolvers/zod`
- `date-fns` with `vi` locale
- Zustand store skeleton with slices pattern
- Eden Treaty type-safe API client
- `.env.example` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `PORT`
- Pinned dependency versions in all `package.json` files

### Must NOT Have (Guardrails)
- ❌ No business logic in route handlers (placeholder responses only)
- ❌ No database migration execution (config files yes, `drizzle-kit push` no)
- ❌ No Ant Design (pure Shadcn UI + Tailwind CSS v4)
- ❌ No `tailwind.config.js` (Tailwind v4 uses CSS-only config)
- ❌ No Docker/docker-compose files
- ❌ No CI/CD pipelines
- ❌ No test framework setup or test files
- ❌ No README.md per subdirectory (root README only if needed)
- ❌ No JSDoc on empty skeleton files
- ❌ No utility functions not needed yet (`formatDate`, `capitalize`, etc.)
- ❌ No error handling middleware beyond basic structure
- ❌ No custom hooks in shared package
- ❌ No seed data scripts or fixtures
- ❌ No logging infrastructure beyond console.log
- ❌ No multiple theme variants
- ❌ No i18n system (just Vietnamese locale on date-fns + Shadcn components)
- ❌ No WebSocket setup
- ❌ No file upload handling
- ❌ No API rate limiting
- ❌ No more than 2-3 example routes per app
- ❌ No actual password hashing logic (better-auth handles this)
- ❌ No JWT tokens — sessions are DB-stored and delivered via HTTP-only cookies
- ❌ No Drizzle `relations()` beyond 2-3 example tables
- ❌ No Zod validators beyond auth-related schemas
- ❌ No materialized view definitions in Drizzle
- ❌ No global `casing: 'snake_case'` in Drizzle config
- ❌ No ESLint, Prettier, or `.eslintrc` / `.prettierrc` files
- ❌ No `pg` or `@neondatabase/serverless` driver (use `postgres` / postgres-js only)

---

## Target Folder Structure

```
ptdapm/
├── package.json                    # Root workspace config (Bun workspaces)
├── turbo.json                      # Turborepo task pipeline
├── biome.json                      # Biome linter/formatter config
├── tsconfig.json                   # Base TypeScript config (project references)
├── .env.example                    # Environment variable template
├── .gitignore                      # (existing — DO NOT TOUCH)
├── .vscode/
│   └── settings.json               # Biome formatter, editor settings
├── database/                       # (existing — DO NOT TOUCH entire directory)
│   ├── schema.revised.postgres.sql
│   └── schema.dbml
├── apps/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts       # Drizzle Kit configuration
│   │   └── src/
│   │       ├── index.ts            # ElysiaJS app entry + type export
│   │       ├── db/
│   │       │   ├── index.ts        # Database connection (drizzle + postgres-js)
│   │       │   └── schema/
│   │       │       ├── index.ts    # Barrel export of all schemas
│   │       │       ├── files.ts
│   │       │       ├── campuses.ts
│   │       │       ├── organization.ts   # org_units, org_unit_status_events
│   │       │       ├── salary.ts         # salary_grades, salary_grade_steps
│   │       │       ├── employees.ts      # employees + all sub-entity tables
│   │       │       ├── contracts.ts      # contract_types, employment_contracts, contract_appendices
│   │       │       ├── evaluations.ts    # employee_evaluations
│   │       │       ├── training.ts       # training_course_types, courses, registrations, results
│   │       │       ├── auth.ts           # auth_roles, auth_users, session, account, verification
│   │       │       └── audit.ts          # audit_logs
│   │       ├── auth/
│   │       │   └── index.ts        # better-auth instance configuration
│   │       ├── plugins/
│   │       │   ├── auth.ts         # better-auth Elysia plugin (.mount + .macro)
│   │       │   └── db.ts           # Database plugin (inject db into context)
│   │       └── routes/
│   │           ├── index.ts        # Route barrel / health check
│   │           └── auth.ts         # Auth route example (login placeholder)
│   └── frontend/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.app.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       ├── index.html
│       ├── components.json         # Shadcn UI config
│       └── src/
│           ├── main.tsx            # App entry, providers, router
│           ├── app.css             # Global CSS (Tailwind v4 + @theme inline + Shadcn vars)
│           ├── lib/
│           │   └── utils.ts        # cn() utility (clsx + tailwind-merge)
│           ├── api/
│           │   └── client.ts       # Eden Treaty client setup
│           ├── stores/
│           │   ├── index.ts        # Store barrel
│           │   └── auth.ts         # Auth store (Zustand: user, setUser, clearUser)
│           ├── components/
│           │   └── ui/             # Shadcn UI components directory
│           │       └── .gitkeep    # Placeholder
│           ├── routes/
│           │   ├── __root.tsx      # Root layout
│           │   ├── index.tsx       # Home/dashboard route
│           │   └── login.tsx       # Login page route
│           └── routeTree.gen.ts    # Auto-generated by TanStack Router
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts            # Main barrel export
│           ├── constants/          # (existing — DO NOT TOUCH)
│           │   ├── enums.ts
│           │   └── index.ts
│           ├── types/
│           │   ├── index.ts        # Types barrel
│           │   ├── auth.ts         # Auth-related types
│           │   └── common.ts       # Common types (ApiResponse, PaginatedResponse)
│           └── validators/
│               ├── index.ts        # Validators barrel
│               └── auth.ts         # Auth validators (loginSchema)
```

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (out of scope for scaffold)
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| Config files | Bash | `bun install`, `bun run lint`, `bun run type-check` |
| Backend skeleton | Bash | `bun run --filter @hrms/backend dev` → check server starts, health check returns JSON |
| Frontend skeleton | Bash (curl) | `bun run --filter @hrms/frontend dev` → curl localhost:5173 returns HTML with `<div id="root">` |
| Shared package | Bash | TypeScript compilation verifies imports work across packages |
| Integration | Bash | Full `bun run dev` → verify both servers respond |

---

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| Task 1: Root monorepo configs | None | Starting point — workspace foundation |
| Task 2: Shared package | Task 1 | Needs root tsconfig + workspace config |
| Task 3: Backend Drizzle schema | Task 2 | Imports types from shared (enum types) |
| Task 4: Backend ElysiaJS app | Task 3 | Needs schema + shared types, better-auth config |
| Task 5: Frontend Vite + React setup | Task 1 | Needs root workspace config, independent of backend |
| Task 6: Frontend routes + UI | Task 5 | Needs Vite + React base setup |
| Task 7: Eden Treaty integration | Task 4, Task 6 | Needs backend type export + frontend base |
| Task 8: Final integration + QA | Task 7 | Verifies everything works end-to-end |

## Parallel Execution Graph

```
Wave 1 (Start immediately):
└── Task 1: Root monorepo configuration files

Wave 2 (After Wave 1):
├── Task 2: Shared package (types + validators)
└── Task 5: Frontend Vite + React base setup

Wave 3 (After Wave 2):
├── Task 3: Backend Drizzle schema (all tables)
└── Task 6: Frontend routes + Shadcn UI + stores

Wave 4 (After Wave 3):
└── Task 4: Backend ElysiaJS app (plugins, routes, better-auth)

Wave 5 (After Wave 4):
└── Task 7: Eden Treaty integration (frontend → backend type bridge)

Wave 6 (After Wave 5):
└── Task 8: Final integration verification + bun install + bun run dev
```

**Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 7 → Task 8

---

## TODOs

- [x] 1. Root Monorepo Configuration Files

  **What to do**:
  - Create root `package.json` with Bun workspaces configuration:
    - `"workspaces": ["apps/*", "packages/*"]`
    - `"private": true`
    - `"devDependencies"`: `turbo`, `@biomejs/biome`, `typescript` (pinned versions)
    - Scripts: `dev`, `build`, `type-check`, `lint`, `format`
    - All scripts should delegate to Turborepo: `"dev": "turbo dev"`, etc.
  - Create `turbo.json` with task pipeline:
    - `build`: depends on `^build` (topological)
    - `dev`: persistent, no cache
    - `type-check`: depends on `^build`
    - `lint`: no dependencies
  - Create root `tsconfig.json` as base config:
    - `strict: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`
    - `skipLibCheck: true`, `noUncheckedIndexedAccess: true`
    - Project references to `apps/backend`, `apps/frontend`, `packages/shared`
  - Create `biome.json`:
    - Formatter: indent style tabs or 2-space (match existing code — check `enums.ts` uses 2-space), line width 100
    - Linter: recommended rules enabled
    - Organizer: import sorting enabled
    - Ignore: `node_modules`, `dist`, `.turbo`, `routeTree.gen.ts`, `*.gen.*`
  - Create `.env.example`:
    ```
    DATABASE_URL=postgres://user:password@localhost:5432/hrms
    BETTER_AUTH_SECRET=change-me-to-a-random-secret
    BETTER_AUTH_URL=http://localhost:3000
    FRONTEND_URL=http://localhost:5173
    PORT=3000
    ```
  - Populate `.vscode/settings.json`:
    - Set Biome as default formatter
    - Enable format on save
    - Associate `*.css` files with Tailwind CSS
    - Disable built-in TypeScript formatter

  **Must NOT do**:
  - Do NOT create `.eslintrc`, `.prettierrc`, or any ESLint/Prettier config
  - Do NOT create `tailwind.config.js`
  - Do NOT run `bun install` yet (wait until all package.json files exist)
  - Do NOT add `catalog:` to root package.json (Bun doesn't support this yet — pin versions in each app's package.json instead)

  **References**:
  - `packages/shared/src/constants/enums.ts:1-31` — Check indentation style (2-space indent) to match Biome formatter config
  - `.gitignore:1-33` — Existing ignore patterns confirm Bun/Turbo/Drizzle stack
  - `docs/draft-plan.md:127-207` — Target folder structure reference

  **Acceptance Criteria**:
  - [ ] `package.json` exists at root with `workspaces: ["apps/*", "packages/*"]`
  - [ ] `turbo.json` exists with `build`, `dev`, `type-check`, `lint` tasks
  - [ ] `tsconfig.json` exists at root with strict mode and project references
  - [ ] `biome.json` exists with linter + formatter config
  - [ ] `.env.example` exists with all 5 variables documented
  - [ ] `.vscode/settings.json` has Biome formatter settings
  - [ ] No `.eslintrc*` or `.prettierrc*` files exist: `test ! -f .eslintrc* && test ! -f .prettierrc*`

  **QA Scenarios**:
  ```
  Scenario: Root configs are valid JSON/JSONC
    Tool: Bash
    Steps:
      1. Run `cat package.json | bun -e "JSON.parse(await Bun.stdin.text())"` — should not throw
      2. Verify `turbo.json` parses as valid JSON
      3. Verify `biome.json` parses as valid JSON
    Expected Result: All files parse without errors
    Evidence: .sisyphus/evidence/task-1-configs-valid.txt

  Scenario: No forbidden config files
    Tool: Bash
    Steps:
      1. Run `ls .eslintrc* .prettierrc* tailwind.config.* 2>&1`
    Expected Result: "No such file or directory" for all
    Evidence: .sisyphus/evidence/task-1-no-forbidden-files.txt
  ```

  **Delegation Recommendation**:
  - Category: `quick` — Single-concern task creating well-defined config files
  - Skills: [] — No specialized skills needed, standard config file creation

  **Skills Evaluation**:
  - OMITTED `git-master`: No git operations needed in this task
  - OMITTED `frontend-design`: No UI work
  - OMITTED `playwright`: No browser verification needed

  **Commit**: YES
  - Message: `chore(root): initialize monorepo with Bun workspaces, Turborepo, Biome, and TypeScript`
  - Files: `package.json`, `turbo.json`, `biome.json`, `tsconfig.json`, `.env.example`, `.vscode/settings.json`

- [x] 2. Shared Package — Types, Validators, and Package Config

  **What to do**:
  - Create `packages/shared/package.json`:
    - Name: `@hrms/shared`
    - `"type": "module"`
    - `"exports": { ".": { "import": "./src/index.ts", "types": "./src/index.ts" } }`
    - No build step needed — consumed as TypeScript source via workspace protocol
    - Dependencies: `zod` (pinned version, e.g., `"zod": "3.24.2"`)
    - Scripts: `"lint": "biome check ."`, `"type-check": "tsc --noEmit"`, `"build": "tsc --noEmit"` (Turborepo needs these scripts in every workspace it orchestrates)
  - Create `packages/shared/tsconfig.json`:
    - Extends root `tsconfig.json`
    - `include: ["src"]`
    - `compilerOptions.composite: true` (for project references)
  - Update `packages/shared/src/index.ts` (currently only re-exports constants):
    - Add re-exports for `./types` and `./validators`
  - Create `packages/shared/src/types/index.ts` — barrel export
  - Create `packages/shared/src/types/auth.ts`:
    - `LoginRequest` type: `{ username: string; password: string }`
    - `AuthUser` type: `{ id: string; username: string; fullName: string; email: string | null; role: string; status: string }`
    - `SessionInfo` type: `{ user: AuthUser; session: { id: string; expiresAt: Date } }`
  - Create `packages/shared/src/types/common.ts`:
    - `ApiResponse<T>` type: `{ success: boolean; data?: T; error?: string }`
    - `PaginatedResponse<T>` type: `{ items: T[]; total: number; page: number; pageSize: number }`
  - Create `packages/shared/src/validators/index.ts` — barrel export
  - Create `packages/shared/src/validators/auth.ts`:
    - `loginSchema`: `z.object({ username: z.string().min(1), password: z.string().min(1) })`
    - Export inferred types: `type LoginInput = z.infer<typeof loginSchema>`

  **Must NOT do**:
  - Do NOT modify `packages/shared/src/constants/enums.ts` — it is complete and frozen
  - Do NOT modify `packages/shared/src/constants/index.ts` — it is complete and frozen
  - Do NOT create Zod validators for all 21 enum domains — auth-only
  - Do NOT create custom hooks or utility functions
  - Do NOT add a separate `build` step that emits compiled JS — shared package is consumed as raw TypeScript source. The `"build": "tsc --noEmit"` script above exists solely for Turborepo orchestration.

  **References**:
  - `packages/shared/src/constants/enums.ts:1-282` — Existing enum constants (DO NOT TOUCH)
  - `packages/shared/src/constants/index.ts` — Existing barrel export (DO NOT TOUCH)
  - `database/schema.revised.postgres.sql:644-659` — `auth_users` table structure for AuthUser type
  - `database/schema.revised.postgres.sql:700-739` — better-auth tables (session, account, verification)

  **Acceptance Criteria**:
  - [ ] `packages/shared/package.json` exists with name `@hrms/shared` and `exports` field
  - [ ] `packages/shared/tsconfig.json` exists extending root config
  - [ ] `packages/shared/src/index.ts` re-exports constants, types, and validators
  - [ ] `packages/shared/src/types/auth.ts` exports `LoginRequest`, `AuthUser`, `SessionInfo`
  - [ ] `packages/shared/src/types/common.ts` exports `ApiResponse`, `PaginatedResponse`
  - [ ] `packages/shared/src/validators/auth.ts` exports `loginSchema` with Zod
  - [ ] `packages/shared/src/constants/enums.ts` is UNCHANGED: `git diff --name-only packages/shared/src/constants/enums.ts` → empty
  - [ ] `packages/shared/src/constants/index.ts` is UNCHANGED

  **QA Scenarios**:
  ```
  Scenario: Shared package exports resolve
    Tool: Bash
    Steps:
      1. After bun install (Task 8), run: `bun -e "import { loginSchema } from '@hrms/shared'; console.log(typeof loginSchema.parse)"`
    Expected Result: Prints "function"
    Evidence: .sisyphus/evidence/task-2-shared-exports.txt

  Scenario: Existing constants untouched
    Tool: Bash
    Steps:
      1. Run `git diff --name-only packages/shared/src/constants/enums.ts`
      2. Run `git diff --name-only packages/shared/src/constants/index.ts`
    Expected Result: Both commands produce empty output
    Evidence: .sisyphus/evidence/task-2-constants-untouched.txt
  ```

  **Delegation Recommendation**:
  - Category: `quick` — Small number of well-defined TypeScript files with clear types
  - Skills: [] — No specialized skills needed

  **Skills Evaluation**:
  - OMITTED `git-master`: No git operations
  - OMITTED `frontend-design`: No UI work
  - OMITTED all others: Pure TypeScript type/validator definitions

  **Commit**: YES
  - Message: `feat(shared): add shared types, auth validators, and package config`
  - Files: `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/src/**`

- [x] 3. Backend Drizzle Schema — ALL Tables Converted

  **What to do**:
  Convert ALL tables from `database/schema.revised.postgres.sql` into Drizzle ORM schema files organized by domain. This is the largest single task.

  **Schema file organization** (in `apps/backend/src/db/schema/`):

  1. `files.ts` — `files` table (1 table)
  2. `campuses.ts` — `campuses` table (1 table)
  3. `organization.ts` — `org_units`, `org_unit_status_events` (2 tables)
  4. `salary.ts` — `salary_grades`, `salary_grade_steps` (2 tables)
  5. `employees.ts` — `employees`, `employee_terminations`, `employee_assignments`, `employee_family_members`, `employee_bank_accounts`, `employee_previous_jobs`, `employee_party_memberships`, `employee_degrees`, `employee_certifications`, `employee_foreign_work_permits`, `employee_allowances` (11 tables)
  6. `contracts.ts` — `allowance_types`, `contract_types`, `employment_contracts`, `contract_appendices` (4 tables)
  7. `evaluations.ts` — `employee_evaluations` (1 table)
  8. `training.ts` — `training_course_types`, `training_courses`, `training_registrations`, `training_results` (4 tables)
  9. `auth.ts` — `auth_roles`, `auth_users`, `session`, `account`, `verification` (5 tables)
     - **CRITICAL**: `authRoles` MUST be declared before `authUsers` (FK dependency)
     - **CRITICAL**: `session`, `account`, `verification` tables use **camelCase** quoted column names (e.g., `"expiresAt"`, `"userId"`, `"userAgent"`). Use explicit column name mapping: `expiresAt: timestamp('expiresAt', { withTimezone: true })` — do NOT rely on any global casing config.
     - **CRITICAL**: `auth_users` table must include `emailVerified` (boolean, nullable, default false) and `image` (text, nullable) columns that better-auth expects, even though they're not in the SQL. Add a comment: `// Added for better-auth compatibility — not in original SQL schema`
     - `auth_users.password_hash`: Keep in schema (matches SQL) but add comment: `// Unused — better-auth stores passwords in account.password`
  10. `audit.ts` — `audit_logs` (1 table)
  11. `index.ts` — Barrel export re-exporting all tables from all schema files

  **Drizzle conventions to follow**:
  - Import from `drizzle-orm/pg-core`
  - Use `pgTable()` for each table
  - Use `uuid('id').primaryKey().defaultRandom()` for UUID PKs
  - Use `timestamp('created_at', { withTimezone: true }).notNull().defaultNow()` for timestamps
  - Use `varchar('column_name', { length: N })` for varchar columns
  - Use `text('column_name')` for text columns
  - Use `numeric('column_name', { precision: P, scale: S })` for numeric columns
  - Use `integer('column_name')` for int columns
  - Use `boolean('column_name')` for boolean columns
  - Use `jsonb('column_name')` for jsonb columns
  - Foreign keys: `uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' })`
  - For `employees.staff_code` default: `.default(sql\`nextval('employee_staff_code_seq')::text\`)`
  - Use `.$type<GenderCode>()` to add type annotations from shared enum types where applicable
  - Do NOT use `casing: 'snake_case'` anywhere globally — all column names are explicit
  - Do NOT define `relations()` in this task (deferred to Task 4 for 2-3 examples)
  - Do NOT define materialized views (not supported by Drizzle)
  - Do NOT define the `employee_staff_code_seq` sequence (Drizzle has no sequence API)

  Also create:
  - `apps/backend/src/db/index.ts` — Database connection:
    ```typescript
    import { drizzle } from 'drizzle-orm/postgres-js';
    import postgres from 'postgres';
    import * as schema from './schema';

    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString);
    export const db = drizzle(client, { schema });
    export type Database = typeof db;
    ```
  - `apps/backend/drizzle.config.ts` — Drizzle Kit config:
    ```typescript
    import { defineConfig } from 'drizzle-kit';

    export default defineConfig({
      schema: './src/db/schema/index.ts',
      out: './drizzle',
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DATABASE_URL!,
      },
    });
    ```

  **Must NOT do**:
  - Do NOT modify `database/schema.revised.postgres.sql`
  - Do NOT run `drizzle-kit push` or `drizzle-kit generate`
  - Do NOT define `relations()` beyond what's needed for schema (defer to Task 4)
  - Do NOT define materialized views
  - Do NOT use global `casing` config

  **References** (exhaustive — executor has no interview context):
  - `database/schema.revised.postgres.sql:83-92` — `files` table
  - `database/schema.revised.postgres.sql:97-107` — `campuses` table
  - `database/schema.revised.postgres.sql:112-169` — `org_units`, `org_unit_status_events`
  - `database/schema.revised.postgres.sql:181-211` — `salary_grades`, `salary_grade_steps`
  - `database/schema.revised.postgres.sql:221-232` — `allowance_types`
  - `database/schema.revised.postgres.sql:239-289` — `employees` (main table)
  - `database/schema.revised.postgres.sql:294-304` — `employee_terminations`
  - `database/schema.revised.postgres.sql:309-328` — `employee_assignments`
  - `database/schema.revised.postgres.sql:335-350` — `employee_family_members`
  - `database/schema.revised.postgres.sql:353-362` — `employee_bank_accounts`
  - `database/schema.revised.postgres.sql:365-374` — `employee_previous_jobs`
  - `database/schema.revised.postgres.sql:377-387` — `employee_party_memberships`
  - `database/schema.revised.postgres.sql:390-402` — `employee_degrees`
  - `database/schema.revised.postgres.sql:405-416` — `employee_certifications`
  - `database/schema.revised.postgres.sql:419-431` — `employee_foreign_work_permits`
  - `database/schema.revised.postgres.sql:436-446` — `employee_allowances`
  - `database/schema.revised.postgres.sql:455-469` — `contract_types`
  - `database/schema.revised.postgres.sql:474-502` — `employment_contracts`
  - `database/schema.revised.postgres.sql:505-517` — `contract_appendices`
  - `database/schema.revised.postgres.sql:522-554` — `employee_evaluations`
  - `database/schema.revised.postgres.sql:562-570` — `training_course_types`
  - `database/schema.revised.postgres.sql:573-608` — `training_courses`
  - `database/schema.revised.postgres.sql:611-624` — `training_registrations`
  - `database/schema.revised.postgres.sql:627-638` — `training_results`
  - `database/schema.revised.postgres.sql:644-663` — `auth_users`
  - `database/schema.revised.postgres.sql:678-693` — `auth_roles`
  - `database/schema.revised.postgres.sql:700-739` — `session`, `account`, `verification` (better-auth tables — camelCase columns!)
  - `database/schema.revised.postgres.sql:744-758` — `audit_logs`
  - `packages/shared/src/constants/enums.ts:41-42` — `GenderCode` type example (use `.$type<GenderCode>()` pattern)

  **Acceptance Criteria**:
  - [ ] All 10 schema domain files exist in `apps/backend/src/db/schema/`
  - [ ] `apps/backend/src/db/schema/index.ts` barrel-exports all tables from all files
  - [ ] `apps/backend/src/db/index.ts` creates drizzle instance with postgres-js
  - [ ] `apps/backend/drizzle.config.ts` exists with correct config
  - [ ] All 30+ tables from SQL schema are represented in Drizzle
  - [ ] `auth.ts` has `authRoles` declared before `authUsers`
  - [ ] `auth.ts` has `session`, `account`, `verification` with explicit camelCase column names
  - [ ] `auth.ts` has `emailVerified` and `image` columns on `authUsers` with compatibility comments
  - [ ] No `casing: 'snake_case'` used anywhere
  - [ ] `database/schema.revised.postgres.sql` is UNCHANGED: `git diff --name-only database/schema.revised.postgres.sql` → empty
  - [ ] TypeScript compiles without errors: `lsp_diagnostics` on all schema files shows no errors

  **QA Scenarios**:
  ```
  Scenario: All schema files exist and export tables
    Tool: Bash
    Steps:
      1. List all files in apps/backend/src/db/schema/
      2. Verify each file exports at least one pgTable
      3. Verify index.ts re-exports from all domain files
    Expected Result: 11 files (10 domain + 1 barrel), all exporting tables
    Evidence: .sisyphus/evidence/task-3-schema-files.txt

  Scenario: Table count matches SQL
    Tool: Bash
    Steps:
      1. Count pgTable() calls across all schema files: `grep -r "pgTable(" apps/backend/src/db/schema/ | wc -l`
    Expected Result: 31+ (30 application tables + better-auth tables)
    Evidence: .sisyphus/evidence/task-3-table-count.txt

  Scenario: better-auth tables use camelCase columns
    Tool: Bash
    Steps:
      1. Check apps/backend/src/db/schema/auth.ts contains "expiresAt" and "userId" as column names
    Expected Result: Explicit camelCase column names present
    Evidence: .sisyphus/evidence/task-3-betterauth-casing.txt

  Scenario: SQL schema untouched
    Tool: Bash
    Steps:
      1. Run `git diff --name-only database/schema.revised.postgres.sql`
    Expected Result: Empty output
    Evidence: .sisyphus/evidence/task-3-sql-untouched.txt
  ```

  **Delegation Recommendation**:
  - Category: `deep` — This is the largest task (30+ table conversions). Requires careful SQL-to-Drizzle mapping, understanding FK relationships, handling the better-auth camelCase anomaly, and adding type annotations. Goal-oriented autonomous problem-solving is ideal.
  - Skills: [] — No specialized skills needed; the task is well-specified with SQL reference

  **Skills Evaluation**:
  - OMITTED `git-master`: No git operations in this task
  - OMITTED `frontend-design`: Backend schema work
  - OMITTED `playwright`: No browser verification
  - OMITTED all others: Pure Drizzle ORM schema definition against a well-documented SQL reference

  **Commit**: NO (groups with Task 4)

- [x] 4. Backend ElysiaJS Application — Plugins, Routes, better-auth

  **What to do**:
  - Create `apps/backend/package.json`:
    - Name: `@hrms/backend`
    - `"type": "module"`
    - Dependencies (pinned versions):
      - `elysia` (latest stable, e.g., `1.2.x`)
      - `@elysiajs/cors`
      - `@elysiajs/swagger`
      - `better-auth`
      - `drizzle-orm`
      - `postgres` (postgres-js driver)
      - `@hrms/shared: "workspace:*"`
    - Dev dependencies:
      - `drizzle-kit`
      - `bun-types`
      - `typescript`
    - Scripts: `"dev": "bun run --hot src/index.ts"`, `"build": "bun build src/index.ts --outdir dist"`, `"type-check": "tsc --noEmit"`, `"lint": "biome check ."`
  - Create `apps/backend/tsconfig.json`:
    - Extends root `tsconfig.json`
    - `types: ["bun-types"]`
    - `include: ["src"]`
    - `composite: true`

  - Create `apps/backend/src/auth/index.ts` — better-auth instance:
    ```typescript
    import { betterAuth } from 'better-auth';
    import { drizzleAdapter } from 'better-auth/adapters/drizzle';
    import { db } from '../db';

    export const auth = betterAuth({
      database: drizzleAdapter(db, { provider: 'pg' }),
      user: {
        modelName: 'auth_users',
        fields: {
          name: 'full_name',
        },
        additionalFields: {
          username: { type: 'string', required: true, input: true },
          roleId: { type: 'string', fieldName: 'role_id', required: true },
          employeeId: { type: 'string', fieldName: 'employee_id' },
          status: { type: 'string', defaultValue: 'active' },
          lastLoginAt: { type: 'date', fieldName: 'last_login_at' },
          passwordHash: { type: 'string', fieldName: 'password_hash' },
        },
      },
      session: {
        expiresIn: 30 * 60,  // 30 minutes in seconds
        updateAge: 0,         // Update on EVERY request (true sliding window)
        cookieCache: {
          enabled: false,     // Always validate against DB for security
        },
      },
      advanced: {
        cookiePrefix: '__session',
        useSecureCookies: false,  // Set to true in production with HTTPS
      },
    });
    ```

  - Create `apps/backend/src/plugins/auth.ts` — ElysiaJS plugin:
    ```typescript
    import Elysia from 'elysia';
    import { auth } from '../auth';

    export const authPlugin = new Elysia({ name: 'better-auth' })
      .mount(auth.handler)
      .macro({
        auth: {
          async resolve({ status, request: { headers } }) {
            const session = await auth.api.getSession({ headers });
            if (!session) return status(401);
            return { user: session.user, session: session.session };
          },
        },
      });
    ```

  - Create `apps/backend/src/plugins/db.ts` — Database plugin:
    ```typescript
    import Elysia from 'elysia';
    import { db } from '../db';

    export const dbPlugin = new Elysia({ name: 'database' })
      .decorate('db', db);
    ```

  - Create `apps/backend/src/routes/index.ts` — Health check:
    ```typescript
    import Elysia from 'elysia';

    export const indexRoutes = new Elysia()
      .get('/', () => ({ status: 'ok', timestamp: new Date().toISOString() }));
    ```

  - Create `apps/backend/src/routes/auth.ts` — Auth routes example:
    - Simple route group showing how to use the auth plugin macro
    - GET `/auth/me` with auth macro → returns current user (placeholder)

  - Create `apps/backend/src/index.ts` — Main app entry:
    ```typescript
    import { Elysia } from 'elysia';
    import { cors } from '@elysiajs/cors';
    import { swagger } from '@elysiajs/swagger';
    import { dbPlugin } from './plugins/db';
    import { authPlugin } from './plugins/auth';
    import { indexRoutes } from './routes';
    import { authRoutes } from './routes/auth';

    const app = new Elysia()
      .use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
      .use(swagger())
      .use(dbPlugin)
      .use(authPlugin)
      .use(indexRoutes)
      .use(authRoutes)
      .listen(process.env.PORT || 3000);

    console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

    // CRITICAL: This type export is the Eden Treaty contract
    export type App = typeof app;
    ```

  - Add 2-3 example Drizzle `relations()` in `apps/backend/src/db/schema/auth.ts` and `apps/backend/src/db/schema/employees.ts`:
    - `authUsersRelations`: user → role, user → sessions, user → employee
    - `employeesRelations`: employee → org_unit, employee → terminations (just 2-3 as examples)

  **Must NOT do**:
  - Do NOT create more than 2 example routes (health check + auth/me)
  - Do NOT implement actual business logic in routes
  - Do NOT create error handling middleware beyond ElysiaJS defaults
  - Do NOT use JWT — better-auth uses DB sessions + HTTP-only cookies
  - Do NOT use `pg` or `@neondatabase/serverless` — use `postgres` (postgres-js)
  - Do NOT create relations for all tables — just 2-3 examples
  - Do NOT create seed data or fixtures
  - Do NOT add logging beyond console.log

  **References**:
  - `database/schema.revised.postgres.sql:644-663` — `auth_users` columns for better-auth field mappings
  - `database/schema.revised.postgres.sql:700-739` — Session/account/verification tables for better-auth
  - `database/schema.revised.postgres.sql:678-693` — `auth_roles` with 4 system roles (ADMIN, TCCB, TCKT, EMPLOYEE)
  - `docs/draft-plan.md:84-121` — "Must Have" and "Must NOT Have" requirements for backend
  - Task 3 output: All Drizzle schema files in `apps/backend/src/db/schema/`

  **Acceptance Criteria**:
  - [ ] `apps/backend/package.json` exists with correct name, deps, and scripts
  - [ ] `apps/backend/tsconfig.json` extends root and has `bun-types`
  - [ ] `apps/backend/src/index.ts` exports `type App = typeof app`
  - [ ] `apps/backend/src/auth/index.ts` configures better-auth with `modelName: 'auth_users'`, field mappings, 30-min session
  - [ ] `apps/backend/src/plugins/auth.ts` uses `.mount(auth.handler)` + `.macro` pattern
  - [ ] `apps/backend/src/plugins/db.ts` decorates context with db instance
  - [ ] `apps/backend/src/routes/index.ts` has health check returning `{ status: 'ok' }`
  - [ ] `apps/backend/src/routes/auth.ts` has example auth route
  - [ ] 2-3 example `relations()` defined for auth + employees
  - [ ] No JWT usage anywhere
  - [ ] `elysia` version is explicitly pinned in `package.json`

  **QA Scenarios**:
  ```
  Scenario: Backend package.json is valid and has required deps
    Tool: Bash
    Steps:
      1. Verify apps/backend/package.json parses as valid JSON
      2. Verify it contains "elysia", "better-auth", "drizzle-orm", "postgres", "@hrms/shared" in dependencies
      3. Verify scripts include "dev", "build", "type-check"
    Expected Result: All deps and scripts present
    Evidence: .sisyphus/evidence/task-4-backend-package.txt

  Scenario: App type is exported for Eden Treaty
    Tool: Bash
    Steps:
      1. grep "export type App = typeof app" apps/backend/src/index.ts
    Expected Result: Match found
    Evidence: .sisyphus/evidence/task-4-app-type-export.txt

  Scenario: better-auth configured with correct session settings
    Tool: Bash
    Steps:
      1. grep "expiresIn: 30 \* 60\|expiresIn: 1800" apps/backend/src/auth/index.ts
      2. grep "updateAge: 0" apps/backend/src/auth/index.ts
      3. grep "modelName.*auth_users" apps/backend/src/auth/index.ts
    Expected Result: All three patterns found
    Evidence: .sisyphus/evidence/task-4-betterauth-config.txt
  ```

  **Delegation Recommendation**:
  - Category: `deep` — Complex integration of ElysiaJS + better-auth + Drizzle adapter. Requires understanding better-auth's field mapping API, macro pattern for Elysia, and correct session configuration. Goal-oriented autonomous execution is ideal.
  - Skills: [] — No specialized skills needed; task is well-specified with exact code patterns

  **Skills Evaluation**:
  - OMITTED `git-master`: No git operations
  - OMITTED `frontend-design`: Backend work
  - OMITTED `playwright`: No browser testing
  - OMITTED all others: Pure backend TypeScript with well-documented API patterns

  **Commit**: YES
  - Message: `feat(backend): add ElysiaJS app with Drizzle schema and better-auth`
  - Files: `apps/backend/**`

- [x] 5. Frontend Vite + React Base Setup

  **What to do**:
  - Create `apps/frontend/package.json`:
    - Name: `@hrms/frontend`
    - `"type": "module"`
    - Dependencies (pinned versions):
      - `react`, `react-dom`
      - `@tanstack/react-router`
      - `tailwindcss` (v4)
      - `@tailwindcss/vite`
      - `clsx`, `tailwind-merge` (for `cn()` utility)
      - `zustand`
      - `react-hook-form`, `@hookform/resolvers`
      - `zod`
      - `date-fns`
      - `@hrms/shared: "workspace:*"`
    - Dev dependencies:
      - `@vitejs/plugin-react`
      - `@tanstack/router-plugin`
      - `vite`
      - `typescript`
      - `@types/react`, `@types/react-dom`
    - Scripts: `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"type-check": "tsc --noEmit"`, `"lint": "biome check ."`, `"preview": "vite preview"`
    - NOTE: Do NOT add `elysia` or `@elysiajs/eden` here yet — that's Task 7
  - Create `apps/frontend/tsconfig.json`:
    - Root config extending base, with references to `tsconfig.app.json` and `tsconfig.node.json`
  - Create `apps/frontend/tsconfig.app.json`:
    - `lib: ["ES2022", "DOM", "DOM.Iterable"]`
    - `jsx: "react-jsx"`
    - `composite: true`
    - `include: ["src"]`
  - Create `apps/frontend/tsconfig.node.json`:
    - For Vite config: `include: ["vite.config.ts"]`
    - `composite: true`
  - Create `apps/frontend/vite.config.ts`:
    ```typescript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import tailwindcss from '@tailwindcss/vite';
    import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

    export default defineConfig({
      plugins: [
        TanStackRouterVite(),  // MUST be BEFORE react()
        react(),
        tailwindcss(),
      ],
      resolve: {
        alias: {
          '@': '/src',
        },
      },
      server: {
        port: 5173,
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
          },
        },
      },
    });
    ```
    - **CRITICAL**: `TanStackRouterVite()` MUST be listed BEFORE `react()` in plugins array
  - Create `apps/frontend/index.html`:
    - Standard Vite HTML template with `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`
    - `<html lang="vi">` for Vietnamese locale
  - Create `apps/frontend/src/app.css`:
    - Tailwind v4 import: `@import "tailwindcss";`
    - Shadcn UI CSS variables in `:root` and `.dark` selectors (standard Shadcn default theme)
    - `@theme inline { }` block bridging CSS variables to Tailwind tokens
    - This is the SINGLE CSS file — no separate `globals.css` or `index.css`
  - Create `apps/frontend/src/lib/utils.ts`:
    ```typescript
    import { type ClassValue, clsx } from "clsx";
    import { twMerge } from "tailwind-merge";

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs));
    }
    ```
  - Create `apps/frontend/components.json` — Shadcn UI config:
    - Style: "default" or "new-york"
    - TypeScript: true
    - Tailwind CSS v4: cssVariables true, no `tailwind.config.js` reference
    - Aliases: `@/components`, `@/lib`, `@/hooks`, `@/ui`
  - Create `apps/frontend/src/main.tsx`:
    - Minimal React entry point with `createRoot` and `StrictMode`
    - Import `./app.css`
    - Create and render router (TanStack Router `createRouter` + `RouterProvider`)
    - Import `routeTree` from `./routeTree.gen` (auto-generated by Vite plugin)
  - Create `apps/frontend/src/components/ui/.gitkeep` — placeholder for Shadcn components

  **Must NOT do**:
  - Do NOT create `tailwind.config.js` or `tailwind.config.ts` — Tailwind v4 uses CSS-only config
  - Do NOT add `elysia` or `@elysiajs/eden` deps yet (Task 7)
  - Do NOT create custom hooks
  - Do NOT create utility functions beyond `cn()`
  - Do NOT create more than the base route files
  - Do NOT install Shadcn components (just set up `components.json` and the `ui/` directory)

  **References**:
  - `docs/draft-plan.md:168-193` — Target frontend folder structure
  - `.gitignore:11` — `routeTree.gen.ts` is in gitignore (auto-generated)

  **Acceptance Criteria**:
  - [ ] `apps/frontend/package.json` exists with correct name and deps
  - [ ] `apps/frontend/vite.config.ts` has `TanStackRouterVite()` BEFORE `react()` in plugins
  - [ ] `apps/frontend/vite.config.ts` has `@tailwindcss/vite` plugin
  - [ ] `apps/frontend/index.html` exists with `lang="vi"` and `<div id="root">`
  - [ ] `apps/frontend/src/app.css` has `@import "tailwindcss"` + `@theme inline` block + Shadcn CSS vars
  - [ ] `apps/frontend/src/lib/utils.ts` has `cn()` function
  - [ ] `apps/frontend/components.json` exists with Shadcn config for Tailwind v4
  - [ ] `apps/frontend/src/main.tsx` creates router and renders app
  - [ ] No `tailwind.config.js` or `tailwind.config.ts` exists
  - [ ] No `elysia` or `@elysiajs/eden` in package.json deps (yet)

  **QA Scenarios**:
  ```
  Scenario: Vite config has correct plugin order
    Tool: Bash
    Steps:
      1. Read apps/frontend/vite.config.ts
      2. Verify TanStackRouterVite appears before react() in plugins array
    Expected Result: TanStackRouterVite is first plugin
    Evidence: .sisyphus/evidence/task-5-vite-plugin-order.txt

  Scenario: No forbidden config files
    Tool: Bash
    Steps:
      1. Check for tailwind.config.* in apps/frontend/
    Expected Result: No such files exist
    Evidence: .sisyphus/evidence/task-5-no-tailwind-config.txt

  Scenario: CSS has Tailwind v4 import and Shadcn theme
    Tool: Bash
    Steps:
      1. grep '@import "tailwindcss"' apps/frontend/src/app.css
      2. grep '@theme inline' apps/frontend/src/app.css
    Expected Result: Both patterns found
    Evidence: .sisyphus/evidence/task-5-css-setup.txt
  ```

  **Delegation Recommendation**:
  - Category: `quick` — Well-defined Vite + React setup with known config patterns. No complex logic.
  - Skills: [`frontend-design`] — For accurate Shadcn UI + Tailwind CSS v4 initialization and CSS variable setup

  **Skills Evaluation**:
  - INCLUDED `frontend-design`: Shadcn UI initialization, Tailwind v4 CSS-only config, `@theme inline` bridge, `components.json` setup — these require specialized frontend knowledge
  - OMITTED `playwright`: No browser testing in this task
  - OMITTED `frontend-ui-ux`: No visual design decisions — just scaffolding
  - OMITTED `dev-browser`: No browser automation
  - OMITTED all others: Not relevant to frontend scaffold

  **Commit**: NO (groups with Tasks 6 and 7)

- [x] 6. Frontend Routes, Stores, and Page Skeletons

  **What to do**:
  - Create `apps/frontend/src/routes/__root.tsx`:
    - Root layout component using TanStack Router's `createRootRoute`
    - Import `Outlet` from `@tanstack/react-router`
    - Basic HTML structure: header placeholder, main content area with `<Outlet />`, footer placeholder
    - Import `app.css` styles
  - Create `apps/frontend/src/routes/index.tsx`:
    - Home/dashboard page using `createFileRoute('/')`
    - Simple placeholder content: "HRMS Dashboard" heading, Vietnamese text placeholder
  - Create `apps/frontend/src/routes/login.tsx`:
    - Login page using `createFileRoute('/login')`
    - Simple placeholder content: "Đăng nhập" heading
    - No actual form implementation — just the route skeleton
  - Create `apps/frontend/src/stores/auth.ts`:
    - Zustand store with slice pattern:
    ```typescript
    import { create } from 'zustand';
    import type { AuthUser } from '@hrms/shared';

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
  - Create `apps/frontend/src/stores/index.ts` — barrel export

  **Must NOT do**:
  - Do NOT create actual form components or login logic
  - Do NOT create more than 3 route files (__root, index, login)
  - Do NOT create custom hooks
  - Do NOT add devtools middleware to Zustand (premature)
  - Do NOT import Eden Treaty client yet (Task 7)
  - Do NOT create more than `user`, `setUser`, `clearUser` in auth store

  **References**:
  - `docs/draft-plan.md:189-193` — Route file structure
  - `packages/shared/src/types/auth.ts` (from Task 2) — `AuthUser` type for Zustand store

  **Acceptance Criteria**:
  - [ ] `apps/frontend/src/routes/__root.tsx` exists with root layout and `<Outlet />`
  - [ ] `apps/frontend/src/routes/index.tsx` exists with home page placeholder
  - [ ] `apps/frontend/src/routes/login.tsx` exists with login page placeholder
  - [ ] `apps/frontend/src/stores/auth.ts` exports `useAuthStore` with `user`, `setUser`, `clearUser`
  - [ ] `apps/frontend/src/stores/index.ts` re-exports from `auth.ts`
  - [ ] No actual business logic or form handling in any file

  **QA Scenarios**:
  ```
  Scenario: Route files use correct TanStack Router API
    Tool: Bash
    Steps:
      1. grep "createRootRoute\|createFileRoute" apps/frontend/src/routes/*.tsx
    Expected Result: __root.tsx uses createRootRoute, index.tsx and login.tsx use createFileRoute
    Evidence: .sisyphus/evidence/task-6-route-patterns.txt

  Scenario: Auth store has minimal API
    Tool: Bash
    Steps:
      1. grep "useAuthStore\|setUser\|clearUser" apps/frontend/src/stores/auth.ts
    Expected Result: All three patterns present
    Evidence: .sisyphus/evidence/task-6-auth-store.txt
  ```

  **Delegation Recommendation**:
  - Category: `quick` — Small, well-defined route skeletons and a minimal Zustand store
  - Skills: [] — Standard React + TanStack Router patterns, no specialized knowledge needed

  **Skills Evaluation**:
  - OMITTED `frontend-design`: No visual design work — just route skeletons
  - OMITTED `frontend-ui-ux`: No UI/UX decisions
  - OMITTED `playwright`: No browser testing
  - OMITTED all others: Simple TypeScript/React files

  **Commit**: NO (groups with Tasks 5 and 7)

- [x] 7. Eden Treaty Integration — Frontend ↔ Backend Type Bridge

  **What to do**:
  - Add Eden Treaty dependencies to `apps/frontend/package.json`:
    - `elysia` (MUST be the **exact same version** as in `apps/backend/package.json`)
    - `@elysiajs/eden`
    - `@hrms/backend: "workspace:*"` — Required for `import type { App } from '@hrms/backend'` to resolve
  - Create `apps/frontend/src/api/client.ts`:
    ```typescript
    import { treaty } from '@elysiajs/eden';
    import type { App } from '@hrms/backend';

    export const api = treaty<App>(
      import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
    );
    ```
    - **CRITICAL**: The import `type { App } from '@hrms/backend'` requires that:
      1. `apps/backend/package.json` has `"exports": { ".": { "import": "./src/index.ts", "types": "./src/index.ts" } }`
      2. `apps/backend/src/index.ts` exports `type App = typeof app`
      3. Both packages have the same `elysia` version
  - Update `apps/backend/package.json` to add `exports` field (if not already present):
    ```json
    "exports": {
      ".": {
        "import": "./src/index.ts",
        "types": "./src/index.ts"
      }
    }
    ```
  - Verify the `elysia` version in `apps/frontend/package.json` exactly matches `apps/backend/package.json`

  **Must NOT do**:
  - Do NOT add middleware, interceptors, or auth token injection to the API client (premature)
  - Do NOT create API hooks or wrappers
  - Do NOT use Eden Treaty v1 (use `treaty` from `@elysiajs/eden`, not `edenTreaty`)

  **References**:
  - `apps/backend/src/index.ts` (from Task 4) — `export type App = typeof app`
  - `apps/backend/package.json` (from Task 4) — `elysia` version to match

  **Acceptance Criteria**:
  - [ ] `apps/frontend/package.json` has `elysia`, `@elysiajs/eden`, and `@hrms/backend: "workspace:*"` in dependencies
  - [ ] `elysia` version in frontend matches backend exactly
  - [ ] `apps/frontend/src/api/client.ts` imports `type { App }` from `@hrms/backend`
  - [ ] `apps/frontend/src/api/client.ts` creates `treaty<App>(...)` client
  - [ ] `apps/backend/package.json` has `exports` field pointing to `./src/index.ts`
  - [ ] No Eden Treaty v1 imports (`edenTreaty` should NOT appear)

  **QA Scenarios**:
  ```
  Scenario: Elysia versions match between apps
    Tool: Bash
    Steps:
      1. Extract elysia version from apps/backend/package.json
      2. Extract elysia version from apps/frontend/package.json
      3. Compare
    Expected Result: Identical versions
    Evidence: .sisyphus/evidence/task-7-elysia-versions.txt

  Scenario: Eden client imports correct type
    Tool: Bash
    Steps:
      1. grep "import type.*App.*from.*@hrms/backend" apps/frontend/src/api/client.ts
      2. grep "treaty<App>" apps/frontend/src/api/client.ts
    Expected Result: Both patterns found
    Evidence: .sisyphus/evidence/task-7-eden-client.txt

  Scenario: No Eden v1 usage
    Tool: Bash
    Steps:
      1. grep -r "edenTreaty" apps/frontend/src/
    Expected Result: No matches (empty output)
    Evidence: .sisyphus/evidence/task-7-no-eden-v1.txt
  ```

  **Delegation Recommendation**:
  - Category: `quick` — Small, well-defined integration task with clear code patterns
  - Skills: [] — Standard package.json + TypeScript import configuration

  **Skills Evaluation**:
  - OMITTED all skills: Simple package dependency + import configuration task

  **Commit**: YES
  - Message: `feat(frontend): add React SPA with TanStack Router, Shadcn UI, and Eden Treaty`
  - Files: `apps/frontend/**`

- [x] 8. Final Integration — Install, Verify, and Lock Dependencies

  **What to do**:
  - Run `bun install` from root directory
    - This should resolve all workspace dependencies
    - Verify exit code 0 and no errors
    - `bun.lockb` will be generated (already in .gitignore — verify NOT tracked)
  - Run `bun run type-check` (Turborepo will run `tsc --noEmit` across all workspaces)
    - Fix any TypeScript errors that arise
    - This validates cross-package type imports (shared → backend, shared → frontend, backend type → frontend Eden)
  - Run `bun run lint` (Turborepo will run Biome across all workspaces)
    - Fix any linting errors
    - Verify zero warnings
  - Run `bun run build` to verify build works
    - Fix any build errors
  - Start backend: `bun run --filter @hrms/backend dev` (background)
    - Wait 3 seconds
    - `curl http://localhost:3000/` → should return `{"status":"ok","timestamp":"..."}`
    - Kill the process
  - Start frontend: `bun run --filter @hrms/frontend dev` (background)
    - Wait 5 seconds
    - `curl http://localhost:5173/` → should return HTML with `<div id="root">`
    - Kill the process
  - Verify no forbidden files were accidentally created:
    - `test ! -f tailwind.config.js`
    - `test ! -f tailwind.config.ts`
    - `test ! -f .eslintrc.js` (and other eslint variants)
    - `test ! -f .prettierrc`
  - Verify existing files are untouched:
    - `git diff --name-only packages/shared/src/constants/enums.ts` → empty
    - `git diff --name-only packages/shared/src/constants/index.ts` → empty
    - `git diff --name-only database/schema.revised.postgres.sql` → empty
    - `git diff --name-only database/schema.dbml` → empty

  **Must NOT do**:
  - Do NOT run `drizzle-kit push` or any database migrations
  - Do NOT create seed data
  - Do NOT modify any files created in previous tasks unless fixing TypeScript/lint errors
  - Do NOT add new features or files beyond what's specified

  **References**:
  - All previous tasks (1-7) — All files created in the scaffold
  - `docs/draft-plan.md:69-77` — Definition of Done criteria

  **Acceptance Criteria**:
  - [ ] `bun install` exits 0 with no errors
  - [ ] `bun run type-check` exits 0 (all workspaces pass)
  - [ ] `bun run lint` exits 0 (zero errors)
  - [ ] `bun run build` exits 0
  - [ ] Backend health check returns `{"status":"ok","timestamp":"..."}` on port 3000
  - [ ] Frontend serves HTML with `<div id="root">` on port 5173
  - [ ] No `tailwind.config.*`, `.eslintrc*`, `.prettierrc*` files exist
  - [ ] `enums.ts`, `index.ts` (constants), SQL schema, DBML are all unchanged
  - [ ] `bun.lockb` is NOT tracked by git (in .gitignore)

  **QA Scenarios**:
  ```
  Scenario: Full install and type-check
    Tool: Bash
    Steps:
      1. bun install
      2. bun run type-check
      3. bun run lint
    Expected Result: All exit 0
    Evidence: .sisyphus/evidence/task-8-install-typecheck-lint.txt

  Scenario: Backend starts and responds
    Tool: Bash
    Steps:
      1. bun run --filter @hrms/backend dev &
      2. sleep 3
      3. curl -s http://localhost:3000/
      4. kill %1
    Expected Result: JSON response with status "ok"
    Evidence: .sisyphus/evidence/task-8-backend-health.txt

  Scenario: Frontend starts and serves HTML
    Tool: Bash
    Steps:
      1. bun run --filter @hrms/frontend dev &
      2. sleep 5
      3. curl -s http://localhost:5173/ | head -20
      4. kill %1
    Expected Result: HTML containing <div id="root">
    Evidence: .sisyphus/evidence/task-8-frontend-html.txt

  Scenario: Existing files untouched
    Tool: Bash
    Steps:
      1. git diff --name-only packages/shared/src/constants/enums.ts
      2. git diff --name-only packages/shared/src/constants/index.ts
      3. git diff --name-only database/schema.revised.postgres.sql
      4. git diff --name-only database/schema.dbml
    Expected Result: All commands produce empty output
    Evidence: .sisyphus/evidence/task-8-files-untouched.txt

  Scenario: No forbidden files
    Tool: Bash
    Steps:
      1. test ! -f tailwind.config.js && test ! -f tailwind.config.ts
      2. ls .eslintrc* .prettierrc* 2>&1
    Expected Result: All tests pass, no forbidden files exist
    Evidence: .sisyphus/evidence/task-8-no-forbidden.txt
  ```

  **Delegation Recommendation**:
  - Category: `deep` — Integration verification that may require debugging type errors, fixing import paths, resolving workspace dependency issues. Needs autonomous problem-solving to iterate on errors.
  - Skills: [] — Standard build tooling verification, no specialized skills needed

  **Skills Evaluation**:
  - OMITTED `git-master`: No git commits in this task (only `git diff` for verification)
  - OMITTED `playwright`: Using curl for verification, not browser automation
  - OMITTED all others: Build/install verification task

  **Commit**: YES
  - Message: `chore: verify end-to-end integration and lock dependencies`
  - Files: Any files fixed during integration, `bun.lockb` (if tracked)

---

## Final Verification

> Self-executed checklist after ALL tasks complete. No delegation.

- [x] **Plan Compliance**: Every "Must Have" present, every "Must NOT Have" absent
- [x] **Install**: `bun install` exits 0 with no errors
- [x] **Type-check**: `bun run type-check` exits 0 across all workspaces
- [x] **Lint**: `bun run lint` exits 0 with zero errors
- [x] **Build**: `bun run build` completes for all packages
- [x] **Backend**: `bun run --filter @hrms/backend dev` → `curl localhost:3000` returns health check JSON
- [x] **Frontend**: `bun run --filter @hrms/frontend dev` → `curl localhost:5173` returns HTML with `<div id="root">`
- [x] **No forbidden files**: No `tailwind.config.js`, `.eslintrc*`, `.prettierrc*`
- [x] **Existing files untouched**: `git diff --name-only packages/shared/src/constants/enums.ts` → empty
- [x] **Existing files untouched**: `git diff --name-only database/schema.revised.postgres.sql` → empty
- [x] **Code Quality**: No `as any`, `@ts-ignore`, empty catches, `console.log` in production code, commented-out code
- [x] **QA Evidence**: All evidence files exist in `.sisyphus/evidence/`
- [x] **Scope Fidelity**: Each task's diff matches its spec — nothing missing, nothing extra

---

## Commit Strategy

- **Commit 1** (after Task 1): `chore(root): initialize monorepo with Bun workspaces, Turborepo, Biome, and TypeScript`
  - Files: `package.json`, `turbo.json`, `biome.json`, `tsconfig.json`, `.env.example`, `.vscode/settings.json`
- **Commit 2** (after Task 2): `feat(shared): add shared types, auth validators, and package config`
  - Files: `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/src/**`
- **Commit 3** (after Tasks 3-4): `feat(backend): add ElysiaJS app with Drizzle schema and better-auth`
  - Files: `apps/backend/**`
- **Commit 4** (after Tasks 5-6-7): `feat(frontend): add React SPA with TanStack Router, Shadcn UI, and Eden Treaty`
  - Files: `apps/frontend/**`
- **Commit 5** (after Task 8): `chore: verify end-to-end integration and lock dependencies`
  - Files: `bun.lockb` (generated)

---

## Success Criteria

### Verification Commands
```bash
bun install                          # Expected: exit 0, no errors
bun run type-check                   # Expected: exit 0
bun run lint                         # Expected: exit 0
bun run build                        # Expected: exit 0
bun run --filter @hrms/backend dev   # Expected: server on :3000
curl http://localhost:3000/           # Expected: {"status":"ok"}
bun run --filter @hrms/frontend dev  # Expected: server on :5173
curl http://localhost:5173/           # Expected: HTML with <div id="root">
```

### Final Checklist
- [x] All "Must Have" items present
- [x] All "Must NOT Have" items absent
- [x] `bun install && bun run dev` works with zero errors
- [x] Shared types importable from both apps
- [x] Eden Treaty client compiles without type errors
- [x] better-auth configured with correct `auth_users` mapping
- [x] Existing `enums.ts`, SQL schema, and docs untouched
