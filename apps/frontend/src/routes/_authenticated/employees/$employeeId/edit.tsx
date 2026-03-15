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
  useCreateBankAccount,
  useCreateFamilyMember,
  useCreatePartyMembership,
  useCreatePreviousJob,
  useUpdateEmployee,
} from "@/features/employees/api";
import { applyFieldErrors } from "@/lib/error-handler";
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
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const updateMutation = useUpdateEmployee();
  const createFamilyMemberMutation = useCreateFamilyMember();
  const createBankAccountMutation = useCreateBankAccount();
  const createPreviousJobMutation = useCreatePreviousJob();
  const createPartyMembershipMutation = useCreatePartyMembership();
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));

  const form = useForm<FormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      isForeigner: false,
      familyMembers: [],
      bankAccounts: [],
      previousJobs: [],
      partyMemberships: [],
      degrees: [],
      certificates: [],
    },
  });

  const familyFields = useFieldArray({ control: form.control, name: "familyMembers" });
  const bankFields = useFieldArray({ control: form.control, name: "bankAccounts" });
  const jobFields = useFieldArray({ control: form.control, name: "previousJobs" });
  const partyFields = useFieldArray({ control: form.control, name: "partyMemberships" });
  const degreeFields = useFieldArray({ control: form.control, name: "degrees" });
  const certFields = useFieldArray({ control: form.control, name: "certificates" });

  /* ── Populate form with aggregate data ── */
  useEffect(() => {
    if (!data?.data) return;
    const agg = data.data as any;
    const emp = agg.employee ?? agg;
    const familyMembers = agg.familyMembers ?? [];
    const bankAccounts = agg.bankAccounts ?? [];
    const previousJobs = agg.previousJobs ?? [];
    const partyMemberships = agg.partyMemberships ?? [];
    const degrees = agg.degrees ?? [];
    const certifications = agg.certifications ?? [];

    form.reset({
      // Flat fields
      fullName: emp.fullName ?? "",
      dob: typeof emp.dob === "string" ? emp.dob.split("T")[0] : "",
      gender: emp.gender ?? "",
      nationalId: emp.nationalId ?? "",
      hometown: emp.hometown ?? "",
      address: emp.address ?? "",
      taxCode: emp.taxCode ?? "",
      socialInsuranceNo: emp.socialInsuranceNo ?? "",
      healthInsuranceNo: emp.healthInsuranceNo ?? "",
      email: emp.email ?? "",
      phone: emp.phone ?? "",
      isForeigner: emp.isForeigner ?? false,
      educationLevel: emp.educationLevel ?? "",
      academicRank: emp.academicRank ?? "",
      portraitFileId: emp.portraitFileId ?? "",
      // Sub-entity arrays
      familyMembers: familyMembers.map((fm: any) => ({
        id: fm.id,
        relation: fm.relation ?? "",
        fullName: fm.fullName ?? "",
      })),
      bankAccounts: bankAccounts.map((ba: any) => ({
        id: ba.id,
        bankName: ba.bankName ?? "",
        accountNo: ba.accountNo ?? "",
      })),
      previousJobs: previousJobs.map((pj: any) => ({
        id: pj.id,
        workplace: pj.workplace ?? "",
        startedOn: pj.startedOn ? String(pj.startedOn).split("T")[0] : "",
        endedOn: pj.endedOn ? String(pj.endedOn).split("T")[0] : "",
      })),
      partyMemberships: partyMemberships.map((pm: any) => ({
        id: pm.id,
        organizationType: pm.organizationType ?? "",
        joinedOn: pm.joinedOn ? String(pm.joinedOn).split("T")[0] : "",
        details: pm.details ?? "",
      })),
      degrees: degrees.map((d: any) => ({
        id: d.id,
        degreeName: d.degreeName ?? "",
        school: d.school ?? "",
      })),
      certificates: (certifications ?? []).map((c: any) => ({
        id: c.id,
        certName: c.certName ?? "",
        issuedBy: c.issuedBy ?? "",
      })),
    });
  }, [data, form]);

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

      const cleanedEmployeeData = Object.fromEntries(
        Object.entries(employeeData).filter(([, value]) => value !== ""),
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

      await Promise.all(promises);

      toast.success("Cập nhật hồ sơ thành công");
      navigate({
        to: "/employees/$employeeId",
        params: { employeeId },
      });
    } catch (error: unknown) {
      if (error instanceof Error && "fields" in error) {
        applyFieldErrors(form.setError, error);
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } finally {
      setIsSaving(false);
    }
  };

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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setPortraitPreview(file ? URL.createObjectURL(file) : null);
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

            {/* ══════════════════════════════════════════
                SUB-ENTITY SECTIONS
            ══════════════════════════════════════════ */}

            {/* ── THÔNG TIN GIA ĐÌNH ── */}
            <section>
              <DynamicSectionHeader
                title="THÔNG TIN GIA ĐÌNH"
                onAdd={() =>
                  familyFields.append({
                    relation: "",
                    fullName: "",
                  })
                }
              />
              {familyFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Thành viên #{index + 1}
                      {field.id && form.getValues(`familyMembers.${index}.id`) ? (
                        <span className="ml-2 text-[10px] text-slate-400">(đã lưu)</span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-500">(mới)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => familyFields.remove(index)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormFieldSelect
                      form={form}
                      name={`familyMembers.${index}.relation`}
                      label="Quan hệ *"
                      items={enumToSortedList(FamilyRelation)}
                    />
                    <FI form={form} name={`familyMembers.${index}.fullName`} label="Họ tên *" />
                  </div>
                </div>
              ))}
              {familyFields.fields.length === 0 && (
                <p className="mt-3 text-xs text-slate-400 italic">Chưa có thông tin gia đình.</p>
              )}
            </section>

            {/* ── THÔNG TIN NGÂN HÀNG ── */}
            <section>
              <DynamicSectionHeader
                title="THÔNG TIN NGÂN HÀNG"
                onAdd={() => bankFields.append({ bankName: "", accountNo: "" })}
              />
              {bankFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Tài khoản #{index + 1}
                      {form.getValues(`bankAccounts.${index}.id`) ? (
                        <span className="ml-2 text-[10px] text-slate-400">(đã lưu)</span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-500">(mới)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => bankFields.remove(index)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FI form={form} name={`bankAccounts.${index}.bankName`} label="Ngân hàng *" />
                    <FI
                      form={form}
                      name={`bankAccounts.${index}.accountNo`}
                      label="Số tài khoản *"
                    />
                  </div>
                </div>
              ))}
              {bankFields.fields.length === 0 && (
                <p className="mt-3 text-xs text-slate-400 italic">Chưa có thông tin ngân hàng.</p>
              )}
            </section>

            {/* ── QUÁ TRÌNH CÔNG TÁC ── */}
            <section>
              <DynamicSectionHeader
                title="QUÁ TRÌNH CÔNG TÁC"
                onAdd={() => jobFields.append({ workplace: "", startedOn: "", endedOn: "" })}
              />
              {jobFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Công tác #{index + 1}
                      {form.getValues(`previousJobs.${index}.id`) ? (
                        <span className="ml-2 text-[10px] text-slate-400">(đã lưu)</span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-500">(mới)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => jobFields.remove(index)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FI
                      form={form}
                      name={`previousJobs.${index}.workplace`}
                      label="Nơi công tác *"
                    />
                    <FI
                      form={form}
                      name={`previousJobs.${index}.startedOn`}
                      label="Ngày bắt đầu *"
                      type="date"
                    />
                    <FI
                      form={form}
                      name={`previousJobs.${index}.endedOn`}
                      label="Ngày kết thúc *"
                      type="date"
                    />
                  </div>
                </div>
              ))}
              {jobFields.fields.length === 0 && (
                <p className="mt-3 text-xs text-slate-400 italic">Chưa có quá trình công tác.</p>
              )}
            </section>

            {/* ── THÔNG TIN ĐOÀN/ĐẢNG ── */}
            <section>
              <DynamicSectionHeader
                title="THÔNG TIN ĐOÀN/ĐẢNG"
                onAdd={() =>
                  partyFields.append({ organizationType: "", joinedOn: "", details: "" })
                }
              />
              {partyFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Thông tin #{index + 1}
                      {form.getValues(`partyMemberships.${index}.id`) ? (
                        <span className="ml-2 text-[10px] text-slate-400">(đã lưu)</span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-500">(mới)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => partyFields.remove(index)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="col-span-2">
                      <FI
                        form={form}
                        name={`partyMemberships.${index}.details`}
                        label="Chi tiết *"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {partyFields.fields.length === 0 && (
                <p className="mt-3 text-xs text-slate-400 italic">Chưa có thông tin Đoàn/Đảng.</p>
              )}
            </section>

            {/* ── THÔNG TIN BẰNG CẤP ── */}
            <section>
              <DynamicSectionHeader
                title="THÔNG TIN BẰNG CẤP"
                onAdd={() => degreeFields.append({ degreeName: "", school: "" })}
              />
              {degreeFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Bằng cấp #{index + 1}
                      {form.getValues(`degrees.${index}.id`) ? (
                        <span className="ml-2 text-[10px] text-slate-400">(đã lưu)</span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-500">(mới)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => degreeFields.remove(index)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FI form={form} name={`degrees.${index}.degreeName`} label="Tên bằng *" />
                    <FI form={form} name={`degrees.${index}.school`} label="Trường *" />
                  </div>
                </div>
              ))}
              {degreeFields.fields.length === 0 && (
                <p className="mt-3 text-xs text-slate-400 italic">Chưa có thông tin bằng cấp.</p>
              )}
            </section>

            {/* ── THÔNG TIN CHỨNG CHỈ ── */}
            <section>
              <DynamicSectionHeader
                title="THÔNG TIN CHỨNG CHỈ"
                onAdd={() => certFields.append({ certName: "", issuedBy: "" })}
              />
              {certFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Chứng chỉ #{index + 1}
                      {form.getValues(`certificates.${index}.id`) ? (
                        <span className="ml-2 text-[10px] text-slate-400">(đã lưu)</span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-500">(mới)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => certFields.remove(index)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FI
                      form={form}
                      name={`certificates.${index}.certName`}
                      label="Tên chứng chỉ *"
                    />
                    <FI form={form} name={`certificates.${index}.issuedBy`} label="Cơ quan cấp" />
                  </div>
                </div>
              ))}
              {certFields.fields.length === 0 && (
                <p className="mt-3 text-xs text-slate-400 italic">Chưa có thông tin chứng chỉ.</p>
              )}
            </section>

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

function DynamicSectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
        <button
          type="button"
          onClick={onAdd}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-500 transition hover:border-[#3B5CCC] hover:text-[#3B5CCC]"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
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
