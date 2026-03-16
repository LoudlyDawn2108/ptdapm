import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import { Plus, Pencil } from "lucide-react";
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
      ...buildTrainingCourseColumns(typeMap),
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: TrainingCourseRowWithType } }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingCourse(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [typeMap],
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
      await updateMutation.mutateAsync({ courseId, ...input });
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

type FormValues = CreateTrainingCourseInput;

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
        trainingFrom: course.trainingFrom ?? "",
        trainingTo: course.trainingTo ?? "",
        location: (course.location as string | undefined) ?? undefined,
        cost: undefined,
        commitment: undefined,
        certificateName: undefined,
        certificateType: undefined,
        registrationFrom: undefined,
        registrationTo: undefined,
        registrationLimit:
          course.registrationLimit ?? undefined,
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
  const description =
    mode === "create"
      ? "Nhập thông tin để tạo khóa đào tạo mới."
      : "Cập nhật thông tin khóa đào tạo.";
  const submitLabel =
    mode === "create" ? "Thêm khóa đào tạo" : "Lưu thay đổi";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              onSubmit(values, form.setError),
            )}
            className="space-y-5"
          >
            {/* ── Thông tin cơ bản ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cơ bản
              </h3>

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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại khóa đào tạo" />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trainingFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày bắt đầu{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
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
                        Ngày kết thúc{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            </div>

            <Separator />

            {/* ── Chi phí & Cam kết ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Chi phí &amp; Cam kết
              </h3>

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi phí</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="VD: 5000000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commitment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cam kết</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Nhập nội dung cam kết (nếu có)"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* ── Chứng chỉ ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Chứng chỉ
              </h3>

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
            </div>

            <Separator />

            {/* ── Đăng ký ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin đăng ký
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registrationFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày mở đăng ký</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
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
                      <FormLabel>Ngày đóng đăng ký</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="registrationLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới hạn đăng ký</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Số lượng tối đa (để trống nếu không giới hạn)"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : Number(val),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
