import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type {
  CreateAllowanceTypeInput,
  UpdateAllowanceTypeInput,
} from "@hrms/shared";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const allowanceTypeKeys = {
  all: ["allowance-types"] as const,
  lists: () => [...allowanceTypeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...allowanceTypeKeys.lists(), params] as const,
};

export const allowanceTypeListOptions = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) =>
  queryOptions({
    queryKey: allowanceTypeKeys.list(params),
    queryFn: async () => {
      const { data, error } = await api.api.config["allowance-types"].get({
        query: params as any,
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export function useCreateAllowanceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAllowanceTypeInput) => {
      const { data, error } = await api.api.config["allowance-types"].post(
        input as any,
      );
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: allowanceTypeKeys.lists() }),
  });
}

export function useUpdateAllowanceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateAllowanceTypeInput & { id: string }) => {
      const { data, error } = await api.api.config["allowance-types"]({
        id,
      }).put(input as any);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: allowanceTypeKeys.lists() }),
  });
}

export function useDeleteAllowanceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await (api.api.config["allowance-types"]({
        id,
      }) as any).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: allowanceTypeKeys.lists() }),
  });
}
