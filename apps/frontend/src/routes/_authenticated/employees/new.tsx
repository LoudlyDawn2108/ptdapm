import { employeesApi } from "@/api/client";
import { EmployeeForm, type ServerFieldErrors } from "@/components/employees/EmployeeForm";
import { PageHeader } from "@/components/ui/PageHeader";
import type { CreateEmployeeInput, ErrorResponse } from "@hrms/shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/employees/new")({
  component: EmployeeCreatePage,
});

const CONFLICT_FIELD_MAP: Record<string, keyof CreateEmployeeInput> = {
  CCCD: "nationalId",
  Email: "email",
  "Mã cán bộ": "staffCode",
};

function parseConflictToFieldErrors(message: string): ServerFieldErrors {
  for (const [keyword, field] of Object.entries(CONFLICT_FIELD_MAP)) {
    if (message.includes(keyword)) {
      return { [field]: message };
    }
  }
  return { root: message } as unknown as ServerFieldErrors;
}

function parseErrorResponse(
  error: { status: number; value: ErrorResponse } | null,
): ServerFieldErrors | undefined {
  if (!error) return undefined;

  const body = error.value;
  if (body?.type === "field" && body.fields) {
    return body.fields as ServerFieldErrors;
  }
  if (error.status === 409 && body?.type === "toast" && body.error) {
    return parseConflictToFieldErrors(body.error);
  }
  return undefined;
}

function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateEmployeeInput): Promise<ServerFieldErrors | void> => {
    setLoading(true);
    try {
      const response = await employeesApi.post(values);
      const employeeId = response.data?.data?.id;
      if (employeeId) {
        navigate({ to: "/employees/$employeeId", params: { employeeId } });
        return;
      }
      return parseErrorResponse(response.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Thêm mới nhân sự" />
      <div className="rounded-2xl border border-border bg-card p-6">
        <EmployeeForm
          submitLabel="Tạo nhân sự"
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: "/employees" })}
          mode="create"
        />
      </div>
    </div>
  );
}
