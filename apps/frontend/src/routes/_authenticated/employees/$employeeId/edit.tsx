import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  employeeDetailOptions,
  getFileUrl,
  uploadFile,
  useCreateBankAccount,
  useCreateCertification,
  useCreateDegree,
  useCreateFamilyMember,
  useCreateForeignWorkPermit,
  useCreatePartyMembership,
  useCreatePreviousJob,
  useDeleteBankAccount,
  useDeleteCertification,
  useDeleteDegree,
  useDeleteFamilyMember,
  useDeletePartyMembership,
  useDeletePreviousJob,
  useUpdateBankAccount,
  useUpdateCertification,
  useUpdateDegree,
  useUpdateEmployee,
  useUpdateFamilyMember,
  useUpdateForeignWorkPermit,
  useUpdatePartyMembership,
  useUpdatePreviousJob,
} from "@/features/employees/api";
import {
  DynamicSection,
  FieldInput,
  FormFieldSelect,
  RemoveBtn,
  SectionHeader,
} from "@/features/employees/components/form-helpers";
import type { EmployeeAggregate } from "@/features/employees/types";
import { isEmployeeAggregate } from "@/features/employees/types";
import { formatForInput } from "@/lib/date-utils";
import { ApiResponseError, applyFieldErrors } from "@/lib/error-handler";
import { authorizeRoute } from "@/lib/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicRank,
  EducationLevel,
  FamilyRelation,
  type FamilyRelationCode,
  Gender,
  PartyOrgType,
  type PartyOrgTypeCode,
  type UpdateEmployeeInput,
  enumToSortedList,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Pencil, Plus, Save, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type Control,
  type SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* ── Local form schema (employee + sub-entities) ── */

const editFormSchema = z
  .object({
    // --- Flat employee fields ---
    fullName: z.string().min(1, "Họ tên không được để trống"),
    gender: z.string().min(1, "Giới tính không được để trống"),
    dob: z.string().min(1, "Ngày sinh không được để trống"),
    hometown: z.string().min(1, "Quê quán không được để trống"),
    email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
    phone: z.string().min(1, "Số điện thoại không được để trống"),
    address: z.string().min(1, "Địa chỉ không được để trống"),
    nationalId: z.string().min(1, "Số CCCD/CMND không được để trống"),
    taxCode: z.string().min(1, "Mã số thuế không được để trống"),
    socialInsuranceNo: z.string().optional(),
    healthInsuranceNo: z.string().optional(),
    isForeigner: z.boolean().default(false),
    visaNumber: z.string().optional(),
    visaExpiry: z.string().optional(),
    passportNumber: z.string().optional(),
    passportExpiry: z.string().optional(),
    workPermitNumber: z.string().optional(),
    workPermitExpiry: z.string().optional(),
    workPermitFileId: z.string().optional(),
    educationLevel: z.string().min(1, "Trình độ văn hóa không được để trống"),
    academicRank: z.string().min(1, "Học hàm/Học vị không được để trống"),
    portraitFileId: z.string().min(1, "Ảnh chân dung không được để trống"),
    // --- Sub-entity arrays ---
    familyMembers: z
      .array(
        z.object({
          id: z.string().optional(),
          relation: z.string().min(1, "Mối quan hệ không được để trống"),
          fullName: z.string().min(1, "Họ tên không được để trống"),
        }),
      )
      .default([]),
    bankAccounts: z
      .array(
        z.object({
          id: z.string().optional(),
          bankName: z.string().min(1, "Tên ngân hàng không được để trống"),
          accountNo: z.string().min(1, "Số tài khoản không được để trống"),
        }),
      )
      .default([]),
    previousJobs: z
      .array(
        z.object({
          id: z.string().optional(),
          workplace: z.string().min(1, "Nơi làm việc không được để trống"),
          startedOn: z.string().min(1, "Ngày bắt đầu không được để trống"),
          endedOn: z.string().min(1, "Ngày kết thúc không được để trống"),
        }),
      )
      .default([]),
    partyMemberships: z
      .array(
        z.object({
          id: z.string().optional(),
          organizationType: z.string().min(1, "Loại tổ chức không được để trống"),
          joinedOn: z.string().min(1, "Ngày gia nhập không được để trống"),
          details: z.string().min(1, "Thông tin chi tiết không được để trống"),
        }),
      )
      .default([]),
    degrees: z
      .array(
        z.object({
          id: z.string().optional(),
          degreeName: z.string().min(1, "Tên bằng không được để trống"),
          school: z.string().min(1, "Trường/Nơi cấp không được để trống"),
          degreeFileId: z.string().optional(),
        }),
      )
      .default([]),
    certificates: z
      .array(
        z.object({
          id: z.string().optional(),
          certName: z.string().min(1, "Tên chứng chỉ không được để trống"),
          issuedBy: z.string().min(1, "Nơi cấp không được để trống"),
          certFileId: z.string().optional(),
        }),
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.isForeigner) {
      const foreignerFields = [
        { field: "visaNumber", label: "Số visa" },
        { field: "visaExpiry", label: "Ngày hết hạn visa" },
        { field: "passportNumber", label: "Số hộ chiếu" },
        { field: "passportExpiry", label: "Ngày hết hạn hộ chiếu" },
        { field: "workPermitNumber", label: "Số giấy phép lao động" },
        { field: "workPermitExpiry", label: "Ngày hết hạn giấy phép" },
      ] as const;
      for (const { field, label } of foreignerFields) {
        if (!data[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${label} là bắt buộc khi là người nước ngoài`,
            path: [field],
          });
        }
      }
    }
  });

type SubmitValues = z.output<typeof editFormSchema>;
type FormValues = Omit<
  SubmitValues,
  | "academicRank"
  | "isForeigner"
  | "familyMembers"
  | "bankAccounts"
  | "previousJobs"
  | "partyMemberships"
  | "degrees"
  | "certificates"
> & {
  academicRank: string;
  isForeigner?: boolean;
  familyMembers?: SubmitValues["familyMembers"];
  bankAccounts?: SubmitValues["bankAccounts"];
  previousJobs?: SubmitValues["previousJobs"];
  partyMemberships?: SubmitValues["partyMemberships"];
  degrees?: SubmitValues["degrees"];
  certificates?: SubmitValues["certificates"];
};

function syncSubEntities<T extends { id?: string }>(opts: {
  items: T[];
  initialIds: Set<string>;
  label: string;
  create: (body: Omit<T, "id">) => Promise<unknown>;
  update: (id: string, body: Omit<T, "id">) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
  promises: Promise<void>[];
  errors: string[];
}): void {
  const { items, initialIds, label, create, update, remove, promises, errors } = opts;
  const currentIds = new Set(items.filter((x) => x.id).map((x) => x.id!));

  const collectError = (err: unknown) => {
    errors.push(`${label}: ${err instanceof Error ? err.message : "Lỗi không xác định"}`);
  };

  for (const id of initialIds) {
    if (!currentIds.has(id)) {
      promises.push(
        remove(id)
          .then(() => {})
          .catch(collectError),
      );
    }
  }

  for (const item of items) {
    const { id, ...body } = item;
    const payload = body as Omit<T, "id">;
    if (id) {
      promises.push(
        update(id, payload)
          .then(() => {})
          .catch(collectError),
      );
    } else {
      promises.push(
        create(payload)
          .then(() => {})
          .catch(collectError),
      );
    }
  }
}

export const Route = createFileRoute("/_authenticated/employees/$employeeId/edit")({
  beforeLoad: authorizeRoute("/employees/new"),
  component: EditEmployeePage,
});

function EditEmployeePage() {
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));

  if (isLoading) {
    return (
      <div>
        <FormSkeleton fields={8} />
      </div>
    );
  }

  const agg = isEmployeeAggregate(data?.data) ? data.data : undefined;
  const emp = agg?.employee;

  if (!agg || !emp) {
    return <div className="text-slate-600">Không tìm thấy thông tin nhân sự.</div>;
  }

  if (!["pending", "working"].includes(emp.workStatus)) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Không thể chỉnh sửa hồ sơ nhân viên ở trạng thái hiện tại ({emp.workStatus}).
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/employees/$employeeId", params: { employeeId } })}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return <EditEmployeeFormContent key={employeeId} employeeId={employeeId} aggregate={agg} />;
}

function EditEmployeeFormContent({
  employeeId,
  aggregate,
}: {
  employeeId: string;
  aggregate: EmployeeAggregate;
}) {
  const navigate = useNavigate();
  const updateMutation = useUpdateEmployee();
  const createFamilyMemberMutation = useCreateFamilyMember();
  const updateFamilyMemberMutation = useUpdateFamilyMember();
  const deleteFamilyMemberMutation = useDeleteFamilyMember();
  const createBankAccountMutation = useCreateBankAccount();
  const updateBankAccountMutation = useUpdateBankAccount();
  const deleteBankAccountMutation = useDeleteBankAccount();
  const createPreviousJobMutation = useCreatePreviousJob();
  const updatePreviousJobMutation = useUpdatePreviousJob();
  const deletePreviousJobMutation = useDeletePreviousJob();
  const createPartyMembershipMutation = useCreatePartyMembership();
  const updatePartyMembershipMutation = useUpdatePartyMembership();
  const deletePartyMembershipMutation = useDeletePartyMembership();
  const createDegreeMutation = useCreateDegree();
  const updateDegreeMutation = useUpdateDegree();
  const deleteDegreeMutation = useDeleteDegree();
  const createCertificationMutation = useCreateCertification();
  const updateCertificationMutation = useUpdateCertification();
  const deleteCertificationMutation = useDeleteCertification();
  const createForeignWorkPermitMutation = useCreateForeignWorkPermit();
  const updateForeignWorkPermitMutation = useUpdateForeignWorkPermit();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const emp = aggregate.employee;

  const [portraitPreview, setPortraitPreview] = useState<string | null>(
    emp.portraitFileId ? getFileUrl(emp.portraitFileId) : null,
  );
  const [showForeigner, setShowForeigner] = useState(emp.isForeigner ?? false);

  const familyMembersData = aggregate.familyMembers ?? [];
  const bankAccountsData = aggregate.bankAccounts ?? [];
  const previousJobsData = aggregate.previousJobs ?? [];
  const partyMembershipsData = aggregate.partyMemberships ?? [];
  const degreesData = aggregate.degrees ?? [];
  const certificationsData = aggregate.certifications ?? [];
  const foreignWorkPermitsData = aggregate.foreignWorkPermits ?? [];

  // Track initial IDs to detect deletions on submit
  const initialIds = useMemo(
    () => ({
      familyMembers: new Set<string>(familyMembersData.map((x) => x.id)),
      bankAccounts: new Set<string>(bankAccountsData.map((x) => x.id)),
      previousJobs: new Set<string>(previousJobsData.map((x) => x.id)),
      partyMemberships: new Set<string>(partyMembershipsData.map((x) => x.id)),
      degrees: new Set<string>(degreesData.map((x) => x.id)),
      certifications: new Set<string>(certificationsData.map((x) => x.id)),
    }),
    [
      familyMembersData,
      bankAccountsData,
      previousJobsData,
      partyMembershipsData,
      degreesData,
      certificationsData,
    ],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      fullName: emp.fullName ?? "",
      gender: emp.gender ?? "",
      dob: formatForInput(emp.dob),
      hometown: emp.hometown ?? "",
      email: emp.email ?? "",
      phone: emp.phone ?? "",
      address: emp.address ?? "",
      nationalId: emp.nationalId ?? "",
      taxCode: emp.taxCode ?? "",
      socialInsuranceNo: emp.socialInsuranceNo ?? "",
      healthInsuranceNo: emp.healthInsuranceNo ?? "",
      isForeigner: emp.isForeigner ?? false,
      visaNumber: foreignWorkPermitsData[0]?.visaNo ?? "",
      visaExpiry: formatForInput(foreignWorkPermitsData[0]?.visaExpiresOn),
      passportNumber: foreignWorkPermitsData[0]?.passportNo ?? "",
      passportExpiry: formatForInput(foreignWorkPermitsData[0]?.passportExpiresOn),
      workPermitNumber: foreignWorkPermitsData[0]?.workPermitNo ?? "",
      workPermitExpiry: formatForInput(foreignWorkPermitsData[0]?.workPermitExpiresOn),
      workPermitFileId: foreignWorkPermitsData[0]?.workPermitFileId ?? "",
      educationLevel: emp.educationLevel ?? "",
      academicRank: emp.academicRank ?? "",
      portraitFileId: emp.portraitFileId ?? "",
      familyMembers: familyMembersData.map((fm) => ({
        id: fm.id,
        relation: fm.relation ?? "",
        fullName: fm.fullName ?? "",
      })),
      bankAccounts: bankAccountsData.map((ba) => ({
        id: ba.id,
        bankName: ba.bankName ?? "",
        accountNo: ba.accountNo ?? "",
      })),
      previousJobs: previousJobsData.map((pj) => ({
        id: pj.id,
        workplace: pj.workplace ?? "",
        startedOn: formatForInput(pj.startedOn),
        endedOn: formatForInput(pj.endedOn),
      })),
      partyMemberships: partyMembershipsData.map((pm) => ({
        id: pm.id,
        organizationType: pm.organizationType ?? "",
        joinedOn: formatForInput(pm.joinedOn),
        details: pm.details ?? "",
      })),
      degrees: degreesData.map((d) => ({
        id: d.id,
        degreeName: d.degreeName ?? "",
        school: d.school ?? "",
        degreeFileId: d.degreeFileId ?? "",
      })),
      certificates: certificationsData.map((c) => ({
        id: c.id,
        certName: c.certName ?? "",
        issuedBy: c.issuedBy ?? "",
        certFileId: c.certFileId ?? "",
      })),
    },
  });

  const familyFields = useFieldArray({ control: form.control, name: "familyMembers" });
  const bankFields = useFieldArray({ control: form.control, name: "bankAccounts" });
  const jobFields = useFieldArray({ control: form.control, name: "previousJobs" });
  const partyFields = useFieldArray({ control: form.control, name: "partyMemberships" });
  const degreeFields = useFieldArray({ control: form.control, name: "degrees" });
  const certFields = useFieldArray({ control: form.control, name: "certificates" });

  /* ── Submit: update employee + create/update/delete sub-entities ── */
  const onSubmit: SubmitHandler<FormValues> = async (rawFormData) => {
    try {
      setIsSaving(true);

      const formData = editFormSchema.parse(rawFormData);

      // Phase 1: Update flat employee fields
      const {
        familyMembers,
        bankAccounts,
        previousJobs,
        partyMemberships,
        degrees,
        certificates,
        visaNumber: _visaNumber,
        visaExpiry: _visaExpiry,
        passportNumber: _passportNumber,
        passportExpiry: _passportExpiry,
        workPermitNumber: _workPermitNumber,
        workPermitExpiry: _workPermitExpiry,
        workPermitFileId: _workPermitFileId,
        ...employeeData
      } = formData;

      const optionalFields = new Set(["socialInsuranceNo", "healthInsuranceNo", "portraitFileId"]);
      const cleanedEmployeeData = Object.fromEntries(
        Object.entries(employeeData).filter(
          ([key, value]) => !(optionalFields.has(key) && value === ""),
        ),
      ) as UpdateEmployeeInput;

      await updateMutation.mutateAsync({
        id: employeeId,
        ...cleanedEmployeeData,
      });

      // Phase 2: Create / Update / Delete sub-entities
      const subEntityErrors: string[] = [];
      const promises: Promise<void>[] = [];

      // --- Family Members ---
      syncSubEntities({
        items: familyMembers,
        initialIds: initialIds.familyMembers,
        label: "Thành viên gia đình",
        create: (body) =>
          createFamilyMemberMutation.mutateAsync({
            employeeId,
            ...body,
            relation: body.relation as FamilyRelationCode,
            isDependent: false,
          }),
        update: (id, body) =>
          updateFamilyMemberMutation.mutateAsync({
            employeeId,
            id,
            ...body,
            relation: body.relation as FamilyRelationCode,
          }),
        remove: (id) => deleteFamilyMemberMutation.mutateAsync({ employeeId, id }),
        promises,
        errors: subEntityErrors,
      });

      // --- Bank Accounts ---
      syncSubEntities({
        items: bankAccounts,
        initialIds: initialIds.bankAccounts,
        label: "Tài khoản ngân hàng",
        create: (body) =>
          createBankAccountMutation.mutateAsync({
            employeeId,
            ...body,
            isPrimary: false,
          }),
        update: (id, body) => updateBankAccountMutation.mutateAsync({ employeeId, id, ...body }),
        remove: (id) => deleteBankAccountMutation.mutateAsync({ employeeId, id }),
        promises,
        errors: subEntityErrors,
      });

      // --- Previous Jobs ---
      syncSubEntities({
        items: previousJobs,
        initialIds: initialIds.previousJobs,
        label: "Lịch sử công tác",
        create: (body) => createPreviousJobMutation.mutateAsync({ employeeId, ...body }),
        update: (id, body) => updatePreviousJobMutation.mutateAsync({ employeeId, id, ...body }),
        remove: (id) => deletePreviousJobMutation.mutateAsync({ employeeId, id }),
        promises,
        errors: subEntityErrors,
      });

      // --- Party Memberships ---
      syncSubEntities({
        items: partyMemberships,
        initialIds: initialIds.partyMemberships,
        label: "Đoàn/Đảng",
        create: (body) =>
          createPartyMembershipMutation.mutateAsync({
            employeeId,
            ...body,
            organizationType: body.organizationType as PartyOrgTypeCode,
          }),
        update: (id, body) =>
          updatePartyMembershipMutation.mutateAsync({
            employeeId,
            id,
            ...body,
            organizationType: body.organizationType as PartyOrgTypeCode,
          }),
        remove: (id) => deletePartyMembershipMutation.mutateAsync({ employeeId, id }),
        promises,
        errors: subEntityErrors,
      });

      // --- Degrees ---
      syncSubEntities({
        items: degrees,
        initialIds: initialIds.degrees,
        label: "Bằng cấp",
        create: (body) => createDegreeMutation.mutateAsync({ employeeId, ...body }),
        update: (id, body) =>
          updateDegreeMutation.mutateAsync({
            employeeId,
            id,
            degreeName: body.degreeName,
            school: body.school,
            degreeFileId: body.degreeFileId || undefined,
          }),
        remove: (id) => deleteDegreeMutation.mutateAsync({ employeeId, id }),
        promises,
        errors: subEntityErrors,
      });

      // --- Certifications ---
      syncSubEntities({
        items: certificates,
        initialIds: initialIds.certifications,
        label: "Chứng chỉ",
        create: (body) => createCertificationMutation.mutateAsync({ employeeId, ...body }),
        update: (id, body) =>
          updateCertificationMutation.mutateAsync({
            employeeId,
            id,
            certName: body.certName,
            issuedBy: body.issuedBy,
            certFileId: body.certFileId || undefined,
          }),
        remove: (id) => deleteCertificationMutation.mutateAsync({ employeeId, id }),
        promises,
        errors: subEntityErrors,
      });

      // --- Foreign Work Permits ---
      if (formData.isForeigner) {
        const hasWorkPermitData =
          formData.visaNumber ||
          formData.visaExpiry ||
          formData.passportNumber ||
          formData.passportExpiry ||
          formData.workPermitNumber ||
          formData.workPermitExpiry ||
          formData.workPermitFileId;
        if (hasWorkPermitData) {
          const permitPayload = {
            employeeId,
            visaNo: formData.visaNumber || undefined,
            visaExpiresOn: formData.visaExpiry || undefined,
            passportNo: formData.passportNumber || undefined,
            passportExpiresOn: formData.passportExpiry || undefined,
            workPermitNo: formData.workPermitNumber || undefined,
            workPermitExpiresOn: formData.workPermitExpiry || undefined,
            workPermitFileId: formData.workPermitFileId || undefined,
          };
          if (foreignWorkPermitsData[0]?.id) {
            promises.push(
              updateForeignWorkPermitMutation
                .mutateAsync({
                  ...permitPayload,
                  id: foreignWorkPermitsData[0].id,
                })
                .then(() => {})
                .catch((err: unknown) => {
                  subEntityErrors.push(
                    `Giấy phép lao động: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
                  );
                }),
            );
          } else {
            promises.push(
              createForeignWorkPermitMutation
                .mutateAsync(permitPayload)
                .then(() => {})
                .catch((err: unknown) => {
                  subEntityErrors.push(
                    `Giấy phép lao động: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
                  );
                }),
            );
          }
        }
      }

      await Promise.all(promises);

      if (subEntityErrors.length > 0) {
        const unique = [...new Set(subEntityErrors)];
        toast.warning(`Đã lưu thông tin chính nhưng lỗi: ${unique.join(", ")}`);
      } else {
        toast.success("Cập nhật hồ sơ thành công");
      }
      navigate({
        to: "/employees/$employeeId",
        params: { employeeId },
      });
    } catch (error: unknown) {
      applyFieldErrors(form.setError, error);
      if (!(error instanceof ApiResponseError)) {
        toast.error("Có lỗi xảy ra");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pencil className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-semibold text-slate-800">Cập nhật hồ sơ nhân sự</h1>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          Mã nhân sự: {emp.staffCode}
        </span>
      </div>

      <div className="px-6 pb-6 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ── THÔNG TIN CÁ NHÂN ── */}
            <section>
              <SectionHeader title="THÔNG TIN CÁ NHÂN" />
              <div className="mt-4 flex gap-4">
                <div className="shrink-0">
                  <label
                    htmlFor="portrait-upload"
                    className="flex h-32 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50"
                  >
                    {portraitPreview ? (
                      <img
                        src={portraitPreview}
                        alt="Ảnh chân dung"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <Plus className="h-4 w-4 text-slate-400" />
                    )}
                  </label>
                  <input
                    id="portrait-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (portraitPreview?.startsWith("blob:")) {
                        URL.revokeObjectURL(portraitPreview);
                      }
                      setPortraitPreview(file ? URL.createObjectURL(file) : null);

                      if (!file) {
                        form.setValue("portraitFileId", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        return;
                      }

                      setUploadingCount((c) => c + 1);
                      try {
                        const uploadedFile = await uploadFile(file);
                        form.setValue("portraitFileId", uploadedFile.id, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      } catch {
                        form.setValue("portraitFileId", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      } finally {
                        setUploadingCount((c) => c - 1);
                      }
                    }}
                  />
                  <p className="mt-1 text-center text-[10px] text-slate-400">Ảnh chân dung</p>
                  {form.formState.errors.portraitFileId && (
                    <p className="mt-1 text-center text-[10px] text-destructive">
                      {form.formState.errors.portraitFileId.message}
                    </p>
                  )}
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <FieldInput form={form} name="fullName" label="Họ tên *" />
                  <FormFieldSelect
                    form={form}
                    name="gender"
                    label="Giới tính *"
                    items={enumToSortedList(Gender)}
                  />
                  <FieldInput form={form} name="dob" label="Ngày sinh *" type="date" />
                  <FieldInput form={form} name="hometown" label="Quê quán *" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <FieldInput form={form} name="email" label="Email *" type="email" />
                <FieldInput form={form} name="phone" label="Số điện thoại *" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <FieldInput form={form} name="address" label="Địa chỉ *" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <FieldInput form={form} name="nationalId" label="CCCD *" />
                <FieldInput form={form} name="taxCode" label="Mã số thuế *" />
                <FieldInput form={form} name="socialInsuranceNo" label="Số bảo hiểm xã hội" />
                <FieldInput form={form} name="healthInsuranceNo" label="Số bảo hiểm y tế" />
              </div>
            </section>

            {/* ── NGƯỜI NƯỚC NGOÀI ── */}
            <section>
              <div className="flex items-center justify-between">
                <SectionHeader title="NGƯỜI NƯỚC NGOÀI" compact />
                <FormField
                  control={form.control}
                  name="isForeigner"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(v) => {
                            field.onChange(v);
                            setShowForeigner(!!v);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {showForeigner && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <FieldInput form={form} name="visaNumber" label="Số Visa *" />
                  <FieldInput
                    form={form}
                    name="visaExpiry"
                    label="Ngày hết hạn Visa *"
                    type="date"
                  />
                  <FieldInput form={form} name="passportNumber" label="Số Hộ chiếu *" />
                  <FieldInput
                    form={form}
                    name="passportExpiry"
                    label="Ngày hết hạn Hộ chiếu *"
                    type="date"
                  />
                  <FieldInput form={form} name="workPermitNumber" label="Số giấy phép lao động *" />
                  <FieldInput
                    form={form}
                    name="workPermitExpiry"
                    label="Ngày hết hạn giấy phép lao động *"
                    type="date"
                  />
                  <div className="col-span-2 flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="work-permit-pdf-edit"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCount((c) => c + 1);
                        try {
                          const uploaded = await uploadFile(file);
                          form.setValue("workPermitFileId", uploaded.id, {
                            shouldDirty: true,
                          });
                          toast.success("Tải PDF giấy phép lao động thành công");
                        } catch {
                          toast.error("Tải PDF thất bại");
                        } finally {
                          setUploadingCount((c) => c - 1);
                        }
                      }}
                    />
                    <FileUploadButton
                      control={form.control}
                      name="workPermitFileId"
                      inputId="work-permit-pdf-edit"
                      uploadedLabel="Đã tải PDF giấy phép"
                      defaultLabel="Tải PDF giấy phép lao động"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ── THÔNG TIN GIA ĐÌNH ── */}
            <DynamicSection
              title="THÔNG TIN GIA ĐÌNH"
              onAdd={() =>
                familyFields.append({
                  relation: "",
                  fullName: "",
                })
              }
            >
              {familyFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                  <FormFieldSelect
                    form={form}
                    name={`familyMembers.${index}.relation`}
                    label="Mối quan hệ *"
                    items={enumToSortedList(FamilyRelation)}
                  />
                  <FieldInput
                    form={form}
                    name={`familyMembers.${index}.fullName`}
                    label="Họ tên *"
                  />
                  <RemoveBtn onClick={() => familyFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── LỊCH SỬ CÔNG TÁC ── */}
            <DynamicSection
              title="LỊCH SỬ CÔNG TÁC"
              onAdd={() => jobFields.append({ workplace: "", startedOn: "", endedOn: "" })}
            >
              {jobFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_140px_140px_auto] items-end gap-3"
                >
                  <FieldInput
                    form={form}
                    name={`previousJobs.${index}.workplace`}
                    label="Tên nơi công tác *"
                  />
                  <FieldInput
                    form={form}
                    name={`previousJobs.${index}.startedOn`}
                    label="Từ ngày *"
                    type="date"
                  />
                  <FieldInput
                    form={form}
                    name={`previousJobs.${index}.endedOn`}
                    label="Đến ngày *"
                    type="date"
                  />
                  <RemoveBtn onClick={() => jobFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── THÔNG TIN NGÂN HÀNG ── */}
            <DynamicSection
              title="THÔNG TIN NGÂN HÀNG"
              onAdd={() => bankFields.append({ bankName: "", accountNo: "" })}
            >
              {bankFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                  <FieldInput
                    form={form}
                    name={`bankAccounts.${index}.bankName`}
                    label="Tên ngân hàng *"
                  />
                  <FieldInput
                    form={form}
                    name={`bankAccounts.${index}.accountNo`}
                    label="Số tài khoản *"
                  />
                  <RemoveBtn onClick={() => bankFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── THÔNG TIN ĐOÀN/ĐẢNG ── */}
            <DynamicSection
              title="THÔNG TIN ĐOÀN/ĐẢNG"
              onAdd={() => partyFields.append({ organizationType: "", joinedOn: "", details: "" })}
            >
              {partyFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[160px_140px_1fr_auto] items-end gap-3"
                >
                  <FormFieldSelect
                    form={form}
                    name={`partyMemberships.${index}.organizationType`}
                    label="Loại tổ chức *"
                    items={enumToSortedList(PartyOrgType)}
                  />
                  <FieldInput
                    form={form}
                    name={`partyMemberships.${index}.joinedOn`}
                    label="Ngày gia nhập *"
                    type="date"
                  />
                  <FieldInput
                    form={form}
                    name={`partyMemberships.${index}.details`}
                    label="Thông tin chi tiết *"
                  />
                  <RemoveBtn onClick={() => partyFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── TRÌNH ĐỘ HỌC VẤN ── */}
            <section>
              <SectionHeader title="TRÌNH ĐỘ HỌC VẤN" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <FormFieldSelect
                  form={form}
                  name="educationLevel"
                  label="Trình độ văn hóa *"
                  items={enumToSortedList(EducationLevel)}
                />
                <FormFieldSelect
                  form={form}
                  name="academicRank"
                  label="Học hàm/Học vị *"
                  items={enumToSortedList(AcademicRank)}
                />
              </div>
            </section>

            {/* ── THÔNG TIN BẰNG CẤP ── */}
            <DynamicSection
              title="THÔNG TIN BẰNG CẤP"
              onAdd={() => degreeFields.append({ degreeName: "", school: "", degreeFileId: "" })}
            >
              {degreeFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3">
                  <FieldInput form={form} name={`degrees.${index}.degreeName`} label="Tên bằng *" />
                  <FieldInput
                    form={form}
                    name={`degrees.${index}.school`}
                    label="Trường/Nơi cấp *"
                  />
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id={`degree-pdf-edit-${index}`}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCount((c) => c + 1);
                        try {
                          const uploaded = await uploadFile(file);
                          form.setValue(`degrees.${index}.degreeFileId`, uploaded.id, {
                            shouldDirty: true,
                          });
                          toast.success("Tải PDF bằng cấp thành công");
                        } catch {
                          toast.error("Tải PDF thất bại");
                        } finally {
                          setUploadingCount((c) => c - 1);
                        }
                      }}
                    />
                    <FileUploadButton
                      control={form.control}
                      name={`degrees.${index}.degreeFileId`}
                      inputId={`degree-pdf-edit-${index}`}
                      uploadedLabel="Đã tải"
                      defaultLabel="Tải PDF"
                    />
                  </div>
                  <RemoveBtn onClick={() => degreeFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── THÔNG TIN CHỨNG CHỈ ── */}
            <DynamicSection
              title="THÔNG TIN CHỨNG CHỈ"
              onAdd={() => certFields.append({ certName: "", issuedBy: "", certFileId: "" })}
            >
              {certFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3">
                  <FieldInput
                    form={form}
                    name={`certificates.${index}.certName`}
                    label="Tên chứng chỉ *"
                  />
                  <FieldInput
                    form={form}
                    name={`certificates.${index}.issuedBy`}
                    label="Nơi cấp *"
                  />
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id={`cert-pdf-edit-${index}`}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCount((c) => c + 1);
                        try {
                          const uploaded = await uploadFile(file);
                          form.setValue(`certificates.${index}.certFileId`, uploaded.id, {
                            shouldDirty: true,
                          });
                          toast.success("Tải PDF chứng chỉ thành công");
                        } catch {
                          toast.error("Tải PDF thất bại");
                        } finally {
                          setUploadingCount((c) => c - 1);
                        }
                      }}
                    />
                    <FileUploadButton
                      control={form.control}
                      name={`certificates.${index}.certFileId`}
                      inputId={`cert-pdf-edit-${index}`}
                      uploadedLabel="Đã tải"
                      defaultLabel="Tải PDF"
                    />
                  </div>
                  <RemoveBtn onClick={() => certFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── FOOTER ── */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-md"
                onClick={() =>
                  navigate({
                    to: "/employees/$employeeId",
                    params: { employeeId },
                  })
                }
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || isSaving || uploadingCount > 0}
                className="h-9 rounded-md bg-primary px-4 text-white hover:bg-primary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                {uploadingCount > 0
                  ? "Đang tải file..."
                  : updateMutation.isPending || isSaving
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

function FileUploadButton({
  control,
  name,
  inputId,
  uploadedLabel,
  defaultLabel,
}: {
  control: Control<FormValues>;
  name: string;
  inputId: string;
  uploadedLabel: string;
  defaultLabel: string;
}) {
  const value = useWatch({ control, name: name as never });
  return (
    <Button
      type="button"
      className={`h-8 rounded-md px-3 text-xs text-white ${
        value ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
      }`}
      onClick={() => document.getElementById(inputId)?.click()}
    >
      <Upload className="mr-1 h-3.5 w-3.5" />
      {value ? uploadedLabel : defaultLabel}
    </Button>
  );
}
