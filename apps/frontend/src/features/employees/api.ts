import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "@hrms/shared";

// ──────────────────────────────────────────
// Keys
// ──────────────────────────────────────────
export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...employeeKeys.lists(), params] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
  me: () => [...employeeKeys.all, "me"] as const,
};

// ──────────────────────────────────────────
// Queries
// ──────────────────────────────────────────
export const employeeListOptions = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  orgUnitId?: string;
  workStatus?: string;
  contractStatus?: string;
  gender?: string;
  academicRank?: string;
}) =>
  queryOptions({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      // Strip undefined/null/empty values — Eden serializes them as "undefined" string
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== ""),
      );
      const { data, error } = await api.api.employees.get({ query: cleanParams as any });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export const employeeDetailOptions = (id: string) =>
  queryOptions({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.api.employees({ employeeId: id }).get();
      if (error) throw handleApiError(error);
      return data;
    },
    enabled: !!id,
  });

export const myEmployeeOptions = () =>
  queryOptions({
    queryKey: employeeKeys.me(),
    queryFn: async () => {
      const { data, error } = await api.api.employees.me.get();
      if (error) throw handleApiError(error);
      return data;
    },
  });

// ──────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────
export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const { data, error } = await api.api.employees.post(input as any);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.lists() }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateEmployeeInput & { id: string }) => {
      const { data, error } = await api.api.employees({ employeeId: id }).put(input as any);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: employeeKeys.lists() });
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.id) });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.employees({ employeeId: id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.lists() }),
  });
}

export function useMarkResigned() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data, error } = await api.api.employees({ employeeId: id }).put({
        workStatus: "terminated",
        terminationReason: reason,
      } as any);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: employeeKeys.lists() });
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.id) });
    },
  });
}
