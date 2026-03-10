import { FormActions } from "@/components/ui/FormActions";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateEmployeeBankAccountFormInput,
  type CreateEmployeeBankAccountInput,
  createEmployeeBankAccountSchema,
} from "@hrms/shared";
import * as React from "react";
import { useForm } from "react-hook-form";

interface BankAccountFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateEmployeeBankAccountInput) => void;
  defaultValues?: Partial<CreateEmployeeBankAccountInput>;
  loading?: boolean;
}

const formId = "bank-account-form";

export function BankAccountForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  loading,
}: BankAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeBankAccountFormInput, unknown, CreateEmployeeBankAccountInput>({
    resolver: zodResolver(createEmployeeBankAccountSchema),
    defaultValues: {
      bankName: "",
      accountNo: "",
      isPrimary: true,
      ...defaultValues,
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tài khoản ngân hàng"
      footer={<FormActions formId={formId} onCancel={onClose} loading={loading} />}
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Tên ngân hàng" required error={errors.bankName?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập tên ngân hàng"
            {...register("bankName")}
          />
        </FormField>
        <FormField label="Số tài khoản" required error={errors.accountNo?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập số tài khoản"
            {...register("accountNo")}
          />
        </FormField>
        <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary" {...register("isPrimary")} />
          Tài khoản chính
        </label>
      </form>
    </Modal>
  );
}
