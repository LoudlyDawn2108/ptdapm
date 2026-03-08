# Frontend Combobox Implementation Plan

Lazy-loaded autocomplete select built on **shadcn/ui** only (no external component libraries).

## Backend Contract

Every config module exposes a `GET /api/config/{module}/dropdown` endpoint:

```
GET /api/config/contract-types/dropdown?search=hop&limit=20

Response: { data: [{ value: "uuid", label: "Hợp đồng không xác định thời hạn" }] }
```

- `search` — optional, filters by `ilike` on label column(s)
- `limit` — optional, default 20, max 100
- Returns only `active` records
- Shape: `DropdownOption[]` = `{ value: string; label: string }[]`

## Component Architecture

### 1. Reusable `<Combobox />` component

Built from shadcn/ui primitives: `Popover` + `Command` (which uses `cmdk` internally).

```
Popover
└── PopoverTrigger (Button showing selected label or placeholder)
└── PopoverContent
    └── Command
        ├── CommandInput (search input, debounced)
        ├── CommandEmpty (no results message)
        ├── CommandList
        │   └── CommandItem[] (dropdown options)
        └── CommandLoading (spinner while fetching)
```

**Props:**

```tsx
interface ComboboxProps {
  // Data fetching
  queryKey: string[];                     // TanStack Query cache key base
  fetchOptions: (search: string) => Promise<DropdownOption[]>;

  // Form integration
  value: string;                          // controlled value (the uuid)
  onChange: (value: string) => void;       // called on selection
  onBlur?: () => void;                    // for react-hook-form field registration

  // UI
  placeholder?: string;                   // e.g. "Chọn loại hợp đồng..."
  emptyMessage?: string;                  // e.g. "Không tìm thấy."
  disabled?: boolean;
  className?: string;
}
```

### 2. TanStack Query hook — `useDropdownQuery`

Reusable hook that all combobox instances call:

```tsx
function useDropdownQuery(
  queryKey: string[],
  fetchFn: (search: string) => Promise<DropdownOption[]>,
  search: string,
) {
  return useQuery({
    queryKey: [...queryKey, search],
    queryFn: () => fetchFn(search),
    placeholderData: keepPreviousData,     // keeps old list visible while new search loads
    staleTime: 30_000,                     // dropdown data rarely changes
    enabled: true,                         // always fetch (including empty search = top 20)
  });
}
```

### 3. Eden Treaty fetch functions

One per entity, in `src/lib/api/` or co-located with the feature:

```tsx
// src/lib/api/config.ts
import type { DropdownOption } from "@hrms/shared";
import { api } from "./client";  // Eden Treaty client

export async function fetchContractTypeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["contract-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw error;
  return data.data;
}
```

## Integration with React Hook Form

### Using `<Controller />` (recommended)

```tsx
<Controller
  name="contractTypeId"
  control={control}
  render={({ field }) => (
    <Combobox
      queryKey={["contract-types", "dropdown"]}
      fetchOptions={fetchContractTypeDropdown}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      placeholder="Chọn loại hợp đồng..."
    />
  )}
/>
```

Field-level validation errors from the backend (`FieldErrorResponse`) are handled by the existing `useMutation` error handler — it calls `setError("contractTypeId", { message })` which displays inline under the combobox.

## Key Implementation Details

### Search debouncing

Debounce the `CommandInput` value change by **300ms** before updating the query string. Use a simple `useDebounce` hook:

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### Selected item display

When the popover is closed, the trigger button shows the label of the selected option. Since we only store the `value` (uuid), we need the label. Two options:

1. **Cache hit** — if the option is in the TanStack Query cache from a previous fetch, read it directly
2. **Initial load with empty search** — on mount, fetch with no search term to get top 20 (selected item likely included for recently created records)
3. **Fallback** — if the selected value isn't in any cached result, show the uuid temporarily and it resolves on next fetch

Recommended: Store both `value` and `label` in form state, or use a separate `useQuery` to resolve a single ID to its label.

### Keyboard navigation

Handled automatically by `cmdk` (the engine behind shadcn's `Command` component). Arrow keys, Enter to select, Escape to close — all built in.

### Loading state

Show `<CommandLoading />` inside the command list while `useDropdownQuery` is in `isFetching` state. The `keepPreviousData` option ensures the previous results stay visible during refetch.

## File structure

```
src/
├── components/ui/
│   └── combobox.tsx              # Reusable Combobox (Popover + Command)
├── hooks/
│   ├── use-debounce.ts           # Generic debounce hook
│   └── use-dropdown-query.ts     # TanStack Query wrapper for dropdown fetching
└── lib/api/
    └── config.ts                 # Eden Treaty fetch functions for config dropdowns
```

## Shadcn/ui components needed

Install via `bunx shadcn@latest add`:

- `popover` (if not already installed)
- `command` (installs `cmdk` as dependency)
- `button` (likely already installed)

## Checklist

- [ ] Install shadcn `command` and `popover` components
- [ ] Create `useDebounce` hook
- [ ] Create `useDropdownQuery` hook
- [ ] Create `<Combobox />` component
- [ ] Create Eden Treaty fetch function for contract types dropdown
- [ ] Integrate with a form using `<Controller />`
- [ ] Test: type in search → debounced fetch → results update
- [ ] Test: select item → popover closes → trigger shows label
- [ ] Test: clear search → shows top 20 active items
- [ ] Test: backend returns `FieldErrorResponse` → inline error shows under combobox
