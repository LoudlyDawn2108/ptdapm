import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { useDebounce } from "./use-debounce";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

interface ListPageSearch {
  page: number;
  pageSize: number;
  search?: string;
}

interface UseListPageOptions {
  search: ListPageSearch;
  onNavigate: (update: Partial<ListPageSearch>) => void;
}

interface UseListPageReturn {
  searchText: string;
  setSearchText: (value: string) => void;
  debouncedSearch: string | undefined;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export function useListPage({ search, onNavigate }: UseListPageOptions): UseListPageReturn {
  const [searchText, setSearchText] = useState(search.search ?? "");
  const debouncedValue = useDebounce(searchText);
  const debouncedSearch = debouncedValue || undefined;

  const pagination: PaginationState = {
    pageIndex: (search.page ?? DEFAULT_PAGE) - 1,
    pageSize: search.pageSize ?? DEFAULT_PAGE_SIZE,
  };

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    onNavigate({
      page: next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  };

  return {
    searchText,
    setSearchText,
    debouncedSearch,
    pagination,
    onPaginationChange,
  };
}
