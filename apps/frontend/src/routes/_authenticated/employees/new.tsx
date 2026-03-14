import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateEmployee } from "@/features/employees/api";
import { PageHeader } from "@/components/layout/page-header";
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
import { ArrowLeft, Plus, Minus, Upload } from "lucide-react";

import { Separator } from "@/components/ui/separator";
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
  familyMembers: z.array(z.object({
    fullName: z.string().min(1, "Bắt buộc"),
    relation: z.string().min(1, "Bắt buộc"),
  })).default([]),
  previousJobs: z.array(z.object({
    workplace: z.string().min(1, "Bắt buộc"),
    startedOn: z.string().min(1, "Bắt buộc"),
    endedOn: z.string().min(1, "Bắt buộc"),
  })).default([]),
  bankAccounts: z.array(z.object({
    accountNo: z.string().min(1, "Bắt buộc"),
    bankName: z.string().min(1, "Bắt buộc"),
  })).default([]),
  partyMemberships: z.array(z.object({
    joinedOn: z.string().min(1, "Bắt buộc"),
    details: z.string().min(1, "Bắt buộc"),
  })).default([]),
  degrees: z.array(z.object({
    degreeName: z.string().min(1, "Bắt buộc"),
    institution: z.string().min(1, "Bắt buộc"),
  })).default([]),
  certificates: z.array(z.object({
    certificateName: z.string().min(1, "Bắt buộc"),
    issuedBy: z.string().min(1, "Bắt buộc"),
  })).default([]),
});

type FormValues = z.infer<typeof formSchema>;

function NewEmployeePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();
  const [showForeigner, setShowForeigner] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", gender: "", dob: "", hometown: "",
      email: "", phone: "", address: "", nationalId: "",
      taxCode: "", socialInsuranceNo: "", healthInsuranceNo: "",
      isForeigner: false,
      visaNumber: "", visaExpiry: "", passportNumber: "", passportExpiry: "",
      workPermitNumber: "", workPermitExpiry: "",
      educationLevel: "", academicRank: "",
      familyMembers: [], previousJobs: [], bankAccounts: [],
      partyMemberships: [], degrees: [], certificates: [],
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
    <div>
      <PageHeader
        title="Thêm hồ sơ nhân sự"
        actions={
          <Button variant="outline" asChild>
            <Link to="/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">

          {/* ═══════ THÔNG TIN CÁ NHÂN ═══════ */}
          <section>
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">
              Thông tin cá nhân
            </h3>
            <div className="flex gap-6 mb-4">
              {/* Avatar placeholder */}
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Plus className="h-6 w-6 text-muted-foreground/50" />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <FI form={form} name="fullName" label="Họ tên *" />
                <FormFieldSelect form={form} name="gender" label="Giới tính *" items={enumToSortedList(Gender)} />
                <FI form={form} name="dob" label="Ngày sinh *" type="date" />
                <FI form={form} name="hometown" label="Quê quán *" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FI form={form} name="email" label="Email *" type="email" />
              <FI form={form} name="phone" label="Số điện thoại *" />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FI form={form} name="address" label="Địa chỉ *" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FI form={form} name="nationalId" label="CCCD *" />
              <FI form={form} name="taxCode" label="Mã số thuế *" />
              <FI form={form} name="socialInsuranceNo" label="Số bảo hiểm xã hội" />
              <FI form={form} name="healthInsuranceNo" label="Số bảo hiểm y tế" />
            </div>
          </section>

          <Separator />

          {/* ═══════ NGƯỜI NƯỚC NGOÀI ═══════ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Người nước ngoài
              </h3>
              <FormField
                control={form.control}
                name="isForeigner"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-1.5">
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
              <div className="grid grid-cols-2 gap-4">
                <FI form={form} name="visaNumber" label="Số Visa *" />
                <FI form={form} name="visaExpiry" label="Ngày hết hạn Visa *" type="date" />
                <FI form={form} name="passportNumber" label="Số Hộ chiếu *" />
                <FI form={form} name="passportExpiry" label="Ngày hết hạn Hộ chiếu *" type="date" />
                <FI form={form} name="workPermitNumber" label="Số giấy phép lao động *" />
                <FI form={form} name="workPermitExpiry" label="Ngày hết hạn giấy phép lao động *" type="date" />
              </div>
            )}
          </section>

          <Separator />

          {/* ═══════ THÔNG TIN GIA ĐÌNH ═══════ */}
          <DynamicSection
            title="Thông tin gia đình"
            onAdd={() => familyFields.append({ fullName: "", relation: "" })}
          >
            {familyFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <FI form={form} name={`familyMembers.${index}.fullName`} label="Họ tên *" />
                </div>
                <div className="flex-1">
                  <FI form={form} name={`familyMembers.${index}.relation`} label="Mối quan hệ *" />
                </div>
                <RemoveBtn onClick={() => familyFields.remove(index)} />
              </div>
            ))}
          </DynamicSection>

          <Separator />

          {/* ═══════ LỊCH SỬ CÔNG TÁC ═══════ */}
          <DynamicSection
            title="Lịch sử công tác"
            onAdd={() => jobFields.append({ workplace: "", startedOn: "", endedOn: "" })}
          >
            {jobFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <FI form={form} name={`previousJobs.${index}.workplace`} label="Tên nơi công tác *" />
                </div>
                <div className="w-36">
                  <FI form={form} name={`previousJobs.${index}.startedOn`} label="Từ ngày *" type="date" />
                </div>
                <div className="w-36">
                  <FI form={form} name={`previousJobs.${index}.endedOn`} label="Đến ngày *" type="date" />
                </div>
                <RemoveBtn onClick={() => jobFields.remove(index)} />
              </div>
            ))}
          </DynamicSection>

          <Separator />

          {/* ═══════ THÔNG TIN NGÂN HÀNG ═══════ */}
          <DynamicSection
            title="Thông tin ngân hàng"
            onAdd={() => bankFields.append({ accountNo: "", bankName: "" })}
          >
            {bankFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <FI form={form} name={`bankAccounts.${index}.accountNo`} label="Số tài khoản *" />
                </div>
                <div className="flex-1">
                  <FI form={form} name={`bankAccounts.${index}.bankName`} label="Tên ngân hàng *" />
                </div>
                <RemoveBtn onClick={() => bankFields.remove(index)} />
              </div>
            ))}
          </DynamicSection>

          <Separator />

          {/* ═══════ THÔNG TIN ĐOÀN/ĐẢNG ═══════ */}
          <DynamicSection
            title="Thông tin Đoàn/Đảng"
            onAdd={() => partyFields.append({ joinedOn: "", details: "" })}
          >
            {partyFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <div className="w-44">
                  <FI form={form} name={`partyMemberships.${index}.joinedOn`} label="Ngày vào Đảng/Đoàn *" type="date" />
                </div>
                <div className="flex-1">
                  <FI form={form} name={`partyMemberships.${index}.details`} label="Thông tin chi tiết *" />
                </div>
                <RemoveBtn onClick={() => partyFields.remove(index)} />
              </div>
            ))}
          </DynamicSection>

          <Separator />

          {/* ═══════ TRÌNH ĐỘ HỌC VẤN ═══════ */}
          <section>
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">
              Trình độ học vấn
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormFieldSelect form={form} name="educationLevel" label="Trình độ văn hóa *" items={enumToSortedList(EducationLevel)} />
              <FormFieldSelect form={form} name="academicRank" label="Học hàm/Học vị *" items={enumToSortedList(AcademicRank)} />
            </div>
          </section>

          <Separator />

          {/* ═══════ THÔNG TIN BẰNG CẤP ═══════ */}
          <DynamicSection
            title="Thông tin bằng cấp"
            onAdd={() => degreeFields.append({ degreeName: "", institution: "" })}
          >
            {degreeFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <FI form={form} name={`degrees.${index}.degreeName`} label="Tên bằng *" />
                </div>
                <div className="flex-1">
                  <FI form={form} name={`degrees.${index}.institution`} label="Nơi cấp *" />
                </div>
                <Button type="button" variant="outline" size="sm" className="shrink-0">
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Tải PDF
                </Button>
                <RemoveBtn onClick={() => degreeFields.remove(index)} />
              </div>
            ))}
          </DynamicSection>

          <Separator />

          {/* ═══════ THÔNG TIN CHỨNG CHỈ ═══════ */}
          <DynamicSection
            title="Thông tin chứng chỉ"
            onAdd={() => certFields.append({ certificateName: "", issuedBy: "" })}
          >
            {certFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <FI form={form} name={`certificates.${index}.certificateName`} label="Tên chứng chỉ *" />
                </div>
                <div className="flex-1">
                  <FI form={form} name={`certificates.${index}.issuedBy`} label="Nơi cấp *" />
                </div>
                <Button type="button" variant="outline" size="sm" className="shrink-0">
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Tải PDF
                </Button>
                <RemoveBtn onClick={() => certFields.remove(index)} />
              </div>
            ))}
          </DynamicSection>

          {/* ═══════ FOOTER ═══════ */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/employees" })}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={createMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {createMutation.isPending ? "Đang lưu..." : "Lưu hồ sơ lương"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ══════════════════════════════════════════
   Reusable helpers
   ══════════════════════════════════════════ */

/** Form Input shorthand */
function FI({ form, name, label, type = "text" }: { form: any; name: string; label: string; type?: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Form Select shorthand */
function FormFieldSelect({ form, name, label, items }: { form: any; name: string; label: string; items: { code: string; label: string }[] }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.code} value={item.code}>{item.label}</SelectItem>
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
function DynamicSection({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-600" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

/** Remove row button */
function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full bg-red-50 hover:bg-red-100 text-red-500" onClick={onClick}>
      <Minus className="h-4 w-4" />
    </Button>
  );
}
