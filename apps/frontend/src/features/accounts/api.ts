import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type {
  AuthUserStatusCode,
  CreateAccountInput,
  RoleCode,
  SetAccountStatusInput,
  UpdateAccountInput,
} from "@hrms/shared";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

// ──────────────────────────────────────────
// Keys
// ──────────────────────────────────────────
export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...accountKeys.lists(), params] as const,
  detail: (id: string) => [...accountKeys.all, "detail", id] as const,
};

// ──────────────────────────────────────────
// Queries
// ──────────────────────────────────────────
export const accountListOptions = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: RoleCode;
  status?: AuthUserStatusCode;
}) =>
  queryOptions({
    queryKey: accountKeys.list(params),
    queryFn: async () => {
      const { data, error } = await api.api.accounts.get({
        query: {
          ...params,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
        },
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export const accountDetailOptions = (id: string) =>
  queryOptions({
    queryKey: accountKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.api.accounts({ id }).get();
      if (error) throw handleApiError(error);
      return data;
    },
    enabled: !!id,
  });

// ──────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────
export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAccountInput) => {
      const { data, error } = await api.api.accounts.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.lists() }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateAccountInput & { id: string }) => {
      const { data, error } = await api.api.accounts({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: accountKeys.lists() });
      qc.invalidateQueries({ queryKey: accountKeys.detail(vars.id) });
    },
  });
}

export function useSetAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AuthUserStatusCode }) => {
      const { data, error } = await api.api.accounts({ id }).status.patch({ status });
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.lists() }),
  });
}
