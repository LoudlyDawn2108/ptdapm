import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/employees_/$employeeId/edit",
)({
  component: EditEmployeePage,
});

function EditEmployeePage() {
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateEmployee();
  const [activeTab, setActiveTab] = useState("general");

  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  const form = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  // Pre-fill form when data loads
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
        <PageHeader title="Chỉnh sửa hồ sơ" />
        <FormSkeleton fields={8} />
      </div>
    );
  }

  if (!emp) {
    return (
      <div>
        <PageHeader title="Không tìm thấy" />
        <p className="text-muted-foreground">
          Không tìm thấy thông tin nhân sự.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Chỉnh sửa: ${emp.fullName}`}
        description="Cập nhật thông tin hồ sơ nhân sự"
        actions={
          <Button variant="outline" asChild>
            <Link
              to="/employees/$employeeId"
              params={{ employeeId }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="education">
                Trình độ & Chức danh
              </TabsTrigger>
              <TabsTrigger value="salary">Lương</TabsTrigger>
            </TabsList>

            {/* ── Tab: Thông tin chung ── */}
            <TabsContent value="general" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Thông tin cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <EditFormFieldInput form={form} name="fullName" label="Họ tên *" />
                    <EditFormFieldInput form={form} name="dob" label="Ngày sinh *" type="date" />
                    <EditFormFieldSelect form={form} name="gender" label="Giới tính *" items={enumToSortedList(Gender)} />
                    <EditFormFieldInput form={form} name="nationalId" label="Số CCCD/CMND *" />
                    <EditFormFieldInput form={form} name="hometown" label="Quê quán *" />
                    <EditFormFieldInput form={form} name="address" label="Địa chỉ *" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Liên hệ & Bảo hiểm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <EditFormFieldInput form={form} name="email" label="Email *" type="email" />
                    <EditFormFieldInput form={form} name="phone" label="Số điện thoại *" />
                    <EditFormFieldInput form={form} name="taxCode" label="Mã số thuế" />
                    <EditFormFieldInput form={form} name="socialInsuranceNo" label="Số BHXH" />
                    <EditFormFieldInput form={form} name="healthInsuranceNo" label="Số BHYT" />
                    <FormField
                      control={form.control}
                      name="isForeigner"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">
                            Người nước ngoài
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Tab: Trình độ ── */}
            <TabsContent value="education" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Trình độ học vấn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <EditFormFieldSelect form={form} name="educationLevel" label="Trình độ văn hóa *" items={enumToSortedList(EducationLevel)} />
                    <EditFormFieldSelect form={form} name="trainingLevel" label="Trình độ đào tạo *" items={enumToSortedList(TrainingLevel)} />
                    <EditFormFieldSelect form={form} name="academicTitle" label="Chức danh nghề nghiệp *" items={enumToSortedList(AcademicTitle)} />
                    <EditFormFieldSelect form={form} name="academicRank" label="Chức danh khoa học *" items={enumToSortedList(AcademicRank)} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Đơn vị & Trạng thái
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentOrgUnitId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Đơn vị công tác</FormLabel>
                          <FormControl>
                            <Combobox
                              queryKey={[
                                "org-units",
                                "dropdown",
                                "edit-form",
                              ]}
                              fetchOptions={fetchOrgUnitDropdown}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              placeholder="Chọn đơn vị..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <EditFormFieldInput form={form} name="currentPositionTitle" label="Chức vụ" />
                    <EditFormFieldSelect form={form} name="workStatus" label="Trạng thái làm việc *" items={enumToSortedList(WorkStatus)} />
                    <EditFormFieldSelect form={form} name="contractStatus" label="Trạng thái hợp đồng *" items={enumToSortedList(ContractStatus)} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Tab: Lương ── */}
            <TabsContent value="salary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hệ số lương</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="salaryGradeStepId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bậc lương *</FormLabel>
                        <FormControl>
                          <Combobox
                            queryKey={["salary-grades", "dropdown", "edit"]}
                            fetchOptions={fetchSalaryGradeDropdown}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            placeholder="Chọn bậc lương..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* ── Submit ── */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate({
                  to: "/employees/$employeeId",
                  params: { employeeId },
                })
              }
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ── Reusable form field helpers ── */

function EditFormFieldInput({
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

function EditFormFieldSelect({
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
          <FormLabel>{label}</FormLabel>
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
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
