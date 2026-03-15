import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateEmployee } from "@/features/employees/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Gender,
  EducationLevel,
  AcademicRank,
  enumToSortedList,
} from "@hrms/shared";
import { applyFieldErrors } from "@/lib/error-handler";
import { Plus, Minus, Upload, UserPlus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/employees/new")({
  component: NewEmployeePage,
});

// ── Form schema ──
const formSchema = z.object({
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
  visaNumber: z.string().optional(),
  visaExpiry: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  workPermitNumber: z.string().optional(),
  workPermitExpiry: z.string().optional(),
  educationLevel: z.string().optional(),
  academicRank: z.string().optional(),
  // Sections with dynamic arrays
  familyMembers: z
    .array(
      z.object({
        fullName: z.string().min(1, "Bắt buộc"),
        relation: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  previousJobs: z
    .array(
      z.object({
        workplace: z.string().min(1, "Bắt buộc"),
        startedOn: z.string().min(1, "Bắt buộc"),
        endedOn: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  bankAccounts: z
    .array(
      z.object({
        accountNo: z.string().min(1, "Bắt buộc"),
        bankName: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  partyMemberships: z
    .array(
      z.object({
        joinedOn: z.string().min(1, "Bắt buộc"),
        details: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  degrees: z
    .array(
      z.object({
        degreeName: z.string().min(1, "Bắt buộc"),
        institution: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
  certificates: z
    .array(
      z.object({
        certificateName: z.string().min(1, "Bắt buộc"),
        issuedBy: z.string().min(1, "Bắt buộc"),
      }),
    )
    .default([]),
});

type FormValues = z.infer<typeof formSchema>;

function NewEmployeePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();
  const [showForeigner, setShowForeigner] = useState(false);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
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
      isForeigner: false,
      visaNumber: "",
      visaExpiry: "",
      passportNumber: "",
      passportExpiry: "",
      workPermitNumber: "",
      workPermitExpiry: "",
      educationLevel: "",
      academicRank: "",
      familyMembers: [],
      previousJobs: [],
      bankAccounts: [],
      partyMemberships: [],
      degrees: [],
      certificates: [],
    },
  });

  const familyFields = useFieldArray({ control: form.control, name: "familyMembers" });
  const jobFields = useFieldArray({ control: form.control, name: "previousJobs" });
  const bankFields = useFieldArray({ control: form.control, name: "bankAccounts" });
  const partyFields = useFieldArray({ control: form.control, name: "partyMemberships" });
  const degreeFields = useFieldArray({ control: form.control, name: "degrees" });
  const certFields = useFieldArray({ control: form.control, name: "certificates" });

  const onSubmit = async (data: FormValues) => {
    try {
      await createMutation.mutateAsync(data as any);
      toast.success("Thêm nhân sự thành công");
      navigate({ to: "/employees" });
    } catch (error: any) {
      if (error?.type === "field" && error?.fields) {
        applyFieldErrors(form, error.fields);
      } else {
        toast.error(error?.error || "Có lỗi xảy ra");
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E9EEFF] text-[#3B5CCC]">
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setPortraitPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <FI form={form} name="fullName" label="Họ tên *" />
                  <FormFieldSelect form={form} name="gender" label="Giới tính *" items={enumToSortedList(Gender)} />
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
                  <FI form={form} name="visaNumber" label="Số Visa *" />
                  <FI form={form} name="visaExpiry" label="Ngày hết hạn Visa *" type="date" />
                  <FI form={form} name="passportNumber" label="Số Hộ chiếu *" />
                  <FI form={form} name="passportExpiry" label="Ngày hết hạn Hộ chiếu *" type="date" />
                  <FI form={form} name="workPermitNumber" label="Số giấy phép lao động *" />
                  <FI form={form} name="workPermitExpiry" label="Ngày hết hạn giấy phép lao động *" type="date" />
                </div>
              )}
            </section>

            {/* ═══════ THÔNG TIN GIA ĐÌNH ═══════ */}
            <DynamicSection
              title="THÔNG TIN GIA ĐÌNH"
              onAdd={() => familyFields.append({ fullName: "", relation: "" })}
            >
              {familyFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                  <FI form={form} name={`familyMembers.${index}.fullName`} label="Họ tên *" />
                  <FI form={form} name={`familyMembers.${index}.relation`} label="Mối quan hệ *" />
                  <RemoveBtn onClick={() => familyFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ QUÁ TRÌNH CÔNG TÁC ═══════ */}
            <DynamicSection
              title="QUÁ TRÌNH CÔNG TÁC"
              onAdd={() => jobFields.append({ workplace: "", startedOn: "", endedOn: "" })}
            >
              {jobFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_140px_140px_auto] items-end gap-3">
                  <FI form={form} name={`previousJobs.${index}.workplace`} label="Tên nơi công tác *" />
                  <FI form={form} name={`previousJobs.${index}.startedOn`} label="Từ ngày *" type="date" />
                  <FI form={form} name={`previousJobs.${index}.endedOn`} label="Đến ngày *" type="date" />
                  <RemoveBtn onClick={() => jobFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ THÔNG TIN NGÂN HÀNG ═══════ */}
            <DynamicSection
              title="THÔNG TIN NGÂN HÀNG"
              onAdd={() => bankFields.append({ accountNo: "", bankName: "" })}
            >
              {bankFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                  <FI form={form} name={`bankAccounts.${index}.accountNo`} label="Số tài khoản *" />
                  <FI form={form} name={`bankAccounts.${index}.bankName`} label="Tên ngân hàng *" />
                  <RemoveBtn onClick={() => bankFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ THÔNG TIN ĐOÀN/ĐẢNG ═══════ */}
            <DynamicSection
              title="THÔNG TIN ĐOÀN/ĐẢNG"
              onAdd={() => partyFields.append({ joinedOn: "", details: "" })}
            >
              {partyFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[180px_1fr_auto] items-end gap-3">
                  <FI form={form} name={`partyMemberships.${index}.joinedOn`} label="Ngày vào Đoàn/Đảng *" type="date" />
                  <FI form={form} name={`partyMemberships.${index}.details`} label="Thông tin chi tiết *" />
                  <RemoveBtn onClick={() => partyFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ TRÌNH ĐỘ HỌC VẤN ═══════ */}
            <section>
              <SectionHeader title="TRÌNH ĐỘ HỌC VẤN" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <FormFieldSelect form={form} name="educationLevel" label="Trình độ văn hóa *" items={enumToSortedList(EducationLevel)} />
                <FormFieldSelect form={form} name="academicRank" label="Học hàm/Học vị *" items={enumToSortedList(AcademicRank)} />
              </div>
            </section>

            {/* ═══════ THÔNG TIN BẰNG CẤP ═══════ */}
            <DynamicSection
              title="THÔNG TIN BẰNG CẤP"
              onAdd={() => degreeFields.append({ degreeName: "", institution: "" })}
            >
              {degreeFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3">
                  <FI form={form} name={`degrees.${index}.degreeName`} label="Tên bằng *" />
                  <FI form={form} name={`degrees.${index}.institution`} label="Nơi cấp *" />
                  <Button type="button" className="h-8 rounded-md bg-[#3B5CCC] px-3 text-xs text-white hover:bg-[#2F4FB8]">
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    Tải PDF
                  </Button>
                  <RemoveBtn onClick={() => degreeFields.remove(index)} />
                </div>
              ))}
            </DynamicSection>

            {/* ═══════ THÔNG TIN CHỨNG CHỈ ═══════ */}
            <DynamicSection
              title="THÔNG TIN CHỨNG CHỈ"
              onAdd={() => certFields.append({ certificateName: "", issuedBy: "" })}
            >
              {certFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3">
                  <FI form={form} name={`certificates.${index}.certificateName`} label="Tên chứng chỉ *" />
                  <FI form={form} name={`certificates.${index}.issuedBy`} label="Nơi cấp *" />
                  <Button type="button" className="h-8 rounded-md bg-[#3B5CCC] px-3 text-xs text-white hover:bg-[#2F4FB8]">
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    Tải PDF
                  </Button>
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
                disabled={createMutation.isPending}
                className="h-9 rounded-md bg-[#3B5CCC] px-4 text-white hover:bg-[#2F4FB8]"
              >
                {createMutation.isPending ? "Đang lưu..." : "Lưu hồ sơ nhân sự"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Reusable helpers
   ══════════════════════════════════════════ */

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
/** Form Input shorthand */
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
      render={({ field }: any) => (
        <FormItem>
          <FormLabel><RequiredLabel label={label} /></FormLabel>
          <FormControl>
            <Input type={type} {...field} value={field.value ?? ""} className="h-9 rounded-md" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Form Select shorthand */
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
      render={({ field }: any) => (
        <FormItem>
          <FormLabel><RequiredLabel label={label} /></FormLabel>
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

/** Section with title and add button */
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

/** Remove row button */
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




