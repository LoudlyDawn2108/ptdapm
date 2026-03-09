import { api } from "@/api/client";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { PageHeader } from "@/components/ui/PageHeader";
import type { CreateEmployeeInput } from "@hrms/shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";

const createRoute = createFileRoute as unknown as (
  path: string,
) => (config: { component: React.ComponentType }) => unknown;

export const Route = createRoute("/_authenticated/employees/new")({
  component: EmployeeCreatePage,
});

type EmployeeCreateResponse = {
  data?: {
    data?: {
      id: string;
    };
  };
};

type EmployeesApi = {
  post: (args: { body: CreateEmployeeInput }) => Promise<EmployeeCreateResponse>;
};

const employeesApi = (api as unknown as { employees: EmployeesApi }).employees;

function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: CreateEmployeeInput) => {
    setLoading(true);
    const response = await employeesApi.post({ body: values });
    setLoading(false);

    const employeeId = response.data?.data?.id;
    if (employeeId) {
      navigate({ to: "/employees/$id", params: { id: employeeId } });
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
        />
      </div>
    </div>
  );
}
