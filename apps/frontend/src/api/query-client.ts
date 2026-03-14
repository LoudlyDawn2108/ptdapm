import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds — good for HRMS data
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: false, // Don't refetch when tab is focused
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});
