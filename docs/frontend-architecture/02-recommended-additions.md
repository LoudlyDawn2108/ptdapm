# 02 — Recommended Library Additions

## Must-Have (🔴 Critical)

### @tanstack/react-query

**Why**: Eden Treaty is just a typed `fetch` wrapper — it doesn't cache, deduplicate requests, background-refetch, or manage loading/error states. An HRMS with 10+ list views, detail pages, and mutations **needs** a server-state cache layer.

Your combobox plan already uses TanStack Query (`useDropdownQuery` with `keepPreviousData`, `staleTime`).

```bash
bun add @tanstack/react-query --filter @hrms/frontend
```

**What it gives you**:
- Automatic caching + background refetching
- `useMutation` with optimistic updates + cache invalidation
- `queryOptions()` factories composable with TanStack Router loaders
- Loading/error/success states per query
- Deduplicated requests (multiple components requesting same data = 1 fetch)
- Devtools for debugging query state

---

### @tanstack/react-table

**Why**: You have 10+ paginated, filterable, sortable tables — employees, accounts, audit logs, allowances, family members, contracts, training courses, config catalogs, etc. Building this from scratch every time is painful and inconsistent.

```bash
bun add @tanstack/react-table --filter @hrms/frontend
```

**What it gives you**:
- Headless (works perfectly with shadcn `<Table>`)
- Column definitions, sorting, filtering, pagination — all type-safe
- Server-side pagination/sorting support (you control the data source)
- Reusable `<DataTable>` component wrapping shadcn primitives

---

### sonner

**Why**: Backend returns `{ type: "toast", error: "..." }` for user-facing errors. You need a toast library. Sonner is lightweight, beautiful, and is the recommended toast for shadcn/ui.

```bash
bun add sonner --filter @hrms/frontend
```

**What it gives you**:
- `toast.success(...)`, `toast.error(...)` — one-liner notifications
- Auto-dismiss, stacking, positioning
- Zero config, just add `<Toaster />` to root layout
- Perfect mapping to backend toast errors

---

## High Priority (🟡)

### react-day-picker

**Why**: Multiple date inputs needed — DOB, contract dates, training registration windows, effective dates, decision dates. shadcn's `<DatePicker>` component wraps react-day-picker.

```bash
bun add react-day-picker --filter @hrms/frontend
```

> **Note**: You already have `date-fns` which react-day-picker uses as its date library. Perfect alignment.

---

### @tanstack/react-query-devtools (devDependency)

**Why**: Essential for debugging query cache during development — see which queries are loading, stale, error, or cached.

```bash
bun add -D @tanstack/react-query-devtools --filter @hrms/frontend
```

---

## Not Needed (❌ Skip)

| Library | Why Skip |
|---|---|
| Redux / MobX / Jotai | Zustand is sufficient; conventions restrict it to auth + UI state |
| axios / ky / ofetch | Eden Treaty handles all API calls type-safe |
| react-router | Already on TanStack Router |
| styled-components / emotion | Tailwind + CVA covers all styling |
| dayjs / moment | date-fns is already installed and tree-shakeable |
| nuqs | TanStack Router's `validateSearch` already handles URL state with Zod |
| react-select | Combobox plan uses shadcn Popover + Command (cmdk) |
| formik | React Hook Form is already chosen and superior for performance |

---

## Install Command (all at once)

```bash
bun add @tanstack/react-query @tanstack/react-table sonner react-day-picker --filter @hrms/frontend
bun add -D @tanstack/react-query-devtools --filter @hrms/frontend
```

---

## shadcn Components to Install

These are the shadcn/ui primitives you'll need. Install as needed:

```bash
# Core (needed immediately)
bunx shadcn@latest add button input label form select dialog
bunx shadcn@latest add table card badge separator skeleton
bunx shadcn@latest add dropdown-menu popover command tooltip
bunx shadcn@latest add sheet tabs avatar

# Forms (needed for create/edit flows)
bunx shadcn@latest add textarea checkbox radio-group switch
bunx shadcn@latest add calendar date-picker

# Feedback
bunx shadcn@latest add alert alert-dialog sonner
bunx shadcn@latest add progress spinner

# Navigation
bunx shadcn@latest add breadcrumb pagination
bunx shadcn@latest add sidebar navigation-menu
```
