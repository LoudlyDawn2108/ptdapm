import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type {
  CreateSalaryGradeInput,
  CreateSalaryGradeStepInput,
  UpdateSalaryGradeInput,
  UpdateSalaryGradeStepInput,
} from "@hrms/shared";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

export const salaryGradeKeys = {
  all: ["salary-grades"] as const,
  lists: () => [...salaryGradeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...salaryGradeKeys.lists(), params] as const,
  detail: (id: string) => [...salaryGradeKeys.all, "detail", id] as const,
  dropdown: (search?: string) => [...salaryGradeKeys.all, "dropdown", search ?? ""] as const,
  steps: (gradeId: string) => [...salaryGradeKeys.all, "steps", gradeId] as const,
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
        query: { page: 1, pageSize: 20, ...params },
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export const salaryGradeDetailOptions = (id: string) =>
  queryOptions({
    queryKey: salaryGradeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.api.config["salary-grades"]({
        id,
      }).get();
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
      const { data, error } = await api.api.config["salary-grades"]({
        id: gradeId,
      }).steps.get();
      if (error) throw handleApiError(error);
      return data;
    },
    enabled: !!gradeId,
  });

export function useCreateSalaryGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateSalaryGradeInput) => {
      const { data, error } = await api.api.config["salary-grades"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: salaryGradeKeys.all }),
  });
}

export function useUpdateSalaryGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateSalaryGradeInput & { id: string }) => {
      const { data, error } = await api.api.config["salary-grades"]({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: salaryGradeKeys.all });
    },
  });
}

export function useDeleteSalaryGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.api.config["salary-grades"]({
        id,
      }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: salaryGradeKeys.all }),
  });
}

// ── Step Mutations ────────────────────────────────────────────────────────
export function useCreateSalaryGradeStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ gradeId, ...input }: CreateSalaryGradeStepInput & { gradeId: string }) => {
      const { data, error } = await api.api.config["salary-grades"]({
        id: gradeId,
      }).steps.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: salaryGradeKeys.all });
    },
  });
}

export function useUpdateSalaryGradeStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gradeId,
      stepId,
      ...input
    }: UpdateSalaryGradeStepInput & { gradeId: string; stepId: string }) => {
      const { data, error } = await api.api.config["salary-grades"]({ id: gradeId })
        .steps({
          stepId,
        })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: salaryGradeKeys.all });
    },
  });
}

export function useDeleteSalaryGradeStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gradeId,
      stepId,
    }: {
      gradeId: string;
      stepId: string;
    }) => {
      const { data, error } = await api.api.config["salary-grades"]({ id: gradeId })
        .steps({
          stepId,
        })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: salaryGradeKeys.all });
    },
  });
}
