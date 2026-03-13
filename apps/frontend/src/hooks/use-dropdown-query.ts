import { queryOptions, keepPreviousData } from "@tanstack/react-query";

export type DropdownOption = { value: string; label: string };

/**
 * Create queryOptions for dropdown/combobox data.
 * Uses keepPreviousData for smooth search transitions.
 */
export function dropdownOptions(
  key: string,
  fetchFn: (search: string) => Promise<DropdownOption[]>,
  search: string,
) {
  return queryOptions({
    queryKey: ["dropdown", key, search],
    queryFn: () => fetchFn(search),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
