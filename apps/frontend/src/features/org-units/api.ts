import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";

// ──────────────────────────────────────────
// Keys
// ──────────────────────────────────────────
export const orgUnitKeys = {
  all: ["org-units"] as const,
  tree: () => [...orgUnitKeys.all, "tree"] as const,
  dropdown: (search?: string) =>
    [...orgUnitKeys.all, "dropdown", search ?? ""] as const,
  detail: (id: string) => [...orgUnitKeys.all, "detail", id] as const,
};

// ──────────────────────────────────────────
// Queries
// ──────────────────────────────────────────
export const orgUnitTreeOptions = () =>
  queryOptions({
    queryKey: orgUnitKeys.tree(),
    queryFn: async () => {
      const { data, error } = await api.api["org-units"].tree.get();
      if (error) throw handleApiError(error);
      return data;
    },
    staleTime: 60_000,
  });

export const orgUnitDropdownOptions = (search?: string) =>
  queryOptions({
    queryKey: orgUnitKeys.dropdown(search),
    queryFn: async () => {
      const { data, error } = await api.api["org-units"].dropdown.get({
        query: { search, limit: 20 },
      });
      if (error) throw handleApiError(error);
      return data;
    },
    staleTime: 30_000,
  });

export const orgUnitDetailOptions = (id: string) =>
  queryOptions({
    queryKey: orgUnitKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.api["org-units"]({ id }).get();
      if (error) throw handleApiError(error);
      return data;
    },
    enabled: !!id,
  });

// ──────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────
export function useCreateOrgUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data, error } = await api.api["org-units"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: orgUnitKeys.all }),
  });
}

export function useUpdateOrgUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data, error } = await api.api["org-units"]({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data: any, vars: any) => {
      qc.invalidateQueries({ queryKey: orgUnitKeys.all });
      qc.invalidateQueries({ queryKey: orgUnitKeys.detail(vars.id) });
    },
  });
}

export function useDissolveOrgUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data, error } = await api.api["org-units"]({ id }).dissolve.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: orgUnitKeys.all }),
  });
}

export function useMergeOrgUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data, error } = await api.api["org-units"]({ id }).merge.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: orgUnitKeys.all }),
  });
}
