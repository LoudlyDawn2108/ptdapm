import { FormActions } from "@/components/ui/FormActions";
import { FormField } from "@/components/ui/FormField";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ACADEMIC_RANK_CODES,
  ACADEMIC_TITLE_CODES,
  AcademicRank,
  AcademicTitle,
  CONTRACT_STATUS_CODES,
  ContractStatus,
  type CreateEmployeeInput,
  EDUCATION_LEVEL_CODES,
  EducationLevel,
  GENDER_CODES,
  Gender,
  TRAINING_LEVEL_CODES,
  TrainingLevel,
  WORK_STATUS_CODES,
  WorkStatus,
  createEmployeeSchema,
  enumToSortedList,
} from "@hrms/shared";
import * as React from "react";
import { useForm } from "react-hook-form";

const normalizeOptionalValue = (value?: string | null) => {
  if (typeof value !== "string") return undefined;

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const normalizeRequiredValue = (value?: string | null) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

export interface EmployeeFormProps {
  defaultValues?: {
    [K in keyof CreateEmployeeInput]?: CreateEmployeeInput[K] | null;
  };
  onSubmit: (values: CreateEmployeeInput) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  submitLabel?: string;
}

const genderOptions = enumToSortedList(Gender);
const workStatusOptions = enumToSortedList(WorkStatus);
const contractStatusOptions = enumToSortedList(ContractStatus);
const educationLevelOptions = enumToSortedList(EducationLevel);
const trainingLevelOptions = enumToSortedList(TrainingLevel);
const academicTitleOptions = enumToSortedList(AcademicTitle);
const academicRankOptions = enumToSortedList(AcademicRank);

const formId = "employee-form";
const defaultGender = GENDER_CODES[0]!;
const defaultWorkStatus = WORK_STATUS_CODES[0]!;
const defaultContractStatus = CONTRACT_STATUS_CODES[0]!;

export function EmployeeForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  className,
  submitLabel,
}: EmployeeFormProps) {
  const normalizedDefaultValues = React.useMemo<CreateEmployeeInput>(
    () => ({
      staffCode: normalizeRequiredValue(defaultValues?.staffCode),
      fullName: normalizeRequiredValue(defaultValues?.fullName),
      dob: normalizeRequiredValue(defaultValues?.dob),
      gender: defaultValues?.gender ?? defaultGender,
      nationalId: normalizeRequiredValue(defaultValues?.nationalId),
      hometown: normalizeOptionalValue(defaultValues?.hometown),
      address: normalizeRequiredValue(defaultValues?.address),
      taxCode: normalizeOptionalValue(defaultValues?.taxCode),
      socialInsuranceNo: normalizeOptionalValue(defaultValues?.socialInsuranceNo),
      healthInsuranceNo: normalizeOptionalValue(defaultValues?.healthInsuranceNo),
      email: normalizeRequiredValue(defaultValues?.email),
      phone: normalizeRequiredValue(defaultValues?.phone),
      isForeigner: defaultValues?.isForeigner ?? false,
      educationLevel: defaultValues?.educationLevel ?? undefined,
      trainingLevel: defaultValues?.trainingLevel ?? undefined,
      academicTitle: defaultValues?.academicTitle ?? undefined,
      academicRank: defaultValues?.academicRank ?? undefined,
      workStatus: defaultValues?.workStatus ?? defaultWorkStatus,
      contractStatus: defaultValues?.contractStatus ?? defaultContractStatus,
      currentOrgUnitId: normalizeOptionalValue(defaultValues?.currentOrgUnitId),
      currentPositionTitle: normalizeOptionalValue(defaultValues?.currentPositionTitle),
    }),
    [defaultValues],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    mode: "onTouched",
    defaultValues: normalizedDefaultValues,
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("space-y-6", className)}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Mã cán bộ" required error={errors.staffCode?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập mã cán bộ"
            {...register("staffCode")}
          />
        </FormField>
        <FormField label="Họ và tên" required error={errors.fullName?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập họ và tên"
            {...register("fullName")}
          />
        </FormField>
        <FormField label="Ngày sinh" required error={errors.dob?.message}>
          <input
            type="date"
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            {...register("dob")}
          />
        </FormField>
        <FormField label="Giới tính" required error={errors.gender?.message}>
          <select
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            {...register("gender")}
          >
            {genderOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Số CCCD/CMND" required error={errors.nationalId?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập số CCCD/CMND"
            {...register("nationalId")}
          />
        </FormField>
        <FormField label="Quê quán" error={errors.hometown?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập quê quán"
            {...register("hometown")}
          />
        </FormField>
        <FormField label="Địa chỉ" required error={errors.address?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập địa chỉ"
            {...register("address")}
          />
        </FormField>
        <FormField label="Mã số thuế" error={errors.taxCode?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập mã số thuế"
            {...register("taxCode")}
          />
        </FormField>
        <FormField label="Số BHXH" error={errors.socialInsuranceNo?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập số BHXH"
            {...register("socialInsuranceNo")}
          />
        </FormField>
        <FormField label="Số BHYT" error={errors.healthInsuranceNo?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập số BHYT"
            {...register("healthInsuranceNo")}
          />
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          <input
            type="email"
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="name@tlu.edu.vn"
            {...register("email")}
          />
        </FormField>
        <FormField label="Số điện thoại" required error={errors.phone?.message}>
          <input
            type="tel"
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập số điện thoại"
            {...register("phone")}
          />
        </FormField>
      </div>

      <div className="rounded-2xl border border-border bg-muted/20 p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Thông tin học vấn</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Trình độ văn hóa" error={errors.educationLevel?.message}>
            <select
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("educationLevel")}
            >
              <option value="">Chọn trình độ văn hóa</option>
              {educationLevelOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Trình độ đào tạo" error={errors.trainingLevel?.message}>
            <select
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("trainingLevel")}
            >
              <option value="">Chọn trình độ đào tạo</option>
              {trainingLevelOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Chức danh nghề nghiệp" error={errors.academicTitle?.message}>
            <select
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("academicTitle")}
            >
              <option value="">Chọn chức danh nghề nghiệp</option>
              {academicTitleOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Học hàm" error={errors.academicRank?.message}>
            <select
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("academicRank")}
            >
              <option value="">Chọn học hàm</option>
              {academicRankOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Trạng thái làm việc" required error={errors.workStatus?.message}>
          <select
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            {...register("workStatus")}
          >
            {workStatusOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Trạng thái hợp đồng" required error={errors.contractStatus?.message}>
          <select
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            {...register("contractStatus")}
          >
            {contractStatusOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Đơn vị công tác" error={errors.currentOrgUnitId?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập mã đơn vị"
            {...register("currentOrgUnitId")}
          />
        </FormField>
        <FormField label="Chức vụ hiện tại" error={errors.currentPositionTitle?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập chức vụ"
            {...register("currentPositionTitle")}
          />
        </FormField>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary" {...register("isForeigner")} />
          <span>Người nước ngoài</span>
        </div>
      </div>

      <FormActions
        formId={formId}
        submitLabel={submitLabel}
        onCancel={onCancel}
        loading={loading}
      />
    </form>
  );
}
