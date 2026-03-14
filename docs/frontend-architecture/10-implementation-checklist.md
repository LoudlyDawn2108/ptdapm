# 10 — Implementation Checklist

## Phase 0 — Foundation Infrastructure

### Install Dependencies
- [ ] Install `@tanstack/react-query` in `@hrms/frontend`
- [ ] Install `@tanstack/react-table` in `@hrms/frontend`
- [ ] Install `sonner` in `@hrms/frontend`
- [ ] Install `react-day-picker` in `@hrms/frontend`
- [ ] Install `@tanstack/react-query-devtools` as devDependency in `@hrms/frontend`

### Install shadcn Components
- [ ] Install core: `button`, `input`, `label`, `form`, `select`, `dialog`
- [ ] Install data display: `table`, `card`, `badge`, `separator`, `skeleton`
- [ ] Install overlays: `dropdown-menu`, `popover`, `command`, `tooltip`
- [ ] Install layout: `sheet`, `tabs`, `avatar`, `sidebar`
- [ ] Install form controls: `textarea`, `checkbox`, `radio-group`, `switch`
- [ ] Install date: `calendar` (wraps react-day-picker)
- [ ] Install feedback: `alert`, `alert-dialog`, `sonner`
- [ ] Install navigation: `breadcrumb`, `pagination`

### Create Directory Structure
- [ ] Create `src/features/` directory with subdirectories per module
- [ ] Create `src/hooks/` directory
- [ ] Create `src/lib/` directory
- [ ] Create `src/components/layout/` directory
- [ ] Create `src/components/shared/` directory
- [ ] Verify `src/components/ui/` is populated by shadcn

### Core Infrastructure Files
- [ ] Create `src/api/query-client.ts` — TanStack Query client with default options
- [ ] Create `src/api/helpers.ts` — Response unwrap helpers
- [ ] Create `src/lib/utils.ts` — `cn()` class merge helper (shadcn standard)
- [ ] Create `src/lib/error-handler.ts` — `handleApiError()` + `applyFieldErrors()`
- [ ] Create `src/lib/role-utils.ts` — Role checking helpers
- [ ] Create `src/lib/date-utils.ts` — date-fns format wrappers
- [ ] Create `src/stores/ui.ts` — UI state store (sidebar, theme)

### Wire Up Providers (main.tsx)
- [ ] Create `QueryClient` with configured defaults (staleTime, retry, etc.)
- [ ] Wrap app with `QueryClientProvider`
- [ ] Pass `queryClient` into router context via `createRouter({ context: { queryClient } })`
- [ ] Add `ReactQueryDevtools` (dev only)
- [ ] Register router type (`declare module "@tanstack/react-router"`)

### Fix Stale Route Tree
- [ ] Delete stale `routeTree.gen.ts`
- [ ] Remove route files referenced in gen but missing from disk (or restore them)
- [ ] Run dev server to regenerate `routeTree.gen.ts` from actual route files
- [ ] Verify clean compilation with `bun run type-check --filter @hrms/frontend`

---

## Phase 0 — Shared Reusable Components

### Data Table (TanStack Table + shadcn)
- [ ] Create `src/components/ui/data-table.tsx` — Generic `<DataTable>` wrapper
- [ ] Support: column definitions, server-side pagination, sorting, loading state
- [ ] Support: empty state display
- [ ] Support: row actions (dropdown menu per row)
- [ ] Create `src/components/ui/data-table-pagination.tsx` — Pagination controls
- [ ] Create `src/components/ui/data-table-column-header.tsx` — Sortable column header

### Combobox (per combobox plan)
- [ ] Create `src/components/ui/combobox.tsx` — Popover + Command wrapper
- [ ] Support: async search (debounced), loading state, empty state
- [ ] Support: single select with value/label
- [ ] Create `src/hooks/use-debounce.ts` — Debounce hook (300ms)
- [ ] Create `src/hooks/use-dropdown-query.ts` — TanStack Query wrapper for dropdowns

### Layout Components
- [ ] Create `src/components/layout/app-sidebar.tsx` — Main sidebar with role-based nav items
- [ ] Create `src/components/layout/app-header.tsx` — Top header (user info, logout)
- [ ] Create `src/components/layout/page-header.tsx` — Page title + breadcrumb + action buttons
- [ ] Create `src/components/layout/page-container.tsx` — Consistent page wrapper

### Shared Components
- [ ] Create `src/components/shared/confirm-dialog.tsx` — AlertDialog wrapper for destructive actions
- [ ] Create `src/components/shared/error-boundary.tsx` — React error boundary
- [ ] Create `src/components/shared/loading-skeleton.tsx` — Generic skeleton loader
- [ ] Create `src/components/shared/empty-state.tsx` — "No data" placeholder
- [ ] Create `src/components/shared/status-badge.tsx` — Color-coded status badges (per enum)
- [ ] Create `src/components/shared/role-guard.tsx` — Conditional render by role
- [ ] Create `src/components/shared/file-upload.tsx` — Reusable file upload input

---

## Phase 0 — Auth Flow (Dev 1)

### Auth Feature Module
- [ ] Create `src/features/auth/api.ts` — `sessionOptions()`, `useLogin()`, `useLogout()`
- [ ] Create `src/features/auth/hooks.ts` — `useAuth()` with role helpers

### Route: Login (`/login`)
- [ ] Create `src/features/auth/components/login-form.tsx` — RHF + Zod (`loginSchema` from shared)
- [ ] Wire login form to `useLogin()` mutation
- [ ] Handle error display (toast for wrong credentials, field errors)
- [ ] Redirect to `/` on success
- [ ] Add `beforeLoad` to redirect away if already authenticated

### Route: Authenticated Layout (`_authenticated.tsx`)
- [ ] Refactor to use `beforeLoad` with `ensureQueryData(sessionOptions())`
- [ ] Pass `user` into route context for child routes
- [ ] Remove `useEffect`-based session check (replace with loader)
- [ ] Wire `useLogout()` mutation to logout button
- [ ] Add idle timeout hook (30min → auto logout with toast)

### Route: Root Layout (`__root.tsx`)
- [ ] Add `<Toaster>` from sonner
- [ ] Add `errorComponent` for unhandled errors
- [ ] Add `notFoundComponent` for 404

---

## Phase 1 — Core API Pages

### Accounts Module (Dev 1 — Admin only)
- [ ] Create `src/features/accounts/api.ts` — query keys, list/detail options, CRUD mutations
- [ ] Create `src/features/accounts/components/account-table.tsx` — Column definitions
- [ ] Create `src/features/accounts/components/account-form.tsx` — Add/edit form (email + role + person select)
- [ ] Create `src/routes/_authenticated/accounts/index.tsx` — Accounts list page
- [ ] Add search + filters (keyword, role, status) as URL search params
- [ ] Add lock/unlock action with confirm dialog
- [ ] Add role guard (`beforeLoad` — Admin only)

### Audit Log Module (Dev 1 — Admin only)
- [ ] Create `src/features/audit-logs/api.ts` — query keys, list options
- [ ] Create `src/features/audit-logs/components/audit-table.tsx` — Column definitions
- [ ] Create `src/features/audit-logs/components/audit-detail-dialog.tsx` — Before/after values
- [ ] Create `src/routes/_authenticated/audit-logs/index.tsx` — Audit log page
- [ ] Add filters (time range, user, action type, module) as URL search params
- [ ] Add export PDF/Excel buttons
- [ ] Add role guard (Admin only)

### Org Units Module (Dev 2 — Admin + TCCB)
- [ ] Create `src/features/org-units/api.ts` — query keys, tree/detail options, mutations
- [ ] Create `src/features/org-units/components/org-tree.tsx` — Tree view component
- [ ] Create `src/features/org-units/components/unit-form.tsx` — Create/edit unit form
- [ ] Create `src/features/org-units/components/unit-detail-tabs.tsx` — Tabs: overview, personnel, sub-units, history
- [ ] Create `src/routes/_authenticated/org-units/index.tsx` — Tree view page
- [ ] Create `src/routes/_authenticated/org-units/$unitId.tsx` — Unit detail page
- [ ] Implement dissolve/merge action with decision metadata form
- [ ] Implement appoint/transfer staff action
- [ ] Implement dismiss staff action

### Config Catalogs (Dev 2 — TCCB)
- [ ] Create `src/features/config/contract-types/api.ts` — CRUD + dropdown
- [ ] Create `src/features/config/contract-types/components/` — Table + form
- [ ] Create `src/routes/_authenticated/config/contract-types.tsx`
- [ ] Create `src/features/config/salary-coefficients/api.ts` — CRUD
- [ ] Create `src/features/config/salary-coefficients/components/` — Table + form
- [ ] Create `src/routes/_authenticated/config/salary-coefficients.tsx`
- [ ] Create `src/features/config/allowance-types/api.ts` — CRUD
- [ ] Create `src/features/config/allowance-types/components/` — Table + form
- [ ] Create `src/routes/_authenticated/config/allowance-types.tsx`
- [ ] All three: add/edit dialog, status toggle with confirm, search

### Employee List + CRUD (Dev 3 — TCCB write, TCKT read)
- [ ] Create `src/features/employees/api.ts` — query keys, list/detail options, CRUD mutations
- [ ] Create `src/features/employees/components/employee-table.tsx` — Column definitions
- [ ] Create `src/features/employees/components/filter-panel.tsx` — Advanced filter (collapsible)
- [ ] Create `src/features/employees/components/employee-form.tsx` — Multi-tab create form
- [ ] Create `src/features/employees/components/employee-tabs.tsx` — Tab navigation for detail view
- [ ] Create `src/routes/_authenticated/employees/index.tsx` — Employee list with URL filters
- [ ] Create `src/routes/_authenticated/employees/new.tsx` — Create employee page
- [ ] Create `src/routes/_authenticated/employees/$employeeId.tsx` — Detail shell with tabs
- [ ] Add real-time keyword search (debounced)
- [ ] Add pagination as URL search params
- [ ] Add role-based write/read-only rendering

### Training Module (Dev 4 — TCCB)
- [ ] Create `src/features/training/api.ts` — query keys, list/detail options, mutations
- [ ] Create `src/features/training/utils.ts` — State machine guard functions
- [ ] Create `src/features/training/components/course-table.tsx` — Column definitions
- [ ] Create `src/features/training/components/course-form.tsx` — Create/edit course form
- [ ] Create `src/features/training/components/registration-list.tsx` — Registered staff table
- [ ] Create `src/features/training/components/result-form.tsx` — Record results form
- [ ] Create `src/routes/_authenticated/training/index.tsx` — Course list page
- [ ] Create `src/routes/_authenticated/training/$courseId.tsx` — Course detail page
- [ ] Implement state-driven UI (buttons visible based on course state)
- [ ] Implement certificate PDF upload for completed participants

---

## Phase 2 — Employee Sub-Entity Tabs

### Personal Info Tab (Dev 3 — default tab)
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/index.tsx`
- [ ] Display/edit personal info fields
- [ ] Handle conditional foreign national fields
- [ ] Portrait photo upload

### Family Members Tab (Dev 3)
- [ ] Create `src/features/employees-sub/family/api.ts`
- [ ] Create `src/features/employees-sub/family/components/family-table.tsx`
- [ ] Create `src/features/employees-sub/family/components/family-form.tsx`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/family.tsx`

### Bank Accounts Tab (Dev 3)
- [ ] Create `src/features/employees-sub/bank-accounts/api.ts`
- [ ] Create `src/features/employees-sub/bank-accounts/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/bank-accounts.tsx`

### Previous Jobs Tab (Dev 3)
- [ ] Create `src/features/employees-sub/previous-jobs/api.ts`
- [ ] Create `src/features/employees-sub/previous-jobs/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/previous-jobs.tsx`

### Party Membership Tab (Dev 3)
- [ ] Create `src/features/employees-sub/party/api.ts`
- [ ] Create `src/features/employees-sub/party/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/party.tsx`

### Allowances Tab (Dev 3)
- [ ] Create `src/features/employees-sub/allowances/api.ts`
- [ ] Create `src/features/employees-sub/allowances/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/allowances.tsx`

### Degrees Tab (Dev 1)
- [ ] Create `src/features/employees-sub/degrees/api.ts`
- [ ] Create `src/features/employees-sub/degrees/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/degrees.tsx`
- [ ] Support PDF upload for degree documents

### Certifications Tab (Dev 1)
- [ ] Create `src/features/employees-sub/certifications/api.ts`
- [ ] Create `src/features/employees-sub/certifications/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/certifications.tsx`
- [ ] Support PDF upload for certificate documents

### Contracts Tab (Dev 1)
- [ ] Create `src/features/employees-sub/contracts/api.ts`
- [ ] Create `src/features/employees-sub/contracts/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/contracts.tsx`
- [ ] Rich text editor for contract content
- [ ] Signed PDF upload
- [ ] Contract type rules enforcement (min/max months, max renewals)
- [ ] State-driven "Create contract" button visibility

### Evaluations Tab (Dev 4)
- [ ] Create `src/features/employees-sub/evaluations/api.ts`
- [ ] Create `src/features/employees-sub/evaluations/components/`
- [ ] Create `src/routes/_authenticated/employees_/$employeeId/evaluations.tsx`
- [ ] Support reward + discipline subtypes
- [ ] Block when employee is resigned

---

## Phase 2 — Self-Service & Reports

### Self-Service: My Profile (Dev 3)
- [ ] Create `src/routes/_authenticated/my/profile.tsx`
- [ ] Read-only employee detail view (reuse employee detail components)
- [ ] Fetch using `/api/employees/me` endpoint

### Self-Service: My Org (Dev 2)
- [ ] Create `src/routes/_authenticated/my/org.tsx`
- [ ] Read-only org unit detail view

### Self-Service: My Training (Dev 4)
- [ ] Create `src/routes/_authenticated/my/training.tsx`
- [ ] Course list with register/cancel buttons (state-dependent)
- [ ] View registered courses + participation status

### Employee Export/Print (Dev 3)
- [ ] Add "Export Excel" button to employee list page
- [ ] Add "Export Excel" button to employee detail page
- [ ] Add "Print PDF" button to employee detail page
- [ ] Handle CSV download response from backend

### Dashboard (Dev 2)
- [ ] Create `src/routes/_authenticated/index.tsx` — Role-specific dashboard
- [ ] Admin dashboard: account stats, recent audit logs
- [ ] TCCB dashboard: workforce overview, recent changes
- [ ] TCKT dashboard: financial-relevant stats
- [ ] Employee dashboard: own profile summary, upcoming training

### Reports (Dev 2 — TCCB + TCKT)
- [ ] Create `src/features/reports/api.ts`
- [ ] Create `src/routes/_authenticated/reports/index.tsx`
- [ ] Report category selector
- [ ] Data tables/charts per report type
- [ ] Export PDF/Excel per report

---

## Phase 3 — Integration & Polish

### Cross-Feature Wiring
- [ ] Wire all combobox dropdowns to backend `/dropdown` endpoints
- [ ] Ensure all employee detail tabs load correctly from tab container
- [ ] Verify role-based nav items in sidebar match actual route guards
- [ ] Wire file upload to backend file service across all features

### UX Polish
- [ ] Add loading skeletons for all list and detail pages
- [ ] Add empty states for all tables and lists
- [ ] Add error states for failed queries
- [ ] Ensure confirm dialogs on all destructive actions (delete, status change, resign, dissolve/merge)
- [ ] Add breadcrumbs on all pages
- [ ] Add keyboard shortcuts for common actions (if applicable)
- [ ] Mobile responsive sidebar (collapse to hamburger)

### State Machine Enforcement
- [ ] Implement all guard functions in `features/*/utils.ts`
- [ ] Verify button visibility matches state machine rules across all modules
- [ ] Verify form disabling matches state (e.g., can't edit resigned employee)

### Error Handling Completeness
- [ ] Verify `handleApiError` covers all 4 backend error shapes
- [ ] Verify `applyFieldErrors` works in all form submissions
- [ ] Test rate limit error display (429)
- [ ] Test auth expiry (401 → redirect to login)
- [ ] Test locked account (403 → clear session + redirect)

### Build & Type Safety
- [ ] Run `bun run type-check --filter @hrms/frontend` — zero errors
- [ ] Run `bun run lint --filter @hrms/frontend` — zero errors
- [ ] Run `bun run build --filter @hrms/frontend` — clean build
- [ ] Verify `routeTree.gen.ts` matches all route files
- [ ] Verify no `as any` or `@ts-ignore` in codebase

---

## Summary

| Phase | Scope | Status |
|---|---|---|
| Phase 0 — Foundation | Deps, infra files, shared components, auth flow | ⬜ Not started |
| Phase 1 — Core Pages | Accounts, org units, config, employees list/CRUD, training | ⬜ Not started |
| Phase 2 — Sub-Entities | Employee tabs, self-service, export, dashboard, reports | ⬜ Not started |
| Phase 3 — Polish | Wiring, UX, state machines, error handling, build verification | ⬜ Not started |
