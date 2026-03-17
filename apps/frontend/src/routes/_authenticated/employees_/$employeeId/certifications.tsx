import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { SectionTitle } from "@/components/shared/read-only-field";
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
  useCreateCertification,
  useDeleteCertification,
  useEmployeeDetail,
  useUpdateCertification,
} from "@/features/employees/api";
import type { Certification } from "@/features/employees/types";
import { formatDate } from "@/lib/date-utils";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateEmployeeCertificationInput } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Save, Trash, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type UseFormSetError, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const certFormSchema = z.object({
  certName: z.string().min(1, "Tên chứng chỉ không được để trống"),
  issuedBy: z.string().optional(),
  issuedOn: z.string().optional(),
  expiresOn: z.string().optional(),
  certFileId: z.string().uuid().optional(),
});

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/certifications")({
  component: CertificationsTab,
});

function CertificationsTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, employee: emp, isLoading } = useEmployeeDetail(employeeId);
  const certifications = (aggregate?.certifications ?? []) as Certification[];

  const { user } = useAuth();
  const canEdit =
    user && (user.role === "TCCB" || user.role === "ADMIN") && emp?.workStatus !== "terminated";

  const createCert = useCreateCertification();
  const updateCert = useUpdateCertification();
  const deleteCert = useDeleteCertification();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const handleCreate = async (
    input: CreateEmployeeCertificationInput,
    setError: UseFormSetError<CreateEmployeeCertificationInput>,
  ) => {
    try {
      await createCert.mutateAsync({ employeeId, ...input });
      toast.success("Thêm chứng chỉ thành công");
      setShowCreateDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdate = async (
    id: string,
    input: CreateEmployeeCertificationInput,
    setError: UseFormSetError<CreateEmployeeCertificationInput>,
  ) => {
    try {
      await updateCert.mutateAsync({ employeeId, id, ...input });
      toast.success("Cập nhật chứng chỉ thành công");
      setEditingCert(null);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCert.mutateAsync({ employeeId, id });
      toast.success("Xóa chứng chỉ thành công");
    } catch {
      toast.error("Xóa chứng chỉ thất bại");
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Thông tin chứng chỉ" />
        {canEdit && (
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Thêm chứng chỉ
          </Button>
        )}
      </div>

      {certifications.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-3 text-left font-medium">Tên chứng chỉ</th>
                <th className="px-4 py-3 text-left font-medium">Nơi cấp</th>
                <th className="px-4 py-3 text-left font-medium">Ngày cấp</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hết hạn</th>
                <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{c.certName}</td>
                  <td className="px-4 py-3">{c.issuedBy}</td>
                  <td className="px-4 py-3">{formatDate(c.issuedOn)}</td>
                  <td className="px-4 py-3">{formatDate(c.expiresOn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        disabled={!c.certFileId}
                        onClick={() =>
                          c.certFileId && window.open(getFileUrl(c.certFileId), "_blank")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            onClick={() => setEditingCert(c)}
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
                            title="Xóa chứng chỉ"
                            description={`Bạn có chắc chắn muốn xóa chứng chỉ "${c.certName}"?`}
                            confirmLabel="Xóa"
                            variant="destructive"
                            onConfirm={() => handleDelete(c.id)}
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
        <p className="text-sm text-muted-foreground">Chưa có chứng chỉ.</p>
      )}

      <CertificationFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Thêm chứng chỉ"
        submitLabel="Lưu chứng chỉ"
        isSubmitting={createCert.isPending}
        onSubmit={handleCreate}
      />
      <CertificationFormDialog
        open={!!editingCert}
        onOpenChange={(open) => {
          if (!open) setEditingCert(null);
        }}
        title="Chỉnh sửa chứng chỉ"
        submitLabel="Lưu chứng chỉ"
        certification={editingCert}
        isSubmitting={updateCert.isPending}
        onSubmit={async (input, setError) => {
          if (editingCert) await handleUpdate(editingCert.id, input, setError);
        }}
      />
    </div>
  );
}

function CertificationFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  certification,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  certification?: Certification | null;
  isSubmitting: boolean;
  onSubmit: (
    input: CreateEmployeeCertificationInput,
    setError: UseFormSetError<CreateEmployeeCertificationInput>,
  ) => Promise<void>;
}) {
  const isEditing = !!certification;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CreateEmployeeCertificationInput>({
    resolver: zodResolver(certFormSchema),
    defaultValues: {
      certName: "",
      issuedBy: undefined,
      issuedOn: undefined,
      expiresOn: undefined,
      certFileId: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      certName: certification?.certName ?? "",
      issuedBy: certification?.issuedBy ?? undefined,
      issuedOn: certification?.issuedOn ?? undefined,
      expiresOn: certification?.expiresOn ?? undefined,
      certFileId: certification?.certFileId ?? undefined,
    });
  }, [certification, form, open]);

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
          <DialogDescription className="sr-only">Nhập thông tin chứng chỉ.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form.setError))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="certName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên chứng chỉ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên chứng chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nơi cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập nơi cấp" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="issuedOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày cấp</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày hết hạn</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  : form.watch("certFileId")
                    ? "Đã tải PDF"
                    : "Tải PDF chứng chỉ"}
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
                    form.setValue("certFileId", uploaded.id, { shouldDirty: true });
                    toast.success("Tải PDF chứng chỉ thành công");
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
