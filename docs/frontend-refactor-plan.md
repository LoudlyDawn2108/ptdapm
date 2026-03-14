# Frontend Refactor Plan

> Architecture improvements for long-term maintainability.
> Generated from codebase evaluation on 2026-03-14.

---

## Critical — Fix Now

- [ ] **Fix missing RBAC guard on `/config/allowance-types`**
  - File: `routes/_authenticated/config/allowance-types/index.tsx`
  - Add `beforeLoad: authorizeRoute("/config/allowance-types")` to the route config
  - All other config pages already have this — this one was missed

- [ ] **Wire `zodResolver` into employee creation form**
  - File: `routes/_authenticated/employees/new.tsx`
  - `zodResolver` and `createEmployeeSchema` are already imported but unused
  - Replace `type FormValues = Record<string, any>` with the inferred schema type
  - Add `resolver: zodResolver(createEmployeeSchema)` to `useForm()`
  - Gives users immediate client-side validation feedback

- [ ] **Remove `as any` casts from API layer**
  - Files: `features/employees/api.ts`, `features/config/api.ts`, `features/org-units/api.ts`, `features/accounts/api.ts`
  - Replace `as any` query params with properly typed objects matching Eden Treaty signatures
  - Replace `input: any` mutation params with shared types from `@hrms/shared`
  - This is the most important type-safety boundary in the app

---

## Architectural — High Impact

- [ ] **Split `features/config/api.ts` into per-entity files**
  - Current: 1 file (232 lines) combines salary grades, contract types, allowance types
  - Target:
    ```
    features/config/
      salary-grades/api.ts
      contract-types/api.ts
      allowance-types/api.ts
    ```
  - Update imports in all route files that reference the old path

- [ ] **Extract `useListPage` hook for search + pagination + debounce**
  - Shared logic repeated in every list page: search schema, debounced text, navigate on page change
  - Create `hooks/use-list-page.ts` that encapsulates:
    - `searchText` state + `useDebounce`
    - Pagination state derived from route search params
    - `onPaginationChange` handler that calls `navigate()`
  - Apply to: employees list, contract-types, allowance-types, salary-grades

- [ ] **Create generic `<CatalogListPage>` for config pages**
  - `contract-types`, `allowance-types`, `salary-grades` pages are ~90% identical
  - Extract a shared component that accepts:
    - `title`, `description`
    - `columns` definition
    - `queryOptions` factory
    - `useDeleteMutation` hook
    - `emptyMessage`
  - Each config route becomes ~30 lines instead of ~135

- [ ] **Extract column definitions out of route files**
  - Move inline `columns: ColumnDef<any>[]` from route components into feature modules
  - Target structure:
    ```
    features/employees/columns.tsx
    features/config/salary-grades/columns.tsx
    features/config/contract-types/columns.tsx
    features/config/allowance-types/columns.tsx
    ```
  - Type the columns properly (replace `ColumnDef<any>` with actual row types)

- [ ] **Move form components out of route files**
  - `employees/new.tsx` (247 lines) has the entire form inline
  - Extract to `features/employees/components/employee-form.tsx`
  - This makes the form reusable for both create and edit routes
  - Route file becomes a thin wrapper (~30 lines)

- [ ] **Add error states to all data-fetching pages**
  - Most pages destructure `{ data, isLoading }` but ignore `isError` / `error`
  - Add a consistent error UI (use existing `<ErrorBoundary>` or a simpler inline pattern)
  - Apply to: employees list, employee detail, all config pages, org-units, dashboard, accounts

- [ ] **Remove Zustand auth store — use route context only**
  - `stores/auth.ts` mirrors what `_authenticated` route context already provides
  - Components inside the auth subtree should use `Route.useRouteContext()` or a thin `useAuth()` hook over route context
  - Eliminates dual state and risk of drift
  - Also remove `stores/ui.ts` if confirmed unused (sidebar uses its own provider)

- [ ] **Clean up dead sidebar links and align permission map**
  - Sidebar links to routes that don't exist yet: `/reports`, `/config/salary-coefficients`, `/training`, `/my/profile`, `/my/org`, `/my/training`
  - Either: remove links until routes are implemented, or add placeholder routes
  - Align `ROUTE_PERMISSIONS` map — remove entries for nonexistent routes

---

## Code Quality — Clean Up Over Time

- [ ] **Extract magic numbers into named constants**
  - `pageSize: 20` → `DEFAULT_PAGE_SIZE` (used in every search schema)
  - `level * 24 + 8` → `ORG_TREE_INDENT_PX` (org-units tree)
  - Skeleton counts (`5`, `8`) → `SKELETON_ROW_COUNT`
  - Centralize in `lib/constants.ts` or co-locate with usage

- [ ] **Fix employee detail page bugs**
  - File: `routes/_authenticated/employees/$employeeId.tsx`
  - Remove duplicate "Trạng thái" `InfoRow` that renders `undefined`
  - Fix "Chỉnh sửa" button — currently links to the same detail page instead of an edit route

- [ ] **Remove unused imports and dead code**
  - `salary-grades/index.tsx`: `Pencil` imported but unused
  - `stores/ui.ts`: entire file appears unused
  - Run `biome lint` to catch others

- [ ] **Consider i18n abstraction for UI strings**
  - All labels/placeholders/messages are inline Vietnamese
  - Not blocking, but extract into per-feature string constants at minimum
  - Makes future localization possible without rewriting every component

---

## Target File Structure

After completing all items above, the frontend `src/` should look like:

```
src/
  api/
    client.ts
  features/
    auth/
      api.ts
      hooks.ts
      components/
        login-form.tsx
    employees/
      api.ts
      columns.tsx                    ← extracted from route
      components/
        employee-form.tsx            ← extracted from route
        employee-detail-card.tsx     ← extracted from route
    config/
      salary-grades/
        api.ts                       ← split from monolithic config/api.ts
        columns.tsx
      contract-types/
        api.ts
        columns.tsx
      allowance-types/
        api.ts
        columns.tsx
    org-units/
      api.ts
    dashboard/
      api.ts
    accounts/
      api.ts
  hooks/
    use-list-page.ts                 ← new: generic search + pagination
    use-debounce.ts
  components/
    ui/            (shadcn primitives — no changes)
    shared/
      catalog-list-page.tsx          ← new: generic CRUD list
      confirm-dialog.tsx
      error-boundary.tsx
      empty-state.tsx
      loading-skeleton.tsx
      role-guard.tsx
      status-badge.tsx
    layout/
      app-sidebar.tsx
      app-header.tsx
      page-header.tsx
      page-container.tsx
  lib/
    constants.ts                     ← new: DEFAULT_PAGE_SIZE, etc.
    permissions.ts
    role-utils.ts
    error-handler.ts
    date-utils.ts
    utils.ts
  stores/
    (removed — auth via route context only)
  routes/
    __root.tsx
    login.tsx
    _authenticated.tsx
    _authenticated/
      index.tsx                      ← dashboard (thin)
      forbidden.tsx
      accounts/index.tsx
      employees/
        index.tsx                    ← thin: useListPage + columns import
        new.tsx                      ← thin: EmployeeForm import
        $employeeId.tsx              ← thin: detail card import
      org-units/index.tsx
      config/
        salary-grades/index.tsx      ← thin: CatalogListPage
        contract-types/index.tsx     ← thin: CatalogListPage
        allowance-types/index.tsx    ← thin: CatalogListPage
```
