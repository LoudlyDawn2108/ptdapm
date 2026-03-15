import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  employeeDetailOptions,
  getFileUrl,
  uploadFile,
  useCreateBankAccount,
  useCreateCertification,
  useCreateDegree,
  useCreateFamilyMember,
  useCreatePartyMembership,
  useCreatePreviousJob,
  useUpdateEmployee,
} from "@/features/employees/api";
import { ApiResponseError, applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicRank,
  EducationLevel,
  FamilyRelation,
  Gender,
  PartyOrgType,
  type UpdateEmployeeInput,
  enumToSortedList,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Minus, Pencil, Plus, Save, Upload } from "lucide-react";
import { useState } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* ── Local form schema (employee + sub-entities) ── */

const editFormSchema = z.object({
  // --- Flat employee fields ---
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
  isForeigner: z.boolean().default(false),
  educationLevel: z.string().min(1, "Bắt buộc"),
  academicRank: z.string().optional(),
  portraitFileId: z.string().optional(),
  // --- Sub-entity arrays ---
  familyMembers: z
    .array(
      z.object({
        id: z.string().optional(),
        relation: z.string().min(1, "Bắt buộc"),
        fullName: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  bankAccounts: z
    .array(
      z.object({
        id: z.string().optional(),
        bankName: z.string().min(1, "Bắt buộc"),
        accountNo: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  previousJobs: z
    .array(
      z.object({
        id: z.string().optional(),
        workplace: z.string().min(1, "Bắt buộc"),
        startedOn: z.string().min(1, "Bắt buộc"),
        endedOn: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  partyMemberships: z
    .array(
      z.object({
        id: z.string().optional(),
        organizationType: z.string().min(1, "Bắt buộc"),
        joinedOn: z.string().min(1, "Bắt buộc"),
        details: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  degrees: z
    .array(
      z.object({
        id: z.string().optional(),
        degreeName: z.string().min(1, "Bắt buộc"),
        school: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  certificates: z
    .array(
      z.object({
        id: z.string().optional(),
        certName: z.string().min(1, "Bắt buộc"),
        issuedBy: z.string().optional(),
      }),
    )
    .default([]),
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
  academicRank?: string;
  isForeigner?: boolean;
  familyMembers?: SubmitValues["familyMembers"];
  bankAccounts?: SubmitValues["bankAccounts"];
  previousJobs?: SubmitValues["previousJobs"];
  partyMemberships?: SubmitValues["partyMemberships"];
  degrees?: SubmitValues["degrees"];
  certificates?: SubmitValues["certificates"];
};

export const Route = createFileRoute("/_authenticated/employees/$employeeId/edit")({
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

  const agg = data?.data as any;
  const emp = agg?.employee ?? agg;

  if (!emp) {
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
  aggregate: any;
}) {
  const navigate = useNavigate();
  const updateMutation = useUpdateEmployee();
  const createFamilyMemberMutation = useCreateFamilyMember();
  const createBankAccountMutation = useCreateBankAccount();
  const createPreviousJobMutation = useCreatePreviousJob();
  const createPartyMembershipMutation = useCreatePartyMembership();
  const createDegreeMutation = useCreateDegree();
  const createCertificationMutation = useCreateCertification();
  const [isSaving, setIsSaving] = useState(false);

  const emp = aggregate.employee ?? aggregate;

  const [portraitPreview, setPortraitPreview] = useState<string | null>(
    emp.portraitFileId ? getFileUrl(emp.portraitFileId) : null,
  );

  const familyMembersData = aggregate.familyMembers ?? [];
  const bankAccountsData = aggregate.bankAccounts ?? [];
  const previousJobsData = aggregate.previousJobs ?? [];
  const partyMembershipsData = aggregate.partyMemberships ?? [];
  const degreesData = aggregate.degrees ?? [];
  const certificationsData = aggregate.certifications ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      fullName: emp.fullName ?? "",
      gender: emp.gender ?? "",
      dob: typeof emp.dob === "string" ? emp.dob.split("T")[0] : "",
      hometown: emp.hometown ?? "",
      email: emp.email ?? "",
      phone: emp.phone ?? "",
      address: emp.address ?? "",
      nationalId: emp.nationalId ?? "",
      taxCode: emp.taxCode ?? "",
      socialInsuranceNo: emp.socialInsuranceNo ?? "",
      healthInsuranceNo: emp.healthInsuranceNo ?? "",
      isForeigner: emp.isForeigner ?? false,
      educationLevel: emp.educationLevel ?? "",
      academicRank: emp.academicRank ?? "",
      portraitFileId: emp.portraitFileId ?? "",
      familyMembers: familyMembersData.map((fm: any) => ({
        id: fm.id,
        relation: fm.relation ?? "",
        fullName: fm.fullName ?? "",
      })),
      bankAccounts: bankAccountsData.map((ba: any) => ({
        id: ba.id,
        bankName: ba.bankName ?? "",
        accountNo: ba.accountNo ?? "",
      })),
      previousJobs: previousJobsData.map((pj: any) => ({
        id: pj.id,
        workplace: pj.workplace ?? "",
        startedOn: pj.startedOn ? String(pj.startedOn).split("T")[0] : "",
        endedOn: pj.endedOn ? String(pj.endedOn).split("T")[0] : "",
      })),
      partyMemberships: partyMembershipsData.map((pm: any) => ({
        id: pm.id,
        organizationType: pm.organizationType ?? "",
        joinedOn: pm.joinedOn ? String(pm.joinedOn).split("T")[0] : "",
        details: pm.details ?? "",
      })),
      degrees: degreesData.map((d: any) => ({
        id: d.id,
        degreeName: d.degreeName ?? "",
        school: d.school ?? "",
      })),
      certificates: certificationsData.map((c: any) => ({
        id: c.id,
        certName: c.certName ?? "",
        issuedBy: c.issuedBy ?? "",
      })),
    },
  });

  const familyFields = useFieldArray({ control: form.control, name: "familyMembers" });
  const bankFields = useFieldArray({ control: form.control, name: "bankAccounts" });
  const jobFields = useFieldArray({ control: form.control, name: "previousJobs" });
  const partyFields = useFieldArray({ control: form.control, name: "partyMemberships" });
  const degreeFields = useFieldArray({ control: form.control, name: "degrees" });
  const certFields = useFieldArray({ control: form.control, name: "certificates" });

  /* ── Submit: update employee + create new sub-entities ── */
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
        ...employeeData
      } = formData;

      // Only strip truly optional fields that are empty — keep required fields as-is
      const optionalFields = new Set([
        "taxCode",
        "socialInsuranceNo",
        "healthInsuranceNo",
        "academicRank",
        "portraitFileId",
      ]);
      const cleanedEmployeeData = Object.fromEntries(
        Object.entries(employeeData).filter(
          ([key, value]) => !(optionalFields.has(key) && value === ""),
        ),
      ) as UpdateEmployeeInput;

      await updateMutation.mutateAsync({
        id: employeeId,
        ...cleanedEmployeeData,
      });

      // Phase 2: Create new sub-entities (those without id)
      const promises: Promise<unknown>[] = [];

      for (const fm of familyMembers.filter((x) => !x.id)) {
        const { id: _id, ...body } = fm;
        promises.push(createFamilyMemberMutation.mutateAsync({ employeeId, ...body }));
      }
      for (const ba of bankAccounts.filter((x) => !x.id)) {
        const { id: _id, ...body } = ba;
        promises.push(createBankAccountMutation.mutateAsync({ employeeId, ...body }));
      }
      for (const pj of previousJobs.filter((x) => !x.id)) {
        const { id: _id, ...body } = pj;
        promises.push(createPreviousJobMutation.mutateAsync({ employeeId, ...body }));
      }
      for (const pm of partyMemberships.filter((x) => !x.id)) {
        const { id: _id, ...body } = pm;
        promises.push(createPartyMembershipMutation.mutateAsync({ employeeId, ...body }));
      }
      for (const d of degrees.filter((x) => !x.id)) {
        const { id: _id, ...body } = d;
        promises.push(createDegreeMutation.mutateAsync({ employeeId, ...body }));
      }
      for (const c of certificates.filter((x) => !x.id)) {
        const { id: _id, ...body } = c;
        promises.push(createCertificationMutation.mutateAsync({ employeeId, ...body }));
      }

      await Promise.all(promises);

      toast.success("Cập nhật hồ sơ thành công");
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
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E9EEFF] text-[#3B5CCC]">
          <Pencil className="h-4 w-4" />
        </div>
        <h1 className="text-sm font-semibold text-slate-800">Cập nhật hồ sơ nhân sự</h1>
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
                      setPortraitPreview(file ? URL.createObjectURL(file) : null);

                      if (!file) {
                        form.setValue("portraitFileId", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        return;
                      }

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
                      }
                    }}
                  />
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <FI form={form} name="fullName" label="Họ tên *" />
                  <FormFieldSelect
                    form={form}
                    name="gender"
                    label="Giới tính *"
                    items={enumToSortedList(Gender)}
                  />
                  <FI form={form} name="dob" label="Ngày sinh *" type="date" />
                  <FI form={form} name="hometown" label="Quê quán *" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <FI form={form} name="email" label="Email *" type="email" />
                <FI form={form} name="phone" label="Số điện thoại *" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <FI form={form} name="address" label="Địa chỉ *" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <FI form={form} name="nationalId" label="CCCD *" />
                <FI form={form} name="taxCode" label="Mã số thuế" />
                <FI form={form} name="socialInsuranceNo" label="Số bảo hiểm xã hội" />
                <FI form={form} name="healthInsuranceNo" label="Số bảo hiểm y tế" />
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
                        <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
                  <FI form={form} name={`familyMembers.${index}.fullName`} label="Họ tên *" />
                  <RemoveBtn onClick={() => familyFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── LỊCH SỬ CÔNG TÁC ── */}
            <section>
              <div className="flex items-center justify-between">
                <SectionHeader title="LỊCH SỬ CÔNG TÁC" compact />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 rounded-full bg-[#E9EEFF] px-2 text-[11px] text-[#3B5CCC] hover:bg-[#DCE6FF]"
                  onClick={() => {
                    if (jobFields.fields.length === 0) {
                      jobFields.append({ workplace: "", startedOn: "", endedOn: "" });
                    }
                  }}
                >
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${jobFields.fields.length > 0 ? "rotate-180" : ""}`}
                  />
                  {jobFields.fields.length > 0 ? "Đang hiển thị" : "Mở rộng"}
                </Button>
              </div>
              {jobFields.fields.length > 0 && (
                <div className="mt-3 space-y-3">
                  {jobFields.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_140px_140px_auto] items-end gap-3"
                    >
                      <FI
                        form={form}
                        name={`previousJobs.${index}.workplace`}
                        label="Tên nơi công tác *"
                      />
                      <FI
                        form={form}
                        name={`previousJobs.${index}.startedOn`}
                        label="Từ ngày *"
                        type="date"
                      />
                      <FI
                        form={form}
                        name={`previousJobs.${index}.endedOn`}
                        label="Đến ngày *"
                        type="date"
                      />
                      <RemoveBtn onClick={() => jobFields.remove(index)} />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 rounded-md text-xs text-[#3B5CCC] hover:bg-[#E9EEFF]"
                    onClick={() => jobFields.append({ workplace: "", startedOn: "", endedOn: "" })}
                  >
                    <Plus className="h-3 w-3" />
                    Thêm dòng
                  </Button>
                </div>
              )}
            </section>

            {/* ── THÔNG TIN NGÂN HÀNG ── */}
            <DynamicSection
              title="THÔNG TIN NGÂN HÀNG"
              onAdd={() => bankFields.append({ bankName: "", accountNo: "" })}
            >
              {bankFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                  <FI form={form} name={`bankAccounts.${index}.bankName`} label="Tên ngân hàng *" />
                  <FI form={form} name={`bankAccounts.${index}.accountNo`} label="Số tài khoản *" />
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
                  <FI
                    form={form}
                    name={`partyMemberships.${index}.joinedOn`}
                    label="Ngày gia nhập *"
                    type="date"
                  />
                  <FI
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
                  label="Học hàm/Học vị"
                  items={enumToSortedList(AcademicRank)}
                />
              </div>
            </section>

            {/* ── THÔNG TIN BẰNG CẤP ── */}
            <DynamicSection
              title="THÔNG TIN BẰNG CẤP"
              onAdd={() => degreeFields.append({ degreeName: "", school: "" })}
            >
              {degreeFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3">
                  <FI form={form} name={`degrees.${index}.degreeName`} label="Tên bằng *" />
                  <FI form={form} name={`degrees.${index}.school`} label="Trường/Nơi cấp *" />
                  <Button
                    type="button"
                    className="h-8 rounded-md bg-[#3B5CCC] px-3 text-xs text-white hover:bg-[#2F4FB8]"
                  >
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    Tải PDF
                  </Button>
                  <RemoveBtn onClick={() => degreeFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ── THÔNG TIN CHỨNG CHỈ ── */}
            <DynamicSection
              title="THÔNG TIN CHỨNG CHỈ"
              onAdd={() => certFields.append({ certName: "", issuedBy: "" })}
            >
              {certFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3">
                  <FI form={form} name={`certificates.${index}.certName`} label="Tên chứng chỉ *" />
                  <FI form={form} name={`certificates.${index}.issuedBy`} label="Nơi cấp" />
                  <Button
                    type="button"
                    className="h-8 rounded-md bg-[#3B5CCC] px-3 text-xs text-white hover:bg-[#2F4FB8]"
                  >
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    Tải PDF
                  </Button>
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
                disabled={updateMutation.isPending || isSaving}
                className="h-9 rounded-md bg-[#3B5CCC] px-4 text-white hover:bg-[#2F4FB8]"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending || isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Reusable form field helpers
══════════════════════════════════════════ */

function RequiredLabel({ label }: { label: string }) {
  const isRequired = label.trim().endsWith("*");
  const text = isRequired ? label.replace(/\s*\*$/, "") : label;
  return (
    <span className="text-xs font-medium text-slate-600">
      {text}
      {isRequired && <span className="text-red-500"> *</span>}
    </span>
  );
}

function SectionHeader({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "mt-2"}>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}

function DynamicSection({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <SectionHeader title={title} compact />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full bg-[#E9EEFF] text-[#3B5CCC] hover:bg-[#DCE6FF]"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
      onClick={onClick}
    >
      <Minus className="h-4 w-4" />
    </Button>
  );
}

function FI({
  form,
  name,
  label,
  type = "text",
}: {
  form: any;
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredLabel label={label} />
          </FormLabel>
          <FormControl>
            <Input type={type} {...field} value={field.value ?? ""} className="h-9 rounded-md" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormFieldSelect({
  form,
  name,
  label,
  items,
}: {
  form: any;
  name: string;
  label: string;
  items: { code: string; label: string }[];
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredLabel label={label} />
          </FormLabel>
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full h-9 rounded-md">
                <SelectValue placeholder="Chọn..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
