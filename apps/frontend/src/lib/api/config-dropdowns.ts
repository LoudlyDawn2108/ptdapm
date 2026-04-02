import { api } from "@/api/client";
import type { DropdownOption } from "@/components/ui/combobox";
import { handleApiError } from "@/lib/error-handler";
import type { WorkStatusCode } from "@hrms/shared";

export async function fetchContractTypeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["contract-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchAllowanceTypeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["allowance-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchSalaryGradeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["salary-grades"].dropdown.get({
    query: { search: search || undefined, limit: 50 },
  });
  if (error) throw handleApiError(error);
  return (data?.data ?? []) as DropdownOption[];
}

export async function fetchOrgUnitDropdown(search: string): Promise<DropdownOption[]> {
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

type EmployeeDropdownFilters = {
  orgUnitId?: string;
  workStatus?: WorkStatusCode;
};

export function createEmployeeDropdownFetcher(filters?: EmployeeDropdownFilters) {
  return async (search: string): Promise<DropdownOption[]> => {
    const { data, error } = await api.api.employees.dropdown.get({
      query: {
        search: search || undefined,
        limit: 20,
        orgUnitId: filters?.orgUnitId,
        workStatus: filters?.workStatus,
      },
    });
    if (error) throw handleApiError(error);
    return (data?.data ?? []) as DropdownOption[];
  };
}

export async function fetchEmployeeDropdown(search: string): Promise<DropdownOption[]> {
  return createEmployeeDropdownFetcher()(search);
}
