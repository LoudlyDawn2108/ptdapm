import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  trainingCourseListOptions,
  trainingTypeDropdownOptions,
  useCreateTrainingCourse,
  useUpdateTrainingCourse,
} from "@/features/training-courses/api";
import {
  buildTrainingCourseColumns,
  type TrainingCourseRowWithType,
} from "@/features/training-courses/columns";
import { useListPage } from "@/hooks/use-list-page";
import { applyFieldErrors } from "@/lib/error-handler";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { formatForInput } from "@/lib/date-utils";
import { authorizeRoute } from "@/lib/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTrainingCourseSchema,
  type CreateTrainingCourseInput,
  TrainingStatus,
  type TrainingStatusCode,
  enumToSortedList,
  type UpdateTrainingCourseInput,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Pencil, Save } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { type UseFormSetError, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  status: z
    .enum(["open_registration", "in_progress", "completed"])
    .optional(),
});

export const Route = createFileRoute("/_authenticated/training/")({
  beforeLoad: authorizeRoute("/training"),
  validateSearch: searchSchema,
  component: TrainingCoursesPage,
});

function TrainingCoursesPage() {
  const navigate = useNavigate({ from: "/training/" });
  const search = Route.useSearch();
  const listPage = useListPage({
    search,
    onNavigate: (update) =>
      navigate({ search: (prev) => ({ ...prev, ...update }) }),
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] =
    useState<TrainingCourseRowWithType | null>(null);

  const { data: coursesData, isLoading } = useQuery(
    trainingCourseListOptions({
      page: search.page,
      pageSize: search.pageSize,
      search: listPage.debouncedSearch,
      status: search.status,
    }),
  );

  const { data: trainingTypes } = useQuery(trainingTypeDropdownOptions);

  const typeMap = useMemo(
    () =>
      new Map((trainingTypes ?? []).map((t) => [t.value, t.label])),
    [trainingTypes],
  );

  const result = (coursesData as any)?.data;
  const items: TrainingCourseRowWithType[] = result?.items ?? [];
  const pageCount = result?.totalPages ?? 0;

  const createMutation = useCreateTrainingCourse();
  const updateMutation = useUpdateTrainingCourse();

  const columns = useMemo(
    () => [
      ...buildTrainingCourseColumns(
        typeMap,
        listPage.pagination.pageIndex,
        listPage.pagination.pageSize,
      ),
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: TrainingCourseRowWithType } }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setEditingCourse(row.original);
            }}
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
        ),
        size: 50,
      },
    ],
    [typeMap, listPage.pagination.pageIndex, listPage.pagination.pageSize],
  );

  const handleCreate = async (
    input: CreateTrainingCourseInput,
    setError: UseFormSetError<CreateTrainingCourseInput>,
  ) => {
    try {
      await createMutation.mutateAsync(input);
      toast.success("Thêm khóa đào tạo thành công");
      setShowCreateDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdate = async (
    courseId: string,
    input: UpdateTrainingCourseInput,
    setError: UseFormSetError<UpdateTrainingCourseInput>,
  ) => {
    try {
      let payload: UpdateTrainingCourseInput;
      
      if (editingCourse?.status === "in_progress") {
        // Khi đang đào tạo: chỉ gửi các trường được phép chỉnh sửa
        payload = {
          location: input.location,
          cost: input.cost,
          commitment: input.commitment,
          certificateName: input.certificateName,
          certificateType: input.certificateType,
        };
      } else if ((editingCourse?.registrationCount ?? 0) > 0) {
        // Khi đã có đăng ký: không gửi courseTypeId
        const { courseTypeId, ...rest } = input;
        payload = rest;
      } else {
        payload = input;
      }

      await updateMutation.mutateAsync({ courseId, ...payload });
      toast.success("Cập nhật khóa đào tạo thành công");
      setEditingCourse(null);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const trainingStatusOptions = enumToSortedList(TrainingStatus);

  return (
    <div>
      <PageHeader
        title="Khóa đào tạo"
        description="Quản lý danh sách khóa đào tạo"
        actions={
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm khóa đào tạo
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm kiếm theo tên khóa đào tạo..."
          className="max-w-sm"
          value={listPage.searchText}
          onChange={(e) => listPage.setSearchText(e.target.value)}
        />
        <Select
          value={search.status ?? "all"}
          onValueChange={(val) =>
            navigate({
              search: (prev) => ({
                ...prev,
                page: 1,
                status:
                  val === "all"
                    ? undefined
                    : (val as TrainingStatusCode),
              }),
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {trainingStatusOptions.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        pageCount={pageCount}
        pagination={listPage.pagination}
        onPaginationChange={listPage.onPaginationChange}
        isLoading={isLoading}
        emptyMessage="Không có khóa đào tạo nào"
        onRowClick={(row) =>
          navigate({ to: "/training/$courseId", params: { courseId: row.id } })
        }
      />

      <TrainingCourseFormDialog
        mode="create"
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        trainingTypes={trainingTypes ?? []}
        isSubmitting={createMutation.isPending}
        onSubmit={(input, setError) =>
          handleCreate(
            input as CreateTrainingCourseInput,
            setError as UseFormSetError<CreateTrainingCourseInput>,
          )
        }
      />

      <TrainingCourseFormDialog
        mode="edit"
        open={!!editingCourse}
        onOpenChange={(open) => {
          if (!open) setEditingCourse(null);
        }}
        course={editingCourse}
        trainingTypes={trainingTypes ?? []}
        isSubmitting={updateMutation.isPending}
        onSubmit={(input, setError) =>
          handleUpdate(
            editingCourse!.id,
            input as UpdateTrainingCourseInput,
            setError as UseFormSetError<UpdateTrainingCourseInput>,
          )
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form Dialog
// ---------------------------------------------------------------------------

type FormValues = z.input<typeof createTrainingCourseSchema>;

interface TrainingCourseFormDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: TrainingCourseRowWithType | null;
  trainingTypes: Array<{ value: string; label: string }>;
  isSubmitting: boolean;
  onSubmit: (
    input: FormValues,
    setError: UseFormSetError<FormValues>,
  ) => Promise<void>;
}

function TrainingCourseFormDialog({
  mode,
  open,
  onOpenChange,
  course,
  trainingTypes,
  isSubmitting,
  onSubmit,
}: TrainingCourseFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(createTrainingCourseSchema),
    defaultValues: {
      courseName: "",
      courseTypeId: "",
      trainingFrom: "",
      trainingTo: "",
      location: undefined,
      cost: undefined,
      commitment: undefined,
      certificateName: undefined,
      certificateType: undefined,
      registrationFrom: undefined,
      registrationTo: undefined,
      registrationLimit: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && course) {
      form.reset({
        courseName: course.courseName,
        courseTypeId: course.courseTypeId,
        trainingFrom: formatForInput(course.trainingFrom) || "",
        trainingTo: formatForInput(course.trainingTo) || "",
        location: course.location ?? undefined,
        cost: course.cost ?? undefined,
        commitment: course.commitment ?? undefined,
        certificateName: course.certificateName ?? undefined,
        certificateType: course.certificateType ?? undefined,
        registrationFrom: course.registrationFrom
          ? formatForInput(course.registrationFrom)
          : undefined,
        registrationTo: course.registrationTo
          ? formatForInput(course.registrationTo)
          : undefined,
        registrationLimit: course.registrationLimit ?? undefined,
      });
    } else {
      form.reset({
        courseName: "",
        courseTypeId: "",
        trainingFrom: "",
        trainingTo: "",
        location: undefined,
        cost: undefined,
        commitment: undefined,
        certificateName: undefined,
        certificateType: undefined,
        registrationFrom: undefined,
        registrationTo: undefined,
        registrationLimit: undefined,
      });
    }
  }, [open, mode, course, form]);

  const title =
    mode === "create" ? "Thêm khóa đào tạo" : "Chỉnh sửa khóa đào tạo";
  const submitLabel =
    mode === "create" ? "Lưu khóa đào tạo" : "Lưu thay đổi";
  const isInProgressEdit = mode === "edit" && course?.status === "in_progress";
  const registrationCount = course?.registrationCount ?? 0;
  const hasRegistrations = mode === "edit" && registrationCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 shrink-0">
              {mode === "create" ? (
                <Plus className="h-5 w-5 text-blue-600" />
              ) : (
                <Pencil className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              // Convert empty strings to undefined for optional fields
              const cleaned = {
                ...values,
                location: values.location || undefined,
                cost: values.cost || undefined,
                commitment: values.commitment || undefined,
                certificateName: values.certificateName || undefined,
                certificateType: values.certificateType || undefined,
                registrationFrom: values.registrationFrom || undefined,
                registrationTo: values.registrationTo || undefined,
              };

              return onSubmit(cleaned, form.setError);
            })}
            className="px-6 py-4 space-y-5"
          >
            {isInProgressEdit && (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Khóa đào tạo đang diễn ra: chỉ được chỉnh sửa địa điểm, kinh phí, cam kết và thông tin chứng chỉ.
              </div>
            )}

            {hasRegistrations && !isInProgressEdit && (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Khóa đào tạo đã có dữ liệu đăng ký: không thể thay đổi loại khóa đào tạo.
              </div>
            )}

            {/* Tên + Loại khóa đào tạo */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên khóa đào tạo{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tên khóa đào tạo"
                        disabled={isInProgressEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại khóa đào tạo{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isInProgressEdit || hasRegistrations}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainingTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thời gian đào tạo */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trainingFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Thời gian đào tạo từ ngày{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isInProgressEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainingTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Đến ngày{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isInProgressEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Địa điểm + Kinh phí */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Nhập địa điểm đào tạo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh phí</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="VD: 3500000 hoặc 3500000.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cam kết sau đào tạo */}
            <FormField
              control={form.control}
              name="commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cam kết sau đào tạo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Nhập nội dung cam kết (nếu có)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chứng chỉ */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="certificateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chứng chỉ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Tên chứng chỉ"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificateType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại chứng chỉ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Loại chứng chỉ"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thời gian đăng ký */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mở đăng ký từ ngày</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isInProgressEdit}
                        onChange={(e) =>
                          field.onChange(e.target.value || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đến ngày</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isInProgressEdit}
                        onChange={(e) =>
                          field.onChange(e.target.value || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Số lượng đăng ký tối đa */}
            <FormField
              control={form.control}
              name="registrationLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng đăng ký tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Để trống nếu không giới hạn"
                      value={field.value ?? ""}
                      disabled={isInProgressEdit}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
                {isSubmitting ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1.5" />
                    {submitLabel}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
