import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEmployeeSchema } from "@hrms/shared";
import type { UpdateEmployeeInput } from "@hrms/shared";
import {
  employeeDetailOptions,
  useUpdateEmployee,
} from "@/features/employees/api";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
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
  fetchOrgUnitDropdown,
  fetchSalaryGradeDropdown,
} from "@/lib/api/config-dropdowns";
import {
  Gender,
  WorkStatus,
  ContractStatus,
  EducationLevel,
  TrainingLevel,
  AcademicTitle,
  AcademicRank,
  enumToSortedList,
} from "@hrms/shared";
import { applyFieldErrors } from "@/lib/error-handler";
import { Pencil, Save, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/employees/$employeeId/edit",
)({
  component: EditEmployeePage,
});

function EditEmployeePage() {
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateEmployee();
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  const form = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  useEffect(() => {
    if (!emp) return;
    form.reset({
      fullName: emp.fullName ?? "",
      dob: typeof emp.dob === "string" ? emp.dob.split("T")[0] : "",
      gender: emp.gender as any,
      nationalId: emp.nationalId ?? "",
      hometown: emp.hometown ?? "",
      address: emp.address ?? "",
      taxCode: emp.taxCode ?? "",
      socialInsuranceNo: emp.socialInsuranceNo ?? "",
      healthInsuranceNo: emp.healthInsuranceNo ?? "",
      email: emp.email ?? "",
      phone: emp.phone ?? "",
      isForeigner: emp.isForeigner ?? false,
      educationLevel: emp.educationLevel as any,
      trainingLevel: emp.trainingLevel as any,
      academicTitle: emp.academicTitle as any,
      academicRank: emp.academicRank as any,
      workStatus: emp.workStatus as any,
      contractStatus: emp.contractStatus as any,
      currentOrgUnitId: emp.currentOrgUnitId ?? "",
      currentPositionTitle: emp.currentPositionTitle ?? "",
      salaryGradeStepId: emp.salaryGradeStepId ?? "",
      portraitFileId: emp.portraitFileId ?? "",
    });
  }, [emp, form]);

  const onSubmit = async (data: UpdateEmployeeInput) => {
    try {
      await updateMutation.mutateAsync({ id: employeeId, ...data } as any);
      toast.success("Cập nhật hồ sơ thành công");
      navigate({
        to: "/employees/$employeeId",
        params: { employeeId },
      });
    } catch (error: any) {
      if (error?.type === "field" && error?.fields) {
        applyFieldErrors(form, error.fields);
      } else {
        toast.error(error?.error || "Có lỗi xảy ra");
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <FormSkeleton fields={8} />
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="text-slate-600">Không tìm thấy thông tin nhân sự.</div>
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
            {/* THÔNG TIN CÁ NHÂN */}
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

            {/* NGƯỜI NƯỚC NGOÀI */}
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

            {/* TRÌNH ĐỘ HỌC VẤN */}
            <section>
              <SectionHeader title="TRÌNH ĐỘ HỌC VẤN" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <FormFieldSelect form={form} name="educationLevel" label="Trình độ văn hóa *" items={enumToSortedList(EducationLevel)} />
                <FormFieldSelect form={form} name="trainingLevel" label="Trình độ đào tạo *" items={enumToSortedList(TrainingLevel)} />
                <FormFieldSelect form={form} name="academicTitle" label="Chức danh nghề nghiệp *" items={enumToSortedList(AcademicTitle)} />
                <FormFieldSelect form={form} name="academicRank" label="Chức danh khoa học *" items={enumToSortedList(AcademicRank)} />
              </div>
            </section>

            {/* ĐƠN VỊ & TRẠNG THÁI */}
            <section>
              <SectionHeader title="ĐƠN VỊ & TRẠNG THÁI" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentOrgUnitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">Đơn vị công tác</FormLabel>
                      <FormControl>
                        <Combobox
                          queryKey={["org-units", "dropdown", "edit-form"]}
                          fetchOptions={fetchOrgUnitDropdown}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Chọn đơn vị..."
                          className="w-full h-9 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FI form={form} name="currentPositionTitle" label="Chức vụ" />
                <FormFieldSelect form={form} name="workStatus" label="Trạng thái làm việc *" items={enumToSortedList(WorkStatus)} />
                <FormFieldSelect form={form} name="contractStatus" label="Trạng thái hợp đồng *" items={enumToSortedList(ContractStatus)} />
              </div>
            </section>

            {/* LƯƠNG */}
            <section>
              <SectionHeader title="LƯƠNG" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salaryGradeStepId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">Bậc lương *</FormLabel>
                      <FormControl>
                        <Combobox
                          queryKey={["salary-grades", "dropdown", "edit"]}
                          fetchOptions={fetchSalaryGradeDropdown}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Chọn bậc lương..."
                          className="w-full h-9 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* FOOTER */}
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
                disabled={updateMutation.isPending}
                className="h-9 rounded-md bg-[#3B5CCC] px-4 text-white hover:bg-[#2F4FB8]"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

/* ── Reusable form field helpers ── */

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
