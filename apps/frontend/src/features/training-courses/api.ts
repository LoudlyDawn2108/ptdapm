import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type {
  CreateTrainingCourseInput,
  CreateTrainingResultInput,
  UpdateTrainingCourseInput,
} from "@hrms/shared";
import type { TrainingStatusCode, ParticipationStatusCode } from "@hrms/shared";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const trainingCourseKeys = {
  all: ["training-courses"] as const,
  lists: () => [...trainingCourseKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...trainingCourseKeys.lists(), params] as const,
  detail: (id: string) => [...trainingCourseKeys.all, "detail", id] as const,
};

export const trainingCourseListOptions = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TrainingStatusCode;
}) =>
  queryOptions({
    queryKey: trainingCourseKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const { data, error } = await api.api["training-courses"].get({
        query: params as Record<string, unknown>,
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

export const trainingTypeDropdownOptions = queryOptions({
  queryKey: ["training-types", "dropdown"],
  queryFn: async () => {
    const { data, error } = await (api.api.config as any)[
      "training-types"
    ].dropdown.get({
      query: { limit: 100 },
    });
    if (error) throw handleApiError(error);
    return (data as any)?.data as Array<{ value: string; label: string }>;
  },
});

export function useCreateTrainingCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTrainingCourseInput) => {
      const { data, error } = await api.api["training-courses"].post(
        input as Record<string, unknown>,
      );
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: trainingCourseKeys.lists() }),
  });
}

export function useUpdateTrainingCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      ...input
    }: UpdateTrainingCourseInput & { courseId: string }) => {
      const { data, error } = await api.api["training-courses"]({
        courseId,
      }).put(input as Record<string, unknown>);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: trainingCourseKeys.lists() }),
  });
}

// ---------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------

export interface TrainingCourseDetail {
  id: string;
  courseName: string;
  courseTypeId: string;
  trainingFrom: string;
  trainingTo: string;
  location: string | null;
  cost: string | null;
  commitment: string | null;
  certificateName: string | null;
  certificateType: string | null;
  registrationFrom: string | null;
  registrationTo: string | null;
  registrationLimit: number | null;
  status: TrainingStatusCode;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  courseType: { id: string; typeName: string } | null;
  registrationCount: number;
  registrations: Array<{
    id: string;
    employeeId: string;
    registeredAt: string;
    participationStatus: ParticipationStatusCode;
    fullName: string;
    staffCode: string;
    currentOrgUnitId: string | null;
    orgUnitName: string | null;
  }>;
}

export const trainingCourseDetailOptions = (courseId: string) =>
  queryOptions({
    queryKey: trainingCourseKeys.detail(courseId),
    queryFn: async () => {
      const { data, error } = await api.api["training-courses"]({
        courseId,
      }).get();
      if (error) throw handleApiError(error);
      return (data as any)?.data as TrainingCourseDetail;
    },
    enabled: !!courseId,
  });

export function useTrainingCourseDetail(courseId: string) {
  const { data, isLoading } = useQuery(trainingCourseDetailOptions(courseId));
  return { course: data, isLoading };
}

// ---------------------------------------------------------------------------
// Training Results (UC 4.36)
// ---------------------------------------------------------------------------

export function useCreateTrainingResult(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTrainingResultInput) => {
      const { data, error } = await (
        api.api["training-courses"]({ courseId }) as any
      ).results.post(input as Record<string, unknown>);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: trainingCourseKeys.detail(courseId) }),
  });
}
