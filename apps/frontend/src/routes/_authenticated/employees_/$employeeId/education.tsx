import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField, SectionTitle } from "@/components/shared/read-only-field";
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
import { useAuth } from "@/features/auth/hooks";
import {
  getFileUrl,
  uploadFile,
  useCreateDegree,
  useDeleteDegree,
  useEmployeeDetail,
  useUpdateDegree,
} from "@/features/employees/api";
import type { Degree } from "@/features/employees/types";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcademicRank, type CreateEmployeeDegreeInput, EducationLevel } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Save, Trash, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type UseFormSetError, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const degreeFormSchema = z.object({
  degreeName: z.string().min(1, "Tên bằng không được để trống"),
  school: z.string().min(1, "Trường/Nơi cấp không được để trống"),
  degreeFileId: z.string().uuid().optional(),
});

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/education")({
  component: EducationTab,
});

function EducationTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, employee: emp, isLoading } = useEmployeeDetail(employeeId);
  const degrees = aggregate?.degrees as Degree[] | undefined;

  const { user } = useAuth();
  const canEdit =
    user && (user.role === "TCCB" || user.role === "ADMIN") && emp?.workStatus !== "terminated";

  const createDegree = useCreateDegree();
  const updateDegree = useUpdateDegree();
  const deleteDegree = useDeleteDegree();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDegree, setEditingDegree] = useState<Degree | null>(null);

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const eduLabel =
    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ?? emp.educationLevel;
  const rankLabel =
    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ?? emp.academicRank;

  const handleCreate = async (
    input: CreateEmployeeDegreeInput,
    setError: UseFormSetError<CreateEmployeeDegreeInput>,
  ) => {
    try {
      await createDegree.mutateAsync({ employeeId, ...input });
      toast.success("Thêm bằng cấp thành công");
      setShowCreateDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdate = async (
    id: string,
    input: CreateEmployeeDegreeInput,
    setError: UseFormSetError<CreateEmployeeDegreeInput>,
  ) => {
    try {
      await updateDegree.mutateAsync({ employeeId, id, ...input });
      toast.success("Cập nhật bằng cấp thành công");
      setEditingDegree(null);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDegree.mutateAsync({ employeeId, id });
      toast.success("Xóa bằng cấp thành công");
    } catch {
      toast.error("Xóa bằng cấp thất bại");
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {/* ── Top row: Trình độ văn hóa + Học hàm/Học vị ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Trình độ văn hóa" value={eduLabel} />
        <ReadOnlyField label="Học hàm/Học vị" value={rankLabel} />
      </div>

      {/* ── Bằng cấp ── */}
      <div className="flex items-center justify-between">
        <SectionTitle title="Thông tin bằng cấp" />
        {canEdit && (
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Thêm bằng cấp
          </Button>
        )}
      </div>

      {degrees && degrees.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-3 text-left font-medium">Tên bằng</th>
                <th className="px-4 py-3 text-left font-medium">Nơi cấp</th>
                <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {degrees.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{d.degreeName}</td>
                  <td className="px-4 py-3">{d.school}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        disabled={!d.degreeFileId}
                        onClick={() =>
                          d.degreeFileId && window.open(getFileUrl(d.degreeFileId), "_blank")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            onClick={() => setEditingDegree(d)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <ConfirmDialog
                            trigger={
                              <button
                                type="button"
                                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            }
                            title="Xóa bằng cấp"
                            description={`Bạn có chắc chắn muốn xóa bằng "${d.degreeName}"?`}
                            confirmLabel="Xóa"
                            variant="destructive"
                            onConfirm={() => handleDelete(d.id)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có bằng cấp.</p>
      )}

      <DegreeFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Thêm bằng cấp"
        submitLabel="Lưu bằng cấp"
        isSubmitting={createDegree.isPending}
        onSubmit={handleCreate}
      />
      <DegreeFormDialog
        open={!!editingDegree}
        onOpenChange={(open) => {
          if (!open) setEditingDegree(null);
        }}
        title="Chỉnh sửa bằng cấp"
        submitLabel="Lưu bằng cấp"
        degree={editingDegree}
        isSubmitting={updateDegree.isPending}
        onSubmit={async (input, setError) => {
          if (editingDegree) await handleUpdate(editingDegree.id, input, setError);
        }}
      />
    </div>
  );
}

function DegreeFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  degree,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  degree?: Degree | null;
  isSubmitting: boolean;
  onSubmit: (
    input: CreateEmployeeDegreeInput,
    setError: UseFormSetError<CreateEmployeeDegreeInput>,
  ) => Promise<void>;
}) {
  const isEditing = !!degree;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CreateEmployeeDegreeInput>({
    resolver: zodResolver(degreeFormSchema),
    defaultValues: {
      degreeName: "",
      school: "",
      degreeFileId: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      degreeName: degree?.degreeName ?? "",
      school: degree?.school ?? "",
      degreeFileId: degree?.degreeFileId ?? undefined,
    });
  }, [degree, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  <Plus className="h-4 w-4" />
                </span>
              )}
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">Nhập thông tin bằng cấp.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form.setError))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="degreeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên bằng <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên bằng cấp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Trường/Nơi cấp <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập trường/nơi cấp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                {isUploading
                  ? "Đang tải..."
                  : form.watch("degreeFileId")
                    ? "Đã tải PDF"
                    : "Tải PDF"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    const uploaded = await uploadFile(file);
                    form.setValue("degreeFileId", uploaded.id, { shouldDirty: true });
                    toast.success("Tải PDF bằng cấp thành công");
                  } catch {
                    toast.error("Tải PDF thất bại");
                  } finally {
                    setIsUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isSubmitting ? "Đang lưu..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
