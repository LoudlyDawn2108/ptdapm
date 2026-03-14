import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type { CreateContractTypeInput, UpdateContractTypeInput } from "@hrms/shared";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

export const contractTypeKeys = {
  all: ["contract-types"] as const,
  lists: () => [...contractTypeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...contractTypeKeys.lists(), params] as const,
};

export const contractTypeListOptions = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) =>
  queryOptions({
    queryKey: contractTypeKeys.list(params),
    queryFn: async () => {
      const { data, error } = await api.api.config["contract-types"].get({
        query: params as Record<string, unknown>,
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export function useCreateContractType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateContractTypeInput) => {
      const { data, error } = await api.api.config["contract-types"].post(
        input as Record<string, unknown>,
      );
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contractTypeKeys.lists() }),
  });
}

export function useUpdateContractType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateContractTypeInput & { id: string }) => {
      const { data, error } = await api.api.config["contract-types"]({ id }).put(
        input as Record<string, unknown>,
      );
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contractTypeKeys.lists() }),
  });
}

export function useDeleteContractType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.config["contract-types"]({ id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contractTypeKeys.lists() }),
  });
}
