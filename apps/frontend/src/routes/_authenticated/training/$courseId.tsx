import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  useChangeTrainingCourseStatus,
  useTrainingCourseDetail,
  type TrainingCourseDetail,
} from "@/features/training-courses/api";
import { TrainingResultDialog } from "@/features/training-courses/TrainingResultDialog";
import { formatDate } from "@/lib/date-utils";
import { authorizeRoute } from "@/lib/permissions";
import {
  ParticipationStatus,
  TrainingStatus,
  type ParticipationStatusCode,
  type TrainingStatusCode,
} from "@hrms/shared";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle, Pencil, Play, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/training/$courseId")({
  beforeLoad: authorizeRoute("/training"),
  component: TrainingCourseDetailPage,
});

function TrainingCourseDetailPage() {
  const { courseId } = Route.useParams();
  const { course, isLoading } = useTrainingCourseDetail(courseId);
  const [activeTab, setActiveTab] = useState<
    "general" | "registration" | "participants"
  >("general");

  if (isLoading) {
    return (
      <div>
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/training">Khóa đào tạo</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Đang tải...</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <FormSkeleton fields={8} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy khóa đào tạo.</p>
      </div>
    );
  }

  const tabs = [
    { key: "general" as const, label: "Thông tin chung" },
    { key: "registration" as const, label: "Thông tin đăng ký" },
    { key: "participants" as const, label: "Danh sách tham gia" },
  ];

  return (
    <div>
      {/* Header: Breadcrumb + Edit button */}
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/training">Khóa đào tạo</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {courseId.substring(0, 6).toUpperCase()} - {course.courseName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" size="sm" asChild>
          <Link to="/training" search={{ search: course.courseName }}>
            <Pencil className="mr-2 h-4 w-4" />
            Sửa khóa đào tạo
          </Link>
        </Button>
      </div>

      {/* Pill Tabs */}
      <div className="mb-6 flex rounded-full bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "general" && <GeneralInfoTab course={course} />}
      {activeTab === "registration" && <RegistrationInfoTab course={course} />}
      {activeTab === "participants" && <ParticipantsTab course={course} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Participation Badge with dot indicator
// ---------------------------------------------------------------------------

function ParticipationBadge({ status }: { status: ParticipationStatusCode }) {
  const entry = ParticipationStatus[status as keyof typeof ParticipationStatus];
  const label = entry?.label ?? status;

  const config = (() => {
    if (status === "registered")
      return { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50", displayLabel: "Chưa có kết quả" };
    if (status === "learning")
      return { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", displayLabel: label };
    if (status === "completed")
      return { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", displayLabel: label };
    if (status === "failed")
      return { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50", displayLabel: label };
    return { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-50", displayLabel: label };
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.text} ${config.bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.displayLabel}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tab 1: Thông tin chung
// ---------------------------------------------------------------------------

function GeneralInfoTab({ course }: { course: TrainingCourseDetail }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField label="Tên khóa đào tạo" value={course.courseName} />
        <ReadOnlyField
          label="Loại khóa đào tạo"
          value={course.courseType?.typeName}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField
          label="Thời gian đào tạo từ ngày"
          value={formatDate(course.trainingFrom)}
        />
        <ReadOnlyField
          label="Đến ngày"
          value={formatDate(course.trainingTo)}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField label="Địa điểm" value={course.location} />
        <ReadOnlyField label="Kinh phí" value={course.cost} />
      </div>

      <ReadOnlyField label="Cam kết sau đào tạo" value={course.commitment} />

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField label="Tên chứng chỉ" value={course.certificateName} />
        <ReadOnlyField label="Loại chứng chỉ" value={course.certificateType} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2: Thông tin đăng ký
// ---------------------------------------------------------------------------

function RegistrationInfoTab({ course }: { course: TrainingCourseDetail }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField
          label="Mở đăng ký từ ngày"
          value={formatDate(course.registrationFrom)}
        />
        <ReadOnlyField
          label="Đến ngày"
          value={formatDate(course.registrationTo)}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField
          label="Số lượng đăng ký tối đa"
          value={
            course.registrationLimit
              ? String(course.registrationLimit)
              : "Không giới hạn"
          }
        />
        <ReadOnlyField
          label="Số lượng đã đăng ký"
          value={String(course.registrationCount)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 3: Danh sách tham gia
// ---------------------------------------------------------------------------

function ParticipantsTab({ course }: { course: TrainingCourseDetail }) {
  const registrations = course.registrations;
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<{
    id: string;
    staffCode: string;
    fullName: string;
  } | null>(null);

  const openResultDialog = (reg: {
    id: string;
    staffCode: string;
    fullName: string;
  }) => {
    setSelectedRegistration(reg);
    setResultDialogOpen(true);
  };

  return (
    <div className="rounded-xl border bg-card">
      {registrations.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-tl-xl px-4 py-3 text-left font-medium">
                  Mã NS
                </th>
                <th className="px-4 py-3 text-left font-medium">Họ tên</th>
                <th className="px-4 py-3 text-left font-medium">
                  Đơn vị công tác
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Ngày đăng ký
                </th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="rounded-tr-xl px-4 py-3 text-left font-medium">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {reg.staffCode ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">{reg.fullName}</td>
                  <td className="px-4 py-3 text-sm">
                    {reg.orgUnitName ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(reg.registeredAt)}
                  </td>
                  <td className="px-4 py-3">
                    <ParticipationBadge status={reg.participationStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {reg.participationStatus === "registered" && (
                        <Button
                          size="sm"
                          className="h-7 rounded-md bg-primary px-3 text-xs text-primary-foreground"
                          onClick={() =>
                            openResultDialog({
                              id: reg.id,
                              staffCode: reg.staffCode,
                              fullName: reg.fullName,
                            })
                          }
                        >
                          Ghi nhận kết quả
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Ghi nhận đánh giá"
                        onClick={() =>
                          openResultDialog({
                            id: reg.id,
                            staffCode: reg.staffCode,
                            fullName: reg.fullName,
                          })
                        }
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Chưa có người tham gia nào.
        </p>
      )}

      <TrainingResultDialog
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
        courseId={course.id}
        registration={selectedRegistration}
      />
    </div>
  );
}
