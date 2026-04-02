import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField, SectionTitle } from "@/components/shared/read-only-field";
import { RoleGuard } from "@/components/shared/role-guard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks";
import { allowanceTypeListOptions } from "@/features/config/allowance-types/api";
import {
  salaryGradeDropdownOptions,
  salaryGradeStepsOptions,
} from "@/features/config/salary-grades/api";
import {
  employeeDetailOptions,
  useCreateAllowance,
  useUpdateAllowance,
  useUpdateEmployee,
} from "@/features/employees/api";
import { ApiResponseError, applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AllowanceAssignmentStatus,
  type AllowanceAssignmentStatusCode,
  type CreateEmployeeAllowanceFormInput,
  type CreateEmployeeAllowanceInput,
  type DropdownOption,
  EMPLOYEE_PROFILE_MANAGE_ROLES,
  createEmployeeAllowanceSchema,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/salary")({
  component: SalaryTab,
});

type EmployeeRecord = {
  staffCode?: string | null;
  salaryGradeStepId?: string | null;
};

type SalaryGradeSummary = {
  id?: string;
  gradeId?: string;
  salaryGradeId?: string;
  gradeName?: string | null;
  stepName?: string | null;
  coefficient?: string | number | null;
};

type EmployeeAllowanceRow = {
  id: string;
  allowanceTypeId?: string | null;
  allowanceName?: string | null;
  amount?: number | string | null;
  note?: string | null;
  status?: AllowanceAssignmentStatusCode | null;
  allowanceTypeStatus?: string | null;
};

type SalaryAggregate = {
  employee?: EmployeeRecord | null;
  salaryGradeStep?: SalaryGradeSummary | null;
  allowances?: EmployeeAllowanceRow[];
};

type SalaryGradeStepOption = {
  id: string;
  salaryGradeId: string;
  stepNo: number;
  coefficient: string | number;
  status?: string;
};

type AllowanceTypeOption = {
  id: string;
  allowanceName: string;
  defaultAmount?: number | string | null;
  status?: string;
};

function parseSalaryCoefficient(value?: string | number | null): number | null {
  if (value == null) {
    return null;
  }

  const coefficient = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(coefficient) ? coefficient : null;
}

const EMPTY_ALLOWANCE_FORM_VALUES: CreateEmployeeAllowanceFormInput = {
  allowanceTypeId: "",
  status: "active",
  note: "",
};

function AllowanceStatusBadge({ status }: { status?: string }) {
  const isActive = !status || status === "ACTIVE" || status === "active";

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Đang hoạt động
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Ngừng sử dụng
    </span>
  );
}

function SalaryTab() {
  const { employeeId } = Route.useParams();
  const { hasRole } = useAuth();
  const [showSalaryDialog, setShowSalaryDialog] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedStepId, setSelectedStepId] = useState("");
  const [showAddAllowanceDialog, setShowAddAllowanceDialog] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<EmployeeAllowanceRow | null>(null);

  const updateEmployeeMutation = useUpdateEmployee();
  const createAllowanceMutation = useCreateAllowance();
  const updateAllowanceMutation = useUpdateAllowance();

  const allowanceForm = useForm<
    CreateEmployeeAllowanceFormInput,
    unknown,
    CreateEmployeeAllowanceInput
  >({
    resolver: zodResolver(createEmployeeAllowanceSchema),
    defaultValues: EMPTY_ALLOWANCE_FORM_VALUES,
  });

  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const { data: salaryGradesData } = useQuery(salaryGradeDropdownOptions());
  const { data: salaryGradeStepsData } = useQuery(salaryGradeStepsOptions(selectedGradeId));
  const { data: allowanceTypesData } = useQuery(
    allowanceTypeListOptions({ page: 1, pageSize: 100, search: undefined }),
  );

  const aggregate = data?.data as SalaryAggregate | undefined;
  const emp = aggregate?.employee;
  const salary = aggregate?.salaryGradeStep;
  const allowances = aggregate?.allowances;
  const salaryGrades = (salaryGradesData?.data ?? []) as DropdownOption[];
  const salarySteps = (salaryGradeStepsData?.data ?? []) as SalaryGradeStepOption[];
  const allowanceTypes = (allowanceTypesData?.data?.items ?? []) as AllowanceTypeOption[];
  const isAllowanceDialogOpen = showAddAllowanceDialog || editingAllowance !== null;
  const isAllowanceSubmitting =
    createAllowanceMutation.isPending || updateAllowanceMutation.isPending;
  const canManage = hasRole(...EMPLOYEE_PROFILE_MANAGE_ROLES);

  const currentGradeId =
    typeof salary?.salaryGradeId === "string"
      ? salary.salaryGradeId
      : typeof salary?.gradeId === "string"
        ? salary.gradeId
        : "";
  const currentStepId =
    typeof salary?.id === "string"
      ? salary.id
      : typeof emp?.salaryGradeStepId === "string"
        ? emp.salaryGradeStepId
        : "";
  const currentCoefficient = parseSalaryCoefficient(salary?.coefficient);
  const eligibleSalarySteps = salarySteps.filter((step) => {
    if (step.id === currentStepId) {
      return true;
    }

    if (step.status === "inactive") {
      return false;
    }

    const stepCoefficient = parseSalaryCoefficient(step.coefficient);

    if (currentCoefficient == null || stepCoefficient == null) {
      return true;
    }

    return stepCoefficient >= currentCoefficient;
  });

  const resetAllowanceForm = () => {
    allowanceForm.reset(EMPTY_ALLOWANCE_FORM_VALUES);
  };

  const closeSalaryDialog = () => {
    setShowSalaryDialog(false);
    setSelectedGradeId(currentGradeId);
    setSelectedStepId(currentStepId);
  };

  const openSalaryDialog = () => {
    setSelectedGradeId(currentGradeId);
    setSelectedStepId(currentStepId);
    setShowSalaryDialog(true);
  };

  const closeAllowanceDialog = () => {
    setShowAddAllowanceDialog(false);
    setEditingAllowance(null);
    resetAllowanceForm();
  };

  const openAddAllowanceDialog = () => {
    setEditingAllowance(null);
    setShowAddAllowanceDialog(true);
    resetAllowanceForm();
  };

  const openEditAllowanceDialog = (allowance: EmployeeAllowanceRow) => {
    setShowAddAllowanceDialog(false);
    setEditingAllowance(allowance);
    allowanceForm.reset({
      allowanceTypeId: allowance.allowanceTypeId ?? "",
      status: allowance.status ?? "active",
      note: allowance.note ?? "",
    });
  };

  const selectedAllowanceTypeId = allowanceForm.watch("allowanceTypeId");
  const selectedAllowanceType = allowanceTypes.find((type) => type.id === selectedAllowanceTypeId);
  const selectedAllowanceAmount = selectedAllowanceType?.defaultAmount;

  const handleSalarySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedStepId) return;

    const selectedStep = salarySteps.find((step) => step.id === selectedStepId);
    const selectedCoefficient = parseSalaryCoefficient(selectedStep?.coefficient ?? null);

    if (
      currentCoefficient != null &&
      selectedCoefficient != null &&
      selectedCoefficient < currentCoefficient
    ) {
      toast.error("Không thể hạ hệ số lương xuống thấp hơn mức hiện tại");
      return;
    }

    try {
      await updateEmployeeMutation.mutateAsync({
        id: employeeId,
        salaryGradeStepId: selectedStepId,
      });
      toast.success("Cập nhật hệ số lương thành công");
      closeSalaryDialog();
    } catch (error) {
      if (!(error instanceof ApiResponseError)) {
        toast.error("Có lỗi xảy ra");
      }
    }
  };

  const handleAllowanceSubmit = allowanceForm.handleSubmit(async (values) => {
    try {
      if (editingAllowance) {
        await updateAllowanceMutation.mutateAsync({
          employeeId,
          id: editingAllowance.id,
          ...values,
        });
        toast.success("Cập nhật phụ cấp thành công");
      } else {
        await createAllowanceMutation.mutateAsync({ employeeId, ...values });
        toast.success("Thêm phụ cấp thành công");
      }

      closeAllowanceDialog();
    } catch (error) {
      applyFieldErrors(allowanceForm.setError, error);

      if (!(error instanceof ApiResponseError)) {
        toast.error("Có lỗi xảy ra");
      }
    }
  });

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  return (
    <>
      <div className="rounded-xl border bg-card p-6 space-y-2">
        <SectionTitle
          title="Thông tin hệ số lương"
          action={
            <RoleGuard roles={[...EMPLOYEE_PROFILE_MANAGE_ROLES]}>
              <Button size="sm" variant="default" onClick={openSalaryDialog}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Sửa hệ số lương
              </Button>
            </RoleGuard>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReadOnlyField label="Ngạch viên chức" value={salary?.gradeName} />
          <ReadOnlyField label="Bậc lương" value={salary?.stepName} />
          <ReadOnlyField label="Hệ số lương" value={salary?.coefficient?.toString()} />
        </div>

        <SectionTitle
          title="Thông tin phụ cấp"
          action={
            <RoleGuard roles={[...EMPLOYEE_PROFILE_MANAGE_ROLES]}>
              <Button size="sm" variant="default" onClick={openAddAllowanceDialog}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Thêm phụ cấp
              </Button>
            </RoleGuard>
          }
        />

        {allowances && allowances.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-slate-700">
                  <th className="rounded-l-lg px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Tên loại phụ cấp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Mức phụ cấp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="rounded-r-lg px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {allowances.map((a, i) => (
                  <tr key={a.id ?? i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{a.allowanceName ?? "—"}</td>
                    <td className="px-4 py-3">{a.amount == null ? "—" : a.amount}</td>
                    <td className="px-4 py-3">
                      <AllowanceStatusBadge status={a.status ?? undefined} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RoleGuard roles={[...EMPLOYEE_PROFILE_MANAGE_ROLES]}>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          onClick={() => openEditAllowanceDialog(a)}
                          aria-label="Sửa phụ cấp"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </RoleGuard>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
            <p className="text-sm">Chưa có thông tin phụ cấp.</p>
          </div>
        )}
      </div>

      <Dialog
        open={canManage && showSalaryDialog}
        onOpenChange={(open) => {
          if (!open) {
            closeSalaryDialog();
          }
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Sửa hệ số lương
              </DialogTitle>
              {emp?.staffCode && (
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Mã nhân sự: {emp.staffCode}
                </span>
              )}
            </div>
            <DialogDescription className="sr-only">
              Chọn ngạch lương và bậc lương cho nhân sự.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSalarySubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salary-grade">
                Ngạch viên chức <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedGradeId}
                onValueChange={(value) => {
                  setSelectedGradeId(value);
                  setSelectedStepId("");
                }}
              >
                <SelectTrigger id="salary-grade" className="w-full">
                  <SelectValue placeholder="Chọn ngạch viên chức" />
                </SelectTrigger>
                <SelectContent>
                  {salaryGrades.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salary-step">
                Bậc lương <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedStepId}
                onValueChange={setSelectedStepId}
                disabled={!selectedGradeId}
              >
                <SelectTrigger id="salary-step" className="w-full">
                  <SelectValue placeholder="Chọn bậc lương" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleSalarySteps.map((step) => (
                    <SelectItem key={step.id} value={step.id}>
                      {`Bậc ${step.stepNo}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentCoefficient != null && (
                <p className="text-xs text-muted-foreground">
                  Chỉ cho phép chọn bậc có hệ số không thấp hơn mức hiện tại ({salary?.coefficient}
                  ).
                </p>
              )}
              {selectedGradeId && eligibleSalarySteps.length === 0 && (
                <p className="text-xs text-destructive">
                  Ngạch được chọn không có bậc lương nào đạt từ mức hiện tại trở lên.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salary-coefficient">
                Hệ số lương <span className="text-red-500">*</span>
              </label>
              <Input
                id="salary-coefficient"
                readOnly
                value={
                  selectedStepId
                    ? (salarySteps.find((s) => s.id === selectedStepId)?.coefficient ?? "")
                    : ""
                }
                placeholder="Hệ số lương"
                className="bg-muted/50"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeSalaryDialog}>
                Hủy
              </Button>
              <Button type="submit" disabled={!selectedStepId || updateEmployeeMutation.isPending}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {updateEmployeeMutation.isPending ? "Đang lưu..." : "Lưu hệ số lương"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={canManage && isAllowanceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeAllowanceDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAllowance ? "Sửa phụ cấp" : "Thêm phụ cấp"}</DialogTitle>
            <DialogDescription>
              {editingAllowance
                ? "Cập nhật thông tin phụ cấp cho nhân sự."
                : "Thêm phụ cấp mới cho nhân sự."}
            </DialogDescription>
          </DialogHeader>

          <Form {...allowanceForm}>
            <form className="space-y-4" onSubmit={handleAllowanceSubmit}>
              <FormField
                control={allowanceForm.control}
                name="allowanceTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại phụ cấp <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại phụ cấp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allowanceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.allowanceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={allowanceForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trạng thái <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value ?? "active"} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(AllowanceAssignmentStatus).map(([code, meta]) => (
                          <SelectItem key={code} value={code}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Mức phụ cấp áp dụng</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    value={selectedAllowanceAmount == null ? "" : String(selectedAllowanceAmount)}
                    placeholder="Chọn loại phụ cấp để xem mức tiền"
                    className="bg-muted/50"
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={allowanceForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập ghi chú"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeAllowanceDialog}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isAllowanceSubmitting}>
                  {isAllowanceSubmitting
                    ? "Đang lưu..."
                    : editingAllowance
                      ? "Lưu thay đổi"
                      : "Thêm phụ cấp"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
