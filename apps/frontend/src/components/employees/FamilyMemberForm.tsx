import { FormActions } from "@/components/ui/FormActions";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateEmployeeFamilyMemberInput,
  FamilyRelation,
  createEmployeeFamilyMemberSchema,
  enumToSortedList,
} from "@hrms/shared";
import * as React from "react";
import { useForm } from "react-hook-form";

interface FamilyMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateEmployeeFamilyMemberInput) => void;
  defaultValues?: Partial<CreateEmployeeFamilyMemberInput>;
  loading?: boolean;
}

const relationOptions = enumToSortedList(FamilyRelation);
const formId = "family-member-form";

export function FamilyMemberForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  loading,
}: FamilyMemberFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeFamilyMemberInput>({
    resolver: zodResolver(createEmployeeFamilyMemberSchema),
    defaultValues: {
      relation: relationOptions[0]?.code,
      fullName: "",
      dob: "",
      phone: "",
      note: "",
      isDependent: false,
      ...defaultValues,
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thành viên gia đình"
      footer={<FormActions formId={formId} onCancel={onClose} loading={loading} />}
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Quan hệ" required error={errors.relation?.message}>
            <select
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("relation")}
            >
              {relationOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Họ và tên" required error={errors.fullName?.message}>
            <input
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              placeholder="Nhập họ và tên"
              {...register("fullName")}
            />
          </FormField>
          <FormField label="Ngày sinh" error={errors.dob?.message}>
            <input
              type="date"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              {...register("dob")}
            />
          </FormField>
          <FormField label="Số điện thoại" error={errors.phone?.message}>
            <input
              type="tel"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              placeholder="Nhập số điện thoại"
              {...register("phone")}
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
        <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary" {...register("isDependent")} />
          Người phụ thuộc
        </label>
      </form>
    </Modal>
  );
}
