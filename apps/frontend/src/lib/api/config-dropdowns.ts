import { api } from "@/api/client";
import type { DropdownOption } from "@/components/ui/combobox";

/**
 * Eden Treaty fetch functions for config dropdown endpoints.
 * Each returns DropdownOption[] = { value, label }[].
 */

export async function fetchContractTypeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["contract-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw error;
  return (data as any)?.data ?? [];
}

export async function fetchAllowanceTypeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["allowance-types"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw error;
  return (data as any)?.data ?? [];
}

export async function fetchSalaryGradeDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api.config["salary-grades"].dropdown.get({
    query: { search: search || undefined, limit: 50 },
  });
  if (error) throw error;
  return (data as any)?.data ?? [];
}

export async function fetchOrgUnitDropdown(search: string): Promise<DropdownOption[]> {
  const { data, error } = await api.api["org-units"].dropdown.get({
    query: { search: search || undefined, limit: 20 },
  });
  if (error) throw error;
  return (data as any)?.data ?? [];
}
