import { FormActions } from "@/components/ui/FormActions";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateEmployeeAllowanceFormInput,
  type CreateEmployeeAllowanceInput,
  createEmployeeAllowanceSchema,
} from "@hrms/shared";
import * as React from "react";
import { useForm } from "react-hook-form";

interface AllowanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateEmployeeAllowanceInput) => void;
  defaultValues?: Partial<CreateEmployeeAllowanceInput>;
  loading?: boolean;
}

const formId = "allowance-form";

export function AllowanceForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  loading,
}: AllowanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeAllowanceFormInput, unknown, CreateEmployeeAllowanceInput>({
    resolver: zodResolver(createEmployeeAllowanceSchema),
    defaultValues: {
      allowanceTypeId: "",
      amount: undefined,
      note: "",
      ...defaultValues,
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Phụ cấp"
      footer={<FormActions formId={formId} onCancel={onClose} loading={loading} />}
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Loại phụ cấp" required error={errors.allowanceTypeId?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập mã loại phụ cấp"
            {...register("allowanceTypeId")}
          />
        </FormField>
        <FormField label="Số tiền" error={errors.amount?.message}>
          <input
            type="number"
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập số tiền"
            {...register("amount", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Ghi chú" error={errors.note?.message}>
          <textarea
            className="min-h-[100px] rounded-xl border border-border bg-background px-4 py-3 text-sm"
            placeholder="Ghi chú thêm"
            {...register("note")}
          />
        </FormField>
      </form>
    </Modal>
  );
}
