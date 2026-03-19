import { api } from "@/api/client";
import { toApi } from "@/api/helpers";
import { handleApiError } from "@/lib/error-handler";
import type {
  AcademicRankCode,
  ContractStatusCode,
  CreateEmployeeBankAccountInput,
  CreateEmployeeFamilyMemberInput,
  CreateEmployeeInput,
  CreateEmployeePartyMembershipInput,
  CreateEmploymentContractInput,
  CreateEvaluationInput,
  FamilyRelationCode,
  GenderCode,
  PartyOrgTypeCode,
  UpdateEmployeeBankAccountInput,
  UpdateEmployeeFamilyMemberInput,
  UpdateEmployeeInput,
  UpdateEmployeePartyMembershipInput,
  UpdateEmploymentContractInput,
  UpdateEvaluationInput,
  WorkStatusCode,
} from "@hrms/shared";
import { createEvaluationSchema, updateEvaluationSchema } from "@hrms/shared";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EmployeeAggregate } from "./types";
import { isEmployeeAggregate } from "./types";
const edenBody = <T>(input: T): any => input;
export type UploadedFile = {
  id: string;
  originalName: string;
  mimeType: string | null;
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function getFileUrl(fileId: string): string {
  return `${apiBaseUrl}/api/files/${fileId}`;
}

function isUploadedFileResponse(value: unknown): value is { data: UploadedFile } {
  if (!value || typeof value !== "object" || !("data" in value)) {
    return false;
  }

  const payload = value.data;
  return (
    !!payload && typeof payload === "object" && "id" in payload && typeof payload.id === "string"
  );
}

/**
 * Upload a file via raw fetch. Eden Treaty does not support multipart/FormData bodies,
 * so we bypass it here while manually mirroring its base URL and credential settings.
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/files/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  } catch {
    throw handleApiError({ status: 0, value: { error: "Không thể tải ảnh lên" } });
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw handleApiError(
      (payload ?? { error: "Tải ảnh lên thất bại" }) as Parameters<typeof handleApiError>[0],
    );
  }

  if (!isUploadedFileResponse(payload)) {
    throw handleApiError({ status: 200, value: { error: "Phản hồi tải ảnh không hợp lệ" } });
  }

  return payload.data;
}

// ──────────────────────────────────────────
// Keys
// ──────────────────────────────────────────
export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...employeeKeys.lists(), params] as const,
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
  workStatus?: WorkStatusCode;
  contractStatus?: ContractStatusCode;
  gender?: GenderCode;
  academicRank?: AcademicRankCode;
}) =>
  queryOptions({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      // Strip undefined/null/empty values — Eden serializes them as "undefined" string
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== ""),
      ) as typeof params;
      const { data, error } = await api.api.employees.get({
        query: { page: 1, pageSize: 20, ...cleanParams },
      });
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

export function useEmployeeDetail(employeeId: string) {
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const raw = data?.data;
  const aggregate = isEmployeeAggregate(raw) ? raw : undefined;
  return { aggregate, employee: aggregate?.employee, isLoading };
}

export function useMyEmployeeDetail() {
  const { data, isLoading } = useQuery(myEmployeeOptions());
  const raw = data?.data;
  const aggregate = isEmployeeAggregate(raw) ? raw : undefined;
  return { aggregate, employee: aggregate?.employee, isLoading };
}

// ──────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────
export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const { data, error } = await api.api.employees.post(input);
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
      const { data, error } = await api.api.employees({ employeeId: id }).put(edenBody(input));
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
      const body: UpdateEmployeeInput = {
        workStatus: "terminated",
        terminationReason: reason,
      };
      const { data, error } = await api.api.employees({ employeeId: id }).put(body);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: employeeKeys.lists() });
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.id) });
    },
  });
}

// ──────────────────────────────────────────
// Sub-entity mutations
// ──────────────────────────────────────────

export function useCreateFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      relation: FamilyRelationCode;
      fullName: string;
      dob?: string;
      phone?: string;
      note?: string;
      isDependent: boolean;
    }) => {
      const { data, error } = await api.api.employees({ employeeId })["family-members"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      bankName: string;
      accountNo: string;
      isPrimary: boolean;
    }) => {
      const { data, error } = await api.api.employees({ employeeId })["bank-accounts"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreatePreviousJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      workplace: string;
      startedOn: string;
      endedOn: string;
      note?: string;
    }) => {
      const { data, error } = await api.api.employees({ employeeId })["previous-jobs"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreatePartyMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      organizationType: PartyOrgTypeCode;
      joinedOn: string;
      details: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["party-memberships"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      relation?: FamilyRelationCode;
      fullName?: string;
      dob?: string;
      phone?: string;
      note?: string;
      isDependent?: boolean;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["family-members"]({ id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      bankName?: string;
      accountNo?: string;
      isPrimary?: boolean;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["bank-accounts"]({ id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdatePreviousJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      workplace?: string;
      startedOn?: string;
      endedOn?: string;
      note?: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["previous-jobs"]({ id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdatePartyMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      organizationType?: PartyOrgTypeCode;
      joinedOn?: string;
      details?: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["party-memberships"]({ id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreateDegree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      degreeName: string;
      school: string;
      degreeFileId?: string;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).degrees.post(edenBody(input));
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateDegree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      degreeName?: string;
      school?: string;
      degreeFileId?: string;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).degrees({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      certName: string;
      issuedBy?: string;
      issuedOn?: string;
      expiresOn?: string;
      certFileId?: string;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).certifications.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      certName?: string;
      issuedBy?: string;
      issuedOn?: string;
      expiresOn?: string;
      certFileId?: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        .certifications({ id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreateForeignWorkPermit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      visaNo?: string;
      visaExpiresOn?: string;
      passportNo?: string;
      passportExpiresOn?: string;
      workPermitNo?: string;
      workPermitExpiresOn?: string;
      workPermitFileId?: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["foreign-work-permits"].post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateForeignWorkPermit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      visaNo?: string;
      visaExpiresOn?: string;
      passportNo?: string;
      passportExpiresOn?: string;
      workPermitNo?: string;
      workPermitExpiresOn?: string;
      workPermitFileId?: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["foreign-work-permits"]({ id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["family-members"]({ id })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["bank-accounts"]({ id })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeletePreviousJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["previous-jobs"]({ id })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeletePartyMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        ["party-memberships"]({ id })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteDegree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).degrees({ id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        .certifications({ id })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

// Allowance mutations
export function useCreateAllowance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: {
      employeeId: string;
      allowanceTypeId: string;
      amount?: number | null;
      note?: string | null;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).allowances.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateAllowance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: {
      employeeId: string;
      id: string;
      allowanceTypeId?: string;
      amount?: number | null;
      note?: string | null;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).allowances({ id }).put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteAllowance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api.employees({ employeeId }).allowances({ id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: { employeeId: string } & CreateEmploymentContractInput) => {
      const { data, error } = await api.api.employees({ employeeId }).contracts.post(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: { employeeId: string; id: string } & UpdateEmploymentContractInput) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        .contracts({ contractId: id })
        .put(input);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
    }: {
      employeeId: string;
      id: string;
    }) => {
      const { data, error } = await api.api
        .employees({ employeeId })
        .contracts({ contractId: id })
        .delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

// ──────────────────────────────────────────
// Evaluation mutations
// ──────────────────────────────────────────

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      ...input
    }: { employeeId: string } & CreateEvaluationInput) => {
      const body = toApi(createEvaluationSchema, input);
      const { data, error } = await api.api.employees({ employeeId }).evaluations.post(body);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useUpdateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      id,
      ...input
    }: { employeeId: string; id: string } & UpdateEvaluationInput) => {
      const body = toApi(updateEvaluationSchema, input);
      const { data, error } = await api.api.employees({ employeeId }).evaluations({ id }).put(body);
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}

export function useDeleteEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ employeeId, id }: { employeeId: string; id: string }) => {
      const { data, error } = await api.api.employees({ employeeId }).evaluations({ id }).delete();
      if (error) throw handleApiError(error);
      return data;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: employeeKeys.detail(vars.employeeId) }),
  });
}
