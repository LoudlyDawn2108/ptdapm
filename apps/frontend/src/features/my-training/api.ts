import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import type { ParticipationStatusCode } from "@hrms/shared";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { trainingCourseKeys } from "@/features/training-courses/api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const myTrainingKeys = {
  all: ["my-training"] as const,
  lists: () => [...myTrainingKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...myTrainingKeys.lists(), params] as const,
};

// ---------------------------------------------------------------------------
// Types (matching backend response shape)
// ---------------------------------------------------------------------------

export interface MyTrainingRow {
  registrationId: string;
  courseId: string;
  courseName: string;
  courseTypeName: string | null;
  trainingFrom: string;
  trainingTo: string;
  location: string | null;
  courseStatus: string;
  participationStatus: string;
  registeredAt: string;
  cost: string | null;
  registrationLimit: number | null;
  registrationCount: number;
}

// ---------------------------------------------------------------------------
// List my training registrations — GET /api/my/training (UC 4.41)
// ---------------------------------------------------------------------------

export const myTrainingListOptions = (params: {
  page?: number;
  pageSize?: number;
  participationStatus?: ParticipationStatusCode;
}) =>
  queryOptions({
    queryKey: myTrainingKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const { data, error } = await (api.api.my as any).training.get({
        query: params as Record<string, unknown>,
      });
      if (error) throw handleApiError(error);
      return data;
    },
  });

// ---------------------------------------------------------------------------
// Register for a course — POST /api/training-courses/:courseId/registrations (UC 4.40)
// ---------------------------------------------------------------------------

export function useRegisterForCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId }: { courseId: string }) => {
      const res = await (
        api.api["training-courses"]({ courseId }) as any
      ).registrations.post({});
      const { data, error } = res ?? {};
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: myTrainingKeys.lists() });
      qc.invalidateQueries({ queryKey: trainingCourseKeys.all });
    },
  });
}

// ---------------------------------------------------------------------------
// Cancel registration — DELETE /api/training-courses/:courseId/registrations/:id
// ---------------------------------------------------------------------------

export function useCancelRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      registrationId,
    }: {
      courseId: string;
      registrationId: string;
    }) => {
      const res = await (api.api["training-courses"]({ courseId }) as any)
        .registrations({ id: registrationId })
        .delete();
      const { data, error } = res ?? {};
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: myTrainingKeys.lists() });
      qc.invalidateQueries({ queryKey: trainingCourseKeys.all });
    },
  });
}
