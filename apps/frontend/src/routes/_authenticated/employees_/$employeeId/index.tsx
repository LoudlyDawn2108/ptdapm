import { api } from "@/api/client";
import { EmployeeDisplay } from "@/components/employees/EmployeeDisplay";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Modal } from "@/components/ui/Modal";
import type { CreateEmployeeInput } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { type EmployeeDetailContextValue, useEmployeeDetail } from "../$employeeId";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/")({
  component: EmployeePersonalInfoTab,
});

type EmployeeUpdateResponse = {
  data?: {
    data?: {
      id: string;
    };
  };
};

type EmployeesApi = {
  $id: {
    put: (args: {
      params: { id: string };
      body: CreateEmployeeInput;
    }) => Promise<EmployeeUpdateResponse>;
  };
};

const employeesApi = (api as unknown as { employees: EmployeesApi }).employees;

function EmployeePersonalInfoTab() {
  const { employeeId } = Route.useParams();
  const { employee, reload } = useEmployeeDetail() as EmployeeDetailContextValue;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: CreateEmployeeInput) => {
    setLoading(true);
    await employeesApi["$id"].put({ params: { id: employeeId }, body: values });
    setLoading(false);
    setOpen(false);
    await reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
          onClick={() => setOpen(true)}
        >
          Chỉnh sửa thông tin
        </button>
      </div>

      {employee ? (
        <EmployeeDisplay data={employee} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Chưa có dữ liệu cá nhân
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Cập nhật thông tin cá nhân">
        <EmployeeForm
          defaultValues={
            employee
              ? {
                  ...employee,
                  staffCode: employee.staffCode ?? undefined,
                  fullName: employee.fullName ?? undefined,
                  workStatus: employee.workStatus ?? undefined,
                }
              : undefined
          }
          loading={loading}
          submitLabel="Lưu thay đổi"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          className="mt-4"
        />
      </Modal>
    </div>
  );
}
