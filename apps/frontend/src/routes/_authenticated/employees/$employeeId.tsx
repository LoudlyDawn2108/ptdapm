import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { QueryError } from "@/components/shared/query-error";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeDetailOptions } from "@/features/employees/api";
import { formatDate } from "@/lib/date-utils";
import { authorizeRoute } from "@/lib/permissions";
import {
  AcademicRank,
  AcademicTitle,
  ContractStatus,
  EducationLevel,
  Gender,
  TrainingLevel,
  WorkStatus,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/employees/$employeeId")({
  beforeLoad: authorizeRoute("/employees"),
  component: EmployeeDetailPage,
});

function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

function EmployeeDetailPage() {
  const { employeeId } = Route.useParams();
  const { data, isLoading, isError, error, refetch } = useQuery(employeeDetailOptions(employeeId));
  const emp = data?.data;

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Thông tin nhân sự" />
        <FormSkeleton fields={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader title="Thông tin nhân sự" />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!emp) {
    return (
      <div>
        <PageHeader title="Không tìm thấy" />
        <p>Không tìm thấy thông tin nhân sự.</p>
      </div>
    );
  }

  const genderLabel = Gender[emp.gender as keyof typeof Gender]?.label ?? emp.gender;
  const workStatusLabel =
    WorkStatus[emp.workStatus as keyof typeof WorkStatus]?.label ?? emp.workStatus;
  const contractStatusLabel =
    ContractStatus[emp.contractStatus as keyof typeof ContractStatus]?.label ?? emp.contractStatus;
  const eduLabel =
    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ?? emp.educationLevel;
  const trainingLabel =
    TrainingLevel[emp.trainingLevel as keyof typeof TrainingLevel]?.label ?? emp.trainingLevel;
  const titleLabel =
    AcademicTitle[emp.academicTitle as keyof typeof AcademicTitle]?.label ?? emp.academicTitle;
  const rankLabel =
    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ?? emp.academicRank;

  return (
    <div>
      <PageHeader
        title={emp.fullName ?? "Nhân sự"}
        description={`Mã NV: ${emp.staffCode ?? "—"}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            <Button disabled title="Chức năng chỉnh sửa đang được phát triển">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoRow label="Họ tên" value={emp.fullName} />
              <InfoRow label="Ngày sinh" value={formatDate(emp.dob)} />
              <InfoRow label="Giới tính" value={genderLabel} />
              <InfoRow label="CCCD/CMND" value={emp.nationalId} />
              <InfoRow label="Quê quán" value={emp.hometown} />
              <InfoRow label="Địa chỉ" value={emp.address} />
              <InfoRow label="Email" value={emp.email} />
              <InfoRow label="Điện thoại" value={emp.phone} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin nghề nghiệp</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoRow label="Đơn vị công tác" value={emp.currentOrgUnitName} />
              <InfoRow label="Chức danh" value={emp.currentPositionTitle} />
              <div className="grid grid-cols-3 gap-2 py-2 border-b">
                <dt className="text-sm text-muted-foreground">Trạng thái</dt>
                <dd className="col-span-2">
                  <StatusBadgeFromCode code={emp.workStatus} label={workStatusLabel} />
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b">
                <dt className="text-sm text-muted-foreground">Hợp đồng</dt>
                <dd className="col-span-2">
                  <StatusBadgeFromCode code={emp.contractStatus} label={contractStatusLabel} />
                </dd>
              </div>
              <InfoRow label="Trình độ văn hóa" value={eduLabel} />
              <InfoRow label="Trình độ đào tạo" value={trainingLabel} />
              <InfoRow label="Chức danh nghề nghiệp" value={titleLabel} />
              <InfoRow label="Học hàm" value={rankLabel} />
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
