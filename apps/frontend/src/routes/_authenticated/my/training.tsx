import { PageHeader } from "@/components/layout/page-header";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type MyTrainingRow,
  myTrainingListOptions,
  useRegisterForCourse,
  useCancelRegistration,
} from "@/features/my-training/api";
import {
  trainingCourseListOptions,
  trainingCourseDetailOptions,
} from "@/features/training-courses/api";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { formatDate } from "@/lib/date-utils";
import {
  TrainingStatus,
  ParticipationStatus,
  type ParticipationStatusCode,
  type TrainingStatusCode,
  enumToSortedList,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, UserPlus, UserMinus, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Route definition
// ---------------------------------------------------------------------------

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  tab: z.enum(["available", "registered"]).default("available"),
  participationStatus: z
    .enum(["registered", "learning", "completed", "failed"])
    .optional(),
});

export const Route = createFileRoute("/_authenticated/my/training")({
  validateSearch: searchSchema,
  component: MyTrainingPage,
});

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

function MyTrainingPage() {
  const navigate = useNavigate({ from: "/my/training" });
  const search = Route.useSearch();

  // Course detail dialog state
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<{
    registrationId: string;
    participationStatus: string;
  } | null>(null);

  const activeTab = search.tab;

  const tabs = [
    { key: "available" as const, label: "Khóa đào tạo đang mở" },
    { key: "registered" as const, label: "Khóa đào tạo đã đăng ký" },
  ];

  return (
    <div>
      <PageHeader
        title="Khóa đào tạo"
        description="Xem danh sách khóa đào tạo và đăng ký tham gia"
      />

      {/* Pill Tabs */}
      <div className="mb-6 flex rounded-full bg-muted p-1 max-w-md">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() =>
              navigate({
                search: { page: 1, pageSize: search.pageSize, tab: tab.key },
              })
            }
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
      {activeTab === "available" && (
        <AvailableCoursesTab
          search={search}
          onPageChange={(page) =>
            navigate({ search: (prev) => ({ ...prev, page }) })
          }
          onViewCourse={(courseId) => {
            setSelectedRegistration(null);
            setSelectedCourseId(courseId);
          }}
        />
      )}
      {activeTab === "registered" && (
        <RegisteredCoursesTab
          search={search}
          onPageChange={(page) =>
            navigate({ search: (prev) => ({ ...prev, page }) })
          }
          onFilterChange={(participationStatus) =>
            navigate({
              search: (prev) => ({ ...prev, page: 1, participationStatus }),
            })
          }
          onViewCourse={(courseId, reg) => {
            setSelectedRegistration(reg);
            setSelectedCourseId(courseId);
          }}
        />
      )}

      {/* Course Detail Dialog */}
      <CourseDetailDialog
        courseId={selectedCourseId}
        registration={selectedRegistration}
        onClose={() => {
          setSelectedCourseId(null);
          setSelectedRegistration(null);
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 1: Available courses (open_registration)
// ---------------------------------------------------------------------------

function AvailableCoursesTab({
  search,
  onPageChange,
  onViewCourse,
}: {
  search: { page: number; pageSize: number };
  onPageChange: (page: number) => void;
  onViewCourse: (courseId: string) => void;
}) {
  const { data: coursesData, isLoading } = useQuery(
    trainingCourseListOptions({
      page: search.page,
      pageSize: search.pageSize,
      status: "open_registration" as TrainingStatusCode,
    }),
  );

  const result = (coursesData as any)?.data;
  const items = (result?.items ?? []) as Array<{
    id: string;
    courseName: string;
    courseTypeId: string;
    trainingFrom: string;
    trainingTo: string;
    location: string | null;
    status: TrainingStatusCode;
  }>;
  const pageCount = result?.totalPages ?? 0;
  const total = result?.total ?? 0;

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div>
      <div className="mb-3 text-sm text-muted-foreground">
        Tổng: {total} khóa đào tạo đang mở đăng ký
      </div>

      <div className="rounded-xl border bg-card">
        {items.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                  <th className="rounded-tl-xl px-4 py-3 text-left font-medium w-14">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Tên khóa đào tạo
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Thời gian đào tạo
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Địa điểm
                  </th>
                  <th className="rounded-tr-xl px-4 py-3 text-left font-medium">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((course, index) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onViewCourse(course.id)}
                  >
                    <td className="px-4 py-3 text-center">
                      {(search.page - 1) * search.pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {course.courseName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(course.trainingFrom)} –{" "}
                      {formatDate(course.trainingTo)}
                    </td>
                    <td className="px-4 py-3">{course.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadgeFromCode
                        code={course.status}
                        label={
                          TrainingStatus[
                            course.status as keyof typeof TrainingStatus
                          ]?.label ?? course.status
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Không có khóa đào tạo đang mở đăng ký.
          </p>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Trang {search.page} / {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={search.page <= 1}
              onClick={() => onPageChange(search.page - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={search.page >= pageCount}
              onClick={() => onPageChange(search.page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2: Registered courses (my registrations)
// ---------------------------------------------------------------------------

function RegisteredCoursesTab({
  search,
  onPageChange,
  onFilterChange,
  onViewCourse,
}: {
  search: {
    page: number;
    pageSize: number;
    participationStatus?: ParticipationStatusCode;
  };
  onPageChange: (page: number) => void;
  onFilterChange: (status: ParticipationStatusCode | undefined) => void;
  onViewCourse: (
    courseId: string,
    reg: { registrationId: string; participationStatus: string },
  ) => void;
}) {
  const { data: myTrainingData, isLoading } = useQuery(
    myTrainingListOptions({
      page: search.page,
      pageSize: search.pageSize,
      participationStatus: search.participationStatus,
    }),
  );

  const result = (myTrainingData as any)?.data;
  const items: MyTrainingRow[] = result?.items ?? [];
  const pageCount = result?.totalPages ?? 0;
  const total = result?.total ?? 0;

  const participationStatusOptions = enumToSortedList(ParticipationStatus);

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-4 flex items-center gap-3">
        <Select
          value={search.participationStatus ?? "all"}
          onValueChange={(val) =>
            onFilterChange(
              val === "all" ? undefined : (val as ParticipationStatusCode),
            )
          }
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {participationStatusOptions.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Tổng: {total} khóa đào tạo
        </span>
      </div>

      <div className="rounded-xl border bg-card">
        {items.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                  <th className="rounded-tl-xl px-4 py-3 text-left font-medium w-14">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Tên khóa đào tạo
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Loại hình
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Thời gian đào tạo
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Địa điểm
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Trạng thái tham gia
                  </th>
                  <th className="rounded-tr-xl px-4 py-3 text-left font-medium">
                    Ngày đăng ký
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, index) => (
                  <tr
                    key={row.registrationId}
                    className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      onViewCourse(row.courseId, {
                        registrationId: row.registrationId,
                        participationStatus: row.participationStatus,
                      })
                    }
                  >
                    <td className="px-4 py-3 text-center">
                      {(search.page - 1) * search.pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {row.courseName}
                    </td>
                    <td className="px-4 py-3">
                      {row.courseTypeName ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(row.trainingFrom)} –{" "}
                      {formatDate(row.trainingTo)}
                    </td>
                    <td className="px-4 py-3">{row.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <ParticipationBadge
                        status={
                          row.participationStatus as ParticipationStatusCode
                        }
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(row.registeredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Bạn chưa đăng ký khóa đào tạo nào.
          </p>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Trang {search.page} / {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={search.page <= 1}
              onClick={() => onPageChange(search.page - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={search.page >= pageCount}
              onClick={() => onPageChange(search.page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Participation Badge
// ---------------------------------------------------------------------------

function ParticipationBadge({ status }: { status: ParticipationStatusCode }) {
  const entry =
    ParticipationStatus[status as keyof typeof ParticipationStatus];
  const label = entry?.label ?? status;

  const config = (() => {
    if (status === "registered")
      return {
        dot: "bg-blue-500",
        text: "text-blue-700",
        bg: "bg-blue-50",
      };
    if (status === "learning")
      return {
        dot: "bg-amber-500",
        text: "text-amber-700",
        bg: "bg-amber-50",
      };
    if (status === "completed")
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
      };
    if (status === "failed")
      return {
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
      };
    return {
      dot: "bg-slate-400",
      text: "text-slate-600",
      bg: "bg-slate-50",
    };
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.text} ${config.bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Course Detail Dialog (UC 4.40 — register / cancel)
// ---------------------------------------------------------------------------

function CourseDetailDialog({
  courseId,
  registration,
  onClose,
}: {
  courseId: string | null;
  registration: {
    registrationId: string;
    participationStatus: string;
  } | null;
  onClose: () => void;
}) {
  const { data: course, isLoading } = useQuery({
    ...trainingCourseDetailOptions(courseId ?? ""),
    enabled: !!courseId,
  });

  const registerMutation = useRegisterForCourse();
  const cancelMutation = useCancelRegistration();

  const isOpen = !!courseId;

  // Determine if user is already registered for this course
  const isRegistered = !!registration;
  const canCancel =
    isRegistered && registration.participationStatus === "registered";

  // Check if course is open for registration
  const isOpenForRegistration = course?.status === "open_registration";

  // Check registration period
  const isWithinRegistrationPeriod = useMemo(() => {
    if (!course) return false;
    if (!course.registrationFrom && !course.registrationTo) return true;
    const today = new Date().toISOString().slice(0, 10);
    if (course.registrationFrom && today < course.registrationFrom)
      return false;
    if (course.registrationTo && today > course.registrationTo) return false;
    return true;
  }, [course]);

  const handleRegister = async () => {
    if (!courseId) return;
    try {
      await registerMutation.mutateAsync({ courseId });
      toast.success("Đăng ký khóa đào tạo thành công");
      onClose();
    } catch {
      // Error already handled in handleApiError
    }
  };

  const handleCancel = async () => {
    if (!courseId || !registration) return;
    try {
      await cancelMutation.mutateAsync({
        courseId,
        registrationId: registration.registrationId,
      });
      toast.success("Hủy đăng ký thành công");
      onClose();
    } catch {
      // Error already handled in handleApiError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 shrink-0">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                Thông tin khóa đào tạo
              </DialogTitle>
              <DialogDescription className="text-sm">
                Xem chi tiết và đăng ký tham gia
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="px-6 py-8">
            <TableSkeleton rows={4} />
          </div>
        ) : course ? (
          <div className="px-6 py-5 space-y-5">
            {/* Course info */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <ReadOnlyField
                label="Tên khóa đào tạo"
                value={course.courseName}
              />
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

            <ReadOnlyField
              label="Cam kết sau đào tạo"
              value={course.commitment}
            />

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <ReadOnlyField
                label="Tên chứng chỉ"
                value={course.certificateName}
              />
              <ReadOnlyField
                label="Loại chứng chỉ"
                value={course.certificateType}
              />
            </div>

            {/* Registration info */}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold mb-3">
                Thông tin đăng ký
              </h4>
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
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4">
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

            {/* Status messages */}
            {!isOpenForRegistration && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                Khóa đào tạo không trong trạng thái mở đăng ký.
              </div>
            )}
            {isOpenForRegistration && !isWithinRegistrationPeriod && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                Khóa đào tạo đã hết thời gian đăng ký.
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-muted-foreground">
            Không tìm thấy khóa đào tạo.
          </div>
        )}

        {/* Footer actions */}
        {course && (
          <DialogFooter className="px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>

            {isRegistered && canCancel && isOpenForRegistration && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="gap-1.5"
              >
                <UserMinus className="h-4 w-4" />
                {cancelMutation.isPending ? "Đang hủy..." : "Hủy đăng ký"}
              </Button>
            )}

            {!isRegistered &&
              isOpenForRegistration &&
              isWithinRegistrationPeriod && (
                <Button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  {registerMutation.isPending
                    ? "Đang đăng ký..."
                    : "Đăng ký tham gia"}
                </Button>
              )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
