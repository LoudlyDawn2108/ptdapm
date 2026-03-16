import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchOrgUnitDropdown, fetchSalaryGradeDropdown } from "@/lib/api/config-dropdowns";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateEmployeeFormInput, CreateEmployeeInput } from "@hrms/shared";
import {
  AcademicRank,
  ContractStatus,
  EducationLevel,
  Gender,
  WorkStatus,
  createEmployeeSchema,
  enumToSortedList,
} from "@hrms/shared";
import { Loader2, Save } from "lucide-react";
import { Controller, type Path, useForm } from "react-hook-form";

type FormInput = CreateEmployeeFormInput;
type FormOutput = CreateEmployeeInput;

interface EmployeeFormProps {
  defaultValues?: Partial<FormInput>;
  onSubmitAction: (values: FormOutput) => Promise<void>;
  isPending: boolean;
  submitLabel?: string;
  pendingLabel?: string;
}

export function EmployeeForm({
  defaultValues,
  onSubmitAction,
  isPending,
  submitLabel = "Lưu nhân sự",
  pendingLabel = "Đang lưu...",
}: EmployeeFormProps) {
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "",
      nationalId: "",
      hometown: "",
      address: "",
      email: "",
      phone: "",
      isForeigner: false,
      educationLevel: "",
      academicRank: "",
      workStatus: "pending",
      contractStatus: "none",
      currentPositionTitle: "",
      currentOrgUnitId: "",
      salaryGradeStepId: "",
      ...defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmitAction(values);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  });

  const renderSelect = (
    name: Path<FormInput>,
    label: string,
    items: { code: string; label: string }[],
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={(form.watch(name) as string) ?? ""}
        onValueChange={(v) => form.setValue(name, v)}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {form.formState.errors[name] && (
        <p className="text-sm text-destructive">{form.formState.errors[name]?.message as string}</p>
      )}
    </div>
  );

  const renderInput = (
    name: Path<FormInput>,
    label: string,
    type = "text",
    placeholder?: string,
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder ?? `Nhập ${label.toLowerCase()}...`}
        {...form.register(name)}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-destructive">{form.formState.errors[name]?.message as string}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderInput("fullName", "Họ tên")}
            {renderInput("dob", "Ngày sinh", "date")}
            {renderSelect("gender", "Giới tính", enumToSortedList(Gender))}
            {renderInput("nationalId", "Số CCCD/CMND")}
            {renderInput("hometown", "Quê quán")}
            {renderInput("address", "Địa chỉ")}
            {renderInput("email", "Email", "email")}
            {renderInput("phone", "Số điện thoại", "tel")}
            <div className="flex items-center gap-2">
              <Checkbox
                id="isForeigner"
                checked={form.watch("isForeigner")}
                onCheckedChange={(v) => form.setValue("isForeigner", !!v)}
              />
              <Label htmlFor="isForeigner">Là người nước ngoài</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin nghề nghiệp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderInput("staffCode", "Mã nhân viên")}
            {renderInput("currentPositionTitle", "Chức danh hiện tại")}

            <div className="space-y-2">
              <Label>Đơn vị công tác</Label>
              <Controller
                name="currentOrgUnitId"
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    queryKey={["org-units", "dropdown"]}
                    fetchOptions={fetchOrgUnitDropdown}
                    value={field.value as string}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Chọn đơn vị công tác..."
                  />
                )}
              />
              {form.formState.errors.currentOrgUnitId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.currentOrgUnitId?.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Bậc lương</Label>
              <Controller
                name="salaryGradeStepId"
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    queryKey={["salary-grades", "dropdown"]}
                    fetchOptions={fetchSalaryGradeDropdown}
                    value={field.value as string}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Chọn bậc lương..."
                  />
                )}
              />
              {form.formState.errors.salaryGradeStepId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.salaryGradeStepId?.message as string}
                </p>
              )}
            </div>
            {renderSelect("workStatus", "Trạng thái làm việc", enumToSortedList(WorkStatus))}
            {renderSelect(
              "contractStatus",
              "Trạng thái hợp đồng",
              enumToSortedList(ContractStatus),
            )}
            {renderSelect("educationLevel", "Trình độ văn hóa", enumToSortedList(EducationLevel))}
            {renderSelect("academicRank", "Học hàm", enumToSortedList(AcademicRank))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {pendingLabel}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
