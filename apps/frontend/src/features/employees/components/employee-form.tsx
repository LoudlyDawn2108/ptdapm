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
import type { CreateEmployeeInput } from "@hrms/shared";
import {
  AcademicRank,
  AcademicTitle,
  ContractStatus,
  type CreateEmployeeFormInput,
  EducationLevel,
  Gender,
  TrainingLevel,
  WorkStatus,
  createEmployeeSchema,
  enumToSortedList,
} from "@hrms/shared";
import { Loader2, Save } from "lucide-react";
import { Controller, type Path, useForm } from "react-hook-form";
import { employeeStrings as t } from "../strings";

type FormValues = CreateEmployeeFormInput;

interface EmployeeFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmitAction: (values: CreateEmployeeInput) => Promise<void>;
  isPending: boolean;
  submitLabel?: string;
  pendingLabel?: string;
}

export function EmployeeForm({
  defaultValues,
  onSubmitAction,
  isPending,
  submitLabel = t.form.saveLabel,
  pendingLabel = t.form.savingLabel,
}: EmployeeFormProps) {
  const form = useForm<FormValues>({
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
      trainingLevel: "",
      academicTitle: "",
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
      await onSubmitAction(values as unknown as CreateEmployeeInput);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  });

  const renderSelect = (
    name: Path<FormValues>,
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
    name: Path<FormValues>,
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
            <CardTitle className="text-base">{t.form.personalInfoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderInput("fullName", t.form.fields.fullName)}
            {renderInput("dob", t.form.fields.dob, "date")}
            {renderSelect("gender", t.form.fields.gender, enumToSortedList(Gender))}
            {renderInput("nationalId", t.form.fields.nationalId)}
            {renderInput("hometown", t.form.fields.hometown)}
            {renderInput("address", t.form.fields.address)}
            {renderInput("email", t.form.fields.email, "email")}
            {renderInput("phone", t.form.fields.phone, "tel")}
            <div className="flex items-center gap-2">
              <Checkbox
                id="isForeigner"
                checked={form.watch("isForeigner")}
                onCheckedChange={(v) => form.setValue("isForeigner", !!v)}
              />
              <Label htmlFor="isForeigner">{t.form.fields.isForeigner}</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.form.careerInfoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderInput("staffCode", t.form.fields.staffCode)}
            {renderInput("currentPositionTitle", t.form.fields.positionTitle)}

            <div className="space-y-2">
              <Label>{t.form.fields.orgUnit}</Label>
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
                    placeholder={t.form.fields.orgUnitPlaceholder}
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
              <Label>{t.form.fields.salaryGrade}</Label>
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
                    placeholder={t.form.fields.salaryGradePlaceholder}
                  />
                )}
              />
              {form.formState.errors.salaryGradeStepId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.salaryGradeStepId?.message as string}
                </p>
              )}
            </div>
            {renderSelect("workStatus", t.form.fields.workStatus, enumToSortedList(WorkStatus))}
            {renderSelect(
              "contractStatus",
              t.form.fields.contractStatus,
              enumToSortedList(ContractStatus),
            )}
            {renderSelect(
              "educationLevel",
              t.form.fields.educationLevel,
              enumToSortedList(EducationLevel),
            )}
            {renderSelect(
              "trainingLevel",
              t.form.fields.trainingLevel,
              enumToSortedList(TrainingLevel),
            )}
            {renderSelect(
              "academicTitle",
              t.form.fields.academicTitle,
              enumToSortedList(AcademicTitle),
            )}
            {renderSelect(
              "academicRank",
              t.form.fields.academicRank,
              enumToSortedList(AcademicRank),
            )}
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
