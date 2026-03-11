import { FormActions } from "@/components/ui/FormActions";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateEmployeePreviousJobInput, createEmployeePreviousJobSchema } from "@hrms/shared";
import * as React from "react";
import { useForm } from "react-hook-form";

interface PreviousJobFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateEmployeePreviousJobInput) => void;
  defaultValues?: Partial<CreateEmployeePreviousJobInput>;
  loading?: boolean;
}

const formId = "previous-job-form";

export function PreviousJobForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  loading,
}: PreviousJobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeePreviousJobInput>({
    resolver: zodResolver(createEmployeePreviousJobSchema),
    defaultValues: {
      workplace: "",
      startedOn: "",
      endedOn: "",
      note: "",
      ...defaultValues,
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Quá trình công tác"
      footer={<FormActions formId={formId} onCancel={onClose} loading={loading} />}
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Nơi làm việc" required error={errors.workplace?.message}>
          <input
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            placeholder="Nhập nơi làm việc"
            {...register("workplace")}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Bắt đầu" required error={errors.startedOn?.message}>
            <input
              type="date"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("startedOn")}
            />
          </FormField>
          <FormField label="Kết thúc" required error={errors.endedOn?.message}>
            <input
              type="date"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("endedOn")}
            />
          </FormField>
        </div>
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
