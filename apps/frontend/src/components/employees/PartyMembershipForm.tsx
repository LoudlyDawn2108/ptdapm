import { FormActions } from "@/components/ui/FormActions";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateEmployeePartyMembershipInput,
  PartyOrgType,
  createEmployeePartyMembershipSchema,
  enumToSortedList,
} from "@hrms/shared";
import * as React from "react";
import { useForm } from "react-hook-form";

interface PartyMembershipFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateEmployeePartyMembershipInput) => void;
  defaultValues?: Partial<CreateEmployeePartyMembershipInput>;
  loading?: boolean;
}

const orgTypeOptions = enumToSortedList(PartyOrgType);
const formId = "party-membership-form";

export function PartyMembershipForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  loading,
}: PartyMembershipFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeePartyMembershipInput>({
    resolver: zodResolver(createEmployeePartyMembershipSchema),
    defaultValues: {
      organizationType: orgTypeOptions[0]?.code,
      joinedOn: "",
      details: "",
      ...defaultValues,
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thông tin Đảng/Đoàn"
      footer={<FormActions formId={formId} onCancel={onClose} loading={loading} />}
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Loại tổ chức" required error={errors.organizationType?.message}>
          <select
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            {...register("organizationType")}
          >
            {orgTypeOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Ngày gia nhập" error={errors.joinedOn?.message}>
          <input
            type="date"
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
            {...register("joinedOn")}
          />
        </FormField>
        <FormField label="Ghi chú" error={errors.details?.message}>
          <textarea
            className="min-h-[100px] rounded-xl border border-border bg-background px-4 py-3 text-sm"
            placeholder="Thông tin chi tiết"
            {...register("details")}
          />
        </FormField>
      </form>
    </Modal>
  );
}
