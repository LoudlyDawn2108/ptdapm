# HRMS — Project Plan

> **4 Full-Stack Developers** · **Monorepo (Turborepo + Bun)** · **Elysia + React + Drizzle**
>
> Phân chia theo **table/route ownership** — mỗi dev sở hữu toàn bộ stack (BE route → DB schema → FE page) cho các bảng được giao.
>
> **Related docs**: `conventions.md` (architecture), `dev-{1..4}-*.md` (per-dev assignments)

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

## 2. Phasing & Dependencies

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

## 3. Git Branching Strategy

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
