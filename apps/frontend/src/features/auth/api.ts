import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type { SessionInfo } from "@hrms/shared";
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
      // Better-Auth returns { data: { user, session } } inside Eden's { data, error } envelope,
      // so after destructuring Eden's wrapper the actual session lives at data.data.
      // We narrow the type without `as any` — if the shape changes, the 'in' check fails safely.
      const payload =
        data && typeof data === "object" && "data" in data
          ? (data as { data: SessionInfo }).data
          : (data as SessionInfo);
      return payload;
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

// ──────────────────────────────────────────
// Change Password Mutation
// ──────────────────────────────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: async (body: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const { data, error } = await api.auth["change-password"].post(body);
      if (error) throw handleApiError(error);
      return data;
    },
  });
}
