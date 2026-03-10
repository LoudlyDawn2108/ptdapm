import { api } from "@/api/client";
import { EmployeeDisplay } from "@/components/employees/EmployeeDisplay";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Modal } from "@/components/ui/Modal";
import {
  AcademicRank,
  AcademicTitle,
  ContractStatus,
  type CreateEmployeeInput,
  EducationLevel,
  Gender,
  TrainingLevel,
  WorkStatus,
} from "@hrms/shared";
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
  $employeeId: {
    put: (args: {
      params: { employeeId: string };
      body: CreateEmployeeInput;
    }) => Promise<EmployeeUpdateResponse>;
  };
};

const employeesApi = (api.api as unknown as { employees: EmployeesApi }).employees;

const isEnumValue = <T extends Record<string, unknown>>(
  enumRecord: T,
  value: string | null | undefined,
): value is Extract<keyof T, string> => value != null && value in enumRecord;

function EmployeePersonalInfoTab() {
  const { employeeId } = Route.useParams();
  const { employee, reload } = useEmployeeDetail() as EmployeeDetailContextValue;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const formDefaultValues = React.useMemo(
    () =>
      employee
        ? {
            ...employee,
            staffCode: employee.staffCode ?? undefined,
            fullName: employee.fullName ?? undefined,
            dob: employee.dob ?? undefined,
            gender: isEnumValue(Gender, employee.gender) ? employee.gender : undefined,
            nationalId: employee.nationalId ?? undefined,
            hometown: employee.hometown ?? undefined,
            address: employee.address ?? undefined,
            taxCode: employee.taxCode ?? undefined,
            socialInsuranceNo: employee.socialInsuranceNo ?? undefined,
            healthInsuranceNo: employee.healthInsuranceNo ?? undefined,
            email: employee.email ?? undefined,
            phone: employee.phone ?? undefined,
            isForeigner: employee.isForeigner ?? undefined,
            educationLevel: isEnumValue(EducationLevel, employee.educationLevel)
              ? employee.educationLevel
              : undefined,
            trainingLevel: isEnumValue(TrainingLevel, employee.trainingLevel)
              ? employee.trainingLevel
              : undefined,
            academicTitle: isEnumValue(AcademicTitle, employee.academicTitle)
              ? employee.academicTitle
              : undefined,
            academicRank: isEnumValue(AcademicRank, employee.academicRank)
              ? employee.academicRank
              : undefined,
            workStatus: isEnumValue(WorkStatus, employee.workStatus)
              ? employee.workStatus
              : undefined,
            contractStatus: isEnumValue(ContractStatus, employee.contractStatus)
              ? employee.contractStatus
              : undefined,
            currentOrgUnitId: employee.currentOrgUnitId ?? undefined,
            currentPositionTitle: employee.currentPositionTitle ?? undefined,
            salaryGradeStepId: employee.salaryGradeStepId ?? undefined,
            portraitFileId: employee.portraitFileId ?? undefined,
          }
        : undefined,
    [employee],
  );

  const handleSubmit = async (values: CreateEmployeeInput) => {
    setLoading(true);
    await employeesApi.$employeeId.put({ params: { employeeId }, body: values });
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
        <EmployeeDisplay
          data={{
            ...employee,
            gender: isEnumValue(Gender, employee.gender) ? employee.gender : null,
            educationLevel: isEnumValue(EducationLevel, employee.educationLevel)
              ? employee.educationLevel
              : null,
            trainingLevel: isEnumValue(TrainingLevel, employee.trainingLevel)
              ? employee.trainingLevel
              : null,
            academicTitle: isEnumValue(AcademicTitle, employee.academicTitle)
              ? employee.academicTitle
              : null,
            academicRank: isEnumValue(AcademicRank, employee.academicRank)
              ? employee.academicRank
              : null,
            workStatus: isEnumValue(WorkStatus, employee.workStatus) ? employee.workStatus : null,
            contractStatus: isEnumValue(ContractStatus, employee.contractStatus)
              ? employee.contractStatus
              : null,
          }}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Chưa có dữ liệu cá nhân
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Cập nhật thông tin cá nhân">
        <EmployeeForm
          defaultValues={formDefaultValues}
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
