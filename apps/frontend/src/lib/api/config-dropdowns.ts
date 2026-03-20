import { api } from "@/api/client";
import type { DropdownOption } from "@/components/ui/combobox";
import { handleApiError } from "@/lib/error-handler";

export async function fetchContractTypeDropdown(
  search: string,
): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["contract-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchAllowanceTypeDropdown(
  search: string,
): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["allowance-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchSalaryGradeDropdown(
  search: string,
): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["salary-grades"].dropdown.get({
    query: { search: search || undefined, limit: 50 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchOrgUnitDropdown(
  search: string,
): Promise<DropdownOption[]> {
  const { data, error } = await api.api["org-units"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchTrainingTypeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["training-types"].dropdown.get({
    query: { search: search || undefined, limit: 50 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchTrainingTypeDropdown(
  search: string,
): Promise<DropdownOption[]> {
  const { data, error } = await (api.api.config as any)[
    "training-types"
  ].dropdown.get({
    query: { search: search || undefined, limit: 50 },
  });
  if (error) throw error;
  return (data as any)?.data ?? [];
}
