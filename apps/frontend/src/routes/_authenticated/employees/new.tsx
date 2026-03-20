import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  uploadFile,
  useCreateBankAccount,
  useCreateCertification,
  useCreateDegree,
  useCreateEmployee,
  useCreateFamilyMember,
  useCreateForeignWorkPermit,
  useCreatePartyMembership,
  useCreatePreviousJob,
} from "@/features/employees/api";
import {
  DynamicSection,
  FieldInput,
  FormFieldSelect,
  RemoveBtn,
  RequiredLabel,
  SectionHeader,
} from "@/features/employees/components/form-helpers";
import { ApiResponseError, applyFieldErrors } from "@/lib/error-handler";
import { authorizeRoute } from "@/lib/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicRank,
  type CreateEmployeeInput,
  EducationLevel,
  FamilyRelation,
  type FamilyRelationCode,
  Gender,
  PartyOrgType,
  type PartyOrgTypeCode,
  enumToSortedList,
} from "@hrms/shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Upload, UserPlus } from "lucide-react";
import { useState } from "react";
import { type Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/employees/new")({
  beforeLoad: authorizeRoute("/employees/new"),
  component: NewEmployeePage,
});

// ── Form schema (local — includes sub-entity arrays) ──
const formSchema = z
  .object({
    // ── Employee flat fields (matches backend createEmployeeSchema) ──
    fullName: z.string().min(1, "Bắt buộc"),
    gender: z.string().min(1, "Bắt buộc"),
    dob: z.string().min(1, "Bắt buộc"),
    hometown: z.string().min(1, "Bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(1, "Bắt buộc"),
    address: z.string().min(1, "Bắt buộc"),
    nationalId: z.string().min(1, "Bắt buộc"),
    taxCode: z.string().optional(),
    socialInsuranceNo: z.string().optional(),
    healthInsuranceNo: z.string().optional(),
    portraitFileId: z.string().min(1, "Ảnh chân dung là bắt buộc"),
    isForeigner: z.boolean().default(false),
    visaNumber: z.string().optional(),
    visaExpiry: z.string().optional(),
    passportNumber: z.string().optional(),
    passportExpiry: z.string().optional(),
    workPermitNumber: z.string().optional(),
    workPermitExpiry: z.string().optional(),
    educationLevel: z.string().min(1, "Bắt buộc"),
    academicRank: z.string().optional(),

    // ── Sub-entity arrays ──
    familyMembers: z
      .array(
        z.object({
          relation: z.string().min(1, "Bắt buộc"),
          fullName: z.string().min(1, "Bắt buộc"),
        }),
      )
      .default([]),
    bankAccounts: z
      .array(
        z.object({
          bankName: z.string().min(1, "Bắt buộc"),
          accountNo: z.string().min(1, "Bắt buộc"),
        }),
      )
      .default([]),
    partyMemberships: z
      .array(
        z.object({
          organizationType: z.string().min(1, "Bắt buộc"),
          joinedOn: z.string().min(1, "Bắt buộc"),
          details: z.string().min(1, "Bắt buộc"),
        }),
      )
      .default([]),
    degrees: z
      .array(
        z.object({
          degreeName: z.string().min(1, "Bắt buộc"),
          school: z.string().min(1, "Bắt buộc"),
          degreeFileId: z.string().optional(),
        }),
      )
      .default([]),
    certificates: z
      .array(
        z.object({
          certName: z.string().min(1, "Bắt buộc"),
          issuedBy: z.string().optional(),
          certFileId: z.string().optional(),
        }),
      )
      .default([]),
    workPermitFileId: z.string().optional(),
    previousJobs: z
      .array(
        z.object({
          workplace: z.string().min(1, "Bắt buộc"),
          startedOn: z.string().min(1, "Bắt buộc"),
          endedOn: z.string().min(1, "Bắt buộc"),
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

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

function FileUploadButton({
  control,
  name,
  inputId,
  uploadedLabel,
  defaultLabel,
}: {
  control: Control<FormInput>;
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

function NewEmployeePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();
  const createFamilyMember = useCreateFamilyMember();
  const createBankAccount = useCreateBankAccount();
  const createPreviousJob = useCreatePreviousJob();
  const createPartyMembership = useCreatePartyMembership();
  const createDegree = useCreateDegree();
  const createCertification = useCreateCertification();
  const createForeignWorkPermit = useCreateForeignWorkPermit();
  const [showForeigner, setShowForeigner] = useState(false);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      dob: "",
      hometown: "",
      email: "",
      phone: "",
      address: "",
      nationalId: "",
      taxCode: "",
      socialInsuranceNo: "",
      healthInsuranceNo: "",
      portraitFileId: "",
      isForeigner: false,
      visaNumber: "",
      visaExpiry: "",
      passportNumber: "",
      passportExpiry: "",
      workPermitNumber: "",
      workPermitExpiry: "",
      workPermitFileId: "",
      educationLevel: "",
      academicRank: "",
      // Required sections — start with 1 empty row
      familyMembers: [{ relation: "", fullName: "" }],
      bankAccounts: [{ bankName: "", accountNo: "" }],
      partyMemberships: [{ organizationType: "", joinedOn: "", details: "" }],
      degrees: [{ degreeName: "", school: "", degreeFileId: "" }],
      certificates: [{ certName: "", issuedBy: "", certFileId: "" }],
      previousJobs: [{ workplace: "", startedOn: "", endedOn: "" }],
    },
  });

  const familyFields = useFieldArray({ control: form.control, name: "familyMembers" });
  const bankFields = useFieldArray({ control: form.control, name: "bankAccounts" });
  const partyFields = useFieldArray({ control: form.control, name: "partyMemberships" });
  const degreeFields = useFieldArray({ control: form.control, name: "degrees" });
  const certFields = useFieldArray({ control: form.control, name: "certificates" });
  const jobFields = useFieldArray({ control: form.control, name: "previousJobs" });

  const onSubmit = async (data: FormValues) => {
    try {
      // Phase 1: Create employee (flat fields only)
      const employeePayload: CreateEmployeeInput = {
        fullName: data.fullName,
        dob: data.dob,
        gender: data.gender as CreateEmployeeInput["gender"],
        nationalId: data.nationalId,
        hometown: data.hometown,
        address: data.address,
        email: data.email,
        phone: data.phone,
        taxCode: data.taxCode || undefined,
        socialInsuranceNo: data.socialInsuranceNo || undefined,
        healthInsuranceNo: data.healthInsuranceNo || undefined,
        portraitFileId: data.portraitFileId || undefined,
        isForeigner: data.isForeigner,
        educationLevel: data.educationLevel as CreateEmployeeInput["educationLevel"],
        academicRank: (data.academicRank || undefined) as CreateEmployeeInput["academicRank"],
      };

      const result = await createMutation.mutateAsync(employeePayload);
      const created =
        result && typeof result === "object" && "data" in result ? result.data : result;
      const employeeId =
        created && typeof created === "object" && "id" in created ? String(created.id) : undefined;

      if (!employeeId) {
        toast.error("Không thể tạo nhân sự. Vui lòng thử lại.");
        return;
      }

      // Phase 2: Create sub-entities in parallel
      const subEntityErrors: string[] = [];

      const subEntityPromises: Promise<void>[] = [];

      for (const fm of data.familyMembers ?? []) {
        if (!fm.fullName || !fm.relation) continue;
        subEntityPromises.push(
          createFamilyMember
            .mutateAsync({
              employeeId,
              relation: fm.relation as FamilyRelationCode,
              fullName: fm.fullName,
              isDependent: false,
            })
            .then(() => {})
            .catch((err: unknown) => {
              subEntityErrors.push(
                `Thành viên gia đình: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
              );
            }),
        );
      }

      for (const ba of data.bankAccounts ?? []) {
        if (!ba.accountNo || !ba.bankName) continue;
        subEntityPromises.push(
          createBankAccount
            .mutateAsync({
              employeeId,
              bankName: ba.bankName,
              accountNo: ba.accountNo,
              isPrimary: false,
            })
            .then(() => {})
            .catch((err: unknown) => {
              subEntityErrors.push(
                `Tài khoản ngân hàng: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
              );
            }),
        );
      }

      for (const pm of data.partyMemberships ?? []) {
        if (!pm.organizationType || !pm.joinedOn || !pm.details) continue;
        subEntityPromises.push(
          createPartyMembership
            .mutateAsync({
              employeeId,
              organizationType: pm.organizationType as PartyOrgTypeCode,
              joinedOn: pm.joinedOn,
              details: pm.details,
            })
            .then(() => {})
            .catch((err: unknown) => {
              subEntityErrors.push(
                `Thông tin đoàn/đảng: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
              );
            }),
        );
      }

      for (const pj of data.previousJobs ?? []) {
        if (!pj.workplace || !pj.startedOn || !pj.endedOn) continue;
        subEntityPromises.push(
          createPreviousJob
            .mutateAsync({
              employeeId,
              workplace: pj.workplace,
              startedOn: pj.startedOn,
              endedOn: pj.endedOn,
            })
            .then(() => {})
            .catch((err: unknown) => {
              subEntityErrors.push(
                `Lịch sử công tác: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
              );
            }),
        );
      }

      for (const d of data.degrees ?? []) {
        if (!d.degreeName || !d.school) continue;
        subEntityPromises.push(
          createDegree
            .mutateAsync({
              employeeId,
              degreeName: d.degreeName,
              school: d.school,
              degreeFileId: d.degreeFileId || undefined,
            })
            .then(() => {})
            .catch((err: unknown) => {
              subEntityErrors.push(
                `Bằng cấp: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
              );
            }),
        );
      }

      for (const c of data.certificates ?? []) {
        if (!c.certName) continue;
        subEntityPromises.push(
          createCertification
            .mutateAsync({
              employeeId,
              certName: c.certName,
              issuedBy: c.issuedBy || undefined,
              certFileId: c.certFileId || undefined,
            })
            .then(() => {})
            .catch((err: unknown) => {
              subEntityErrors.push(
                `Chứng chỉ: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
              );
            }),
        );
      }

      if (data.isForeigner) {
        const hasWorkPermitData =
          data.visaNumber ||
          data.visaExpiry ||
          data.passportNumber ||
          data.passportExpiry ||
          data.workPermitNumber ||
          data.workPermitExpiry ||
          data.workPermitFileId;
        if (hasWorkPermitData) {
          subEntityPromises.push(
            createForeignWorkPermit
              .mutateAsync({
                employeeId,
                visaNo: data.visaNumber || undefined,
                visaExpiresOn: data.visaExpiry || undefined,
                passportNo: data.passportNumber || undefined,
                passportExpiresOn: data.passportExpiry || undefined,
                workPermitNo: data.workPermitNumber || undefined,
                workPermitExpiresOn: data.workPermitExpiry || undefined,
                workPermitFileId: data.workPermitFileId || undefined,
              })
              .then(() => {})
              .catch((err: unknown) => {
                subEntityErrors.push(
                  `Giấy phép lao động: ${err instanceof Error ? err.message : "Lỗi không xác định"}`,
                );
              }),
          );
        }
      }

      await Promise.all(subEntityPromises);

      if (subEntityErrors.length > 0) {
        toast.warning(
          `Đã tạo nhân sự nhưng một số thông tin bổ sung lỗi: ${[...new Set(subEntityErrors)].join(", ")}`,
        );
      } else {
        toast.success("Thêm nhân sự thành công");
      }

      navigate({ to: "/employees" });
    } catch (error: unknown) {
      applyFieldErrors(form.setError, error);
      if (!(error instanceof ApiResponseError)) {
        toast.error("Có lỗi xảy ra");
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserPlus className="h-4 w-4" />
        </div>
        <h1 className="text-sm font-semibold text-slate-800">Thêm hồ sơ nhân sự</h1>
      </div>

      <div className="px-6 pb-6 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ═══════ THÔNG TIN CÁ NHÂN ═══════ */}
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
                <FieldInput form={form} name="taxCode" label="Mã số thuế" />
                <FieldInput form={form} name="socialInsuranceNo" label="Số bảo hiểm xã hội" />
                <FieldInput form={form} name="healthInsuranceNo" label="Số bảo hiểm y tế" />
              </div>
            </section>

            {/* ═══════ NGƯỜI NƯỚC NGOÀI ═══════ */}
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
                          checked={field.value}
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
                      id="work-permit-pdf"
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
                      inputId="work-permit-pdf"
                      uploadedLabel="Đã tải PDF giấy phép"
                      defaultLabel="Tải PDF giấy phép lao động"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ═══════ THÔNG TIN GIA ĐÌNH ═══════ */}
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

            {/* ═══════ LỊCH SỬ CÔNG TÁC ═══════ */}
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

            {/* ═══════ THÔNG TIN NGÂN HÀNG ═══════ */}
            <DynamicSection
              title="THÔNG TIN NGÂN HÀNG"
              onAdd={() =>
                bankFields.append({
                  bankName: "",
                  accountNo: "",
                })
              }
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

            {/* ═══════ THÔNG TIN ĐOÀN/ĐẢNG ═══════ */}
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

            {/* ═══════ TRÌNH ĐỘ HỌC VẤN ═══════ */}
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
                  label="Học hàm/Học vị"
                  items={enumToSortedList(AcademicRank)}
                />
              </div>
            </section>

            {/* ═══════ THÔNG TIN BẰNG CẤP ═══════ */}
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
                      id={`degree-pdf-${index}`}
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
                      inputId={`degree-pdf-${index}`}
                      uploadedLabel="Đã tải"
                      defaultLabel="Tải PDF"
                    />
                  </div>
                  <RemoveBtn onClick={() => degreeFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ THÔNG TIN CHỨNG CHỈ ═══════ */}
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
                  <FieldInput form={form} name={`certificates.${index}.issuedBy`} label="Nơi cấp" />
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id={`cert-pdf-${index}`}
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
                      inputId={`cert-pdf-${index}`}
                      uploadedLabel="Đã tải"
                      defaultLabel="Tải PDF"
                    />
                  </div>
                  <RemoveBtn onClick={() => certFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ FOOTER ═══════ */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-md"
                onClick={() => navigate({ to: "/employees" })}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || uploadingCount > 0}
                className="h-9 rounded-md bg-primary px-4 text-white hover:bg-primary/90"
              >
                {uploadingCount > 0
                  ? "Đang tải file..."
                  : createMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu hồ sơ nhân sự"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
