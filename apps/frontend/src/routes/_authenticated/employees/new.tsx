import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useCreateEmployee } from "@/features/employees/api";
import { EmployeeForm } from "@/features/employees/components/employee-form";
import { authorizeRoute } from "@/lib/permissions";
import type { CreateEmployeeInput } from "@hrms/shared";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employees/new")({
  beforeLoad: authorizeRoute("/employees/new"),
  component: NewEmployeePage,
});

function NewEmployeePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();

  const handleSubmit = async (values: CreateEmployeeInput) => {
    await createMutation.mutateAsync(values);
    toast.success("Thêm nhân sự thành công");
    navigate({ to: "/employees" });
  };

  return (
    <div>
      <PageHeader
        title="Thêm nhân sự mới"
        description="Nhập thông tin cán bộ / giảng viên / nhân viên"
        actions={
          <Button variant="outline" asChild>
            <Link to="/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      <EmployeeForm onSubmitAction={handleSubmit} isPending={createMutation.isPending} />
    </div>
  );
}
