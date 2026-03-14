import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

// ──────────────────────────────────────────
// Keys
// ──────────────────────────────────────────
export const dashboardKeys = {
  statistics: ["dashboard", "statistics"] as const,
};

// ──────────────────────────────────────────
// Queries
// ──────────────────────────────────────────
export const statisticsOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.statistics,
    queryFn: async () => {
      const { data, error } = await api.api.dashboard.statistics.get();
      if (error) throw handleApiError(error);
      return data;
    },
    staleTime: 60_000, // 1 minute
  });
