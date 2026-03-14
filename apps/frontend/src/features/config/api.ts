import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";

// ──────────────────────────────────────────
// Salary Grades Keys
// ──────────────────────────────────────────
export const salaryGradeKeys = {
  all: ["salary-grades"] as const,
  lists: () => [...salaryGradeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...salaryGradeKeys.lists(), params] as const,
  detail: (id: string) => [...salaryGradeKeys.all, "detail", id] as const,
  dropdown: (search?: string) =>
    [...salaryGradeKeys.all, "dropdown", search ?? ""] as const,
  steps: (gradeId: string) =>
    [...salaryGradeKeys.all, "steps", gradeId] as const,
};

export const salaryGradeListOptions = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) =>
  queryOptions({
    queryKey: salaryGradeKeys.list(params),
    queryFn: async () => {
      const { data, error } = await api.api.config["salary-grades"].get({
        query: params as any,
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export const salaryGradeDetailOptions = (id: string) =>
  queryOptions({
    queryKey: salaryGradeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.api.config["salary-grades"]({ id }).get();
      if (error) throw handleApiError(error);
      return data;
    },
    enabled: !!id,
  });

export const salaryGradeDropdownOptions = (search?: string) =>
  queryOptions({
    queryKey: salaryGradeKeys.dropdown(search),
    queryFn: async () => {
      const { data, error } = await api.api.config["salary-grades"].dropdown.get({
        query: { search, limit: 50 },
      });
      if (error) throw handleApiError(error);
      return data;
    },
    staleTime: 60_000,
  });

export const salaryGradeStepsOptions = (gradeId: string) =>
  queryOptions({
    queryKey: salaryGradeKeys.steps(gradeId),
    queryFn: async () => {
      const { data, error } = await api.api.config["salary-grades"]({ id: gradeId }).steps.get();
      if (error) throw handleApiError(error);
      return data;
    },
    enabled: !!gradeId,
  });

export function useCreateSalaryGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data, error } = await api.api.config["salary-grades"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: salaryGradeKeys.lists() }),
  });
}

export function useUpdateSalaryGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data, error } = await api.api.config["salary-grades"]({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_: any, vars: any) => {
      qc.invalidateQueries({ queryKey: salaryGradeKeys.lists() });
      qc.invalidateQueries({ queryKey: salaryGradeKeys.detail(vars.id) });
    },
  });
}

export function useDeleteSalaryGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.config["salary-grades"]({ id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: salaryGradeKeys.lists() }),
  });
}

// ──────────────────────────────────────────
// Contract Types Keys
// ──────────────────────────────────────────
export const contractTypeKeys = {
  all: ["contract-types"] as const,
  lists: () => [...contractTypeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...contractTypeKeys.lists(), params] as const,
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
        query: params as any,
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export function useCreateContractType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data, error } = await api.api.config["contract-types"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contractTypeKeys.lists() }),
  });
}

export function useUpdateContractType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data, error } = await api.api.config["contract-types"]({ id }).put(input);
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

// ──────────────────────────────────────────
// Allowance Types Keys
// ──────────────────────────────────────────
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
    mutationFn: async (input: any) => {
      const { data, error } = await api.api.config["allowance-types"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: allowanceTypeKeys.lists() }),
  });
}

export function useUpdateAllowanceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: any) => {
      const { data, error } = await api.api.config["allowance-types"]({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: allowanceTypeKeys.lists() }),
  });
}

export function useDeleteAllowanceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.config["allowance-types"]({ id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: allowanceTypeKeys.lists() }),
  });
}
