import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

// ──────────────────────────────────────────
// Query Keys
// ──────────────────────────────────────────
export const authKeys = {
  session: ["auth", "session"] as const,
};

// ──────────────────────────────────────────
// Session Query Options
// ──────────────────────────────────────────
export const sessionOptions = () =>
  queryOptions({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data, error } = await api.auth.session.get();
      if (error) throw new Error("Not authenticated");
      return data; // { user, session: { expiresAt } }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — session doesn't change often
    retry: false, // Don't retry auth — redirect on failure
  });

// ──────────────────────────────────────────
// Login Mutation
// ──────────────────────────────────────────
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: {
      username: string;
      password: string;
    }) => {
      const { data, error } = await api.auth.login.post(credentials);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => {
      // Invalidate session query to refetch user info
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}

// ──────────────────────────────────────────
// Logout Mutation
// ──────────────────────────────────────────
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.auth.logout.post();
    },
    onSuccess: () => {
      queryClient.clear(); // Wipe all cached data on logout
      window.location.href = "/login"; // Hard redirect to clear all state
    },
  });
}
