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
  useCreateCertification,
  useCreateDegree,
  useDeleteCertification,
  useDeleteDegree,
  useEmployeeDetail,
  useUpdateCertification,
  useUpdateDegree,
} from "@/features/employees/api";
import type { Certification, Degree } from "@/features/employees/types";
import { formatDate } from "@/lib/date-utils";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicRank,
  type CreateEmployeeCertificationInput,
  type CreateEmployeeDegreeInput,
  EducationLevel,
} from "@hrms/shared";
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

const certFormSchema = z.object({
  certName: z.string().min(1, "Tên chứng chỉ không được để trống"),
  issuedBy: z.string().optional(),
  issuedOn: z.string().optional(),
  expiresOn: z.string().optional(),
  certFileId: z.string().uuid().optional(),
});

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/education")({
  component: EducationTab,
});

function EducationTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, employee: emp, isLoading } = useEmployeeDetail(employeeId);
  const degrees = aggregate?.degrees as Degree[] | undefined;
  const certifications = (aggregate?.certifications ?? []) as Certification[];

  const { user } = useAuth();
  const canEdit =
    user && (user.role === "TCCB" || user.role === "ADMIN") && emp?.workStatus !== "terminated";

  // Degree mutations
  const createDegree = useCreateDegree();
  const updateDegree = useUpdateDegree();
  const deleteDegree = useDeleteDegree();
  const [showCreateDegreeDialog, setShowCreateDegreeDialog] = useState(false);
  const [editingDegree, setEditingDegree] = useState<Degree | null>(null);

  // Certification mutations
  const createCert = useCreateCertification();
  const updateCert = useUpdateCertification();
  const deleteCert = useDeleteCertification();
  const [showCreateCertDialog, setShowCreateCertDialog] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  if (isLoading) return <FormSkeleton fields={4} />;
  if (!emp) return null;

  const eduLabel =
    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ?? emp.educationLevel;
  const rankLabel =
    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ?? emp.academicRank;

  const handleCreateDegree = async (
    input: CreateEmployeeDegreeInput,
    setError: UseFormSetError<CreateEmployeeDegreeInput>,
  ) => {
    try {
      await createDegree.mutateAsync({ employeeId, ...input });
      toast.success("Thêm bằng cấp thành công");
      setShowCreateDegreeDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdateDegree = async (
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

  const handleDeleteDegree = async (id: string) => {
    try {
      await deleteDegree.mutateAsync({ employeeId, id });
      toast.success("Xóa bằng cấp thành công");
    } catch {
      toast.error("Xóa bằng cấp thất bại");
    }
  };

  const handleCreateCert = async (
    input: CreateEmployeeCertificationInput,
    setError: UseFormSetError<CreateEmployeeCertificationInput>,
  ) => {
    try {
      await createCert.mutateAsync({ employeeId, ...input });
      toast.success("Thêm chứng chỉ thành công");
      setShowCreateCertDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdateCert = async (
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

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Trình độ văn hóa" value={eduLabel} />
        <ReadOnlyField label="Học hàm/Học vị" value={rankLabel} />
      </div>

      <SectionTitle title="Thông tin bằng cấp" />

      {degrees && degrees.length > 0 ? (
        <div className="space-y-3">
          {degrees.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] items-end"
            >
              <ReadOnlyField label="Tên bằng" value={d.degreeName} />
              <ReadOnlyField label="Nơi cấp" value={d.school} />
              <div className="flex items-center gap-2 pb-0.5">
                <Button
                  size="default"
                  variant="default"
                  disabled={!d.degreeFileId}
                  onClick={() =>
                    d.degreeFileId &&
                    window.open(getFileUrl(d.degreeFileId), "_blank", "noopener,noreferrer")
                  }
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Xem PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có bằng cấp.</p>
      )}

      <SectionTitle title="Thông tin chứng chỉ" />

      {certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] items-end"
            >
              <ReadOnlyField label="Tên chứng chỉ" value={c.certName} />
              <ReadOnlyField label="Nơi cấp" value={c.issuedBy} />
              <div className="flex items-center gap-2 pb-0.5">
                <Button
                  size="default"
                  variant="default"
                  disabled={!c.certFileId}
                  onClick={() =>
                    c.certFileId &&
                    window.open(getFileUrl(c.certFileId), "_blank", "noopener,noreferrer")
                  }
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Xem PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có chứng chỉ.</p>
      )}

      <DegreeFormDialog
        open={showCreateDegreeDialog}
        onOpenChange={setShowCreateDegreeDialog}
        title="Thêm bằng cấp"
        submitLabel="Lưu bằng cấp"
        isSubmitting={createDegree.isPending}
        onSubmit={handleCreateDegree}
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
          if (editingDegree) await handleUpdateDegree(editingDegree.id, input, setError);
        }}
      />

      <CertificationFormDialog
        open={showCreateCertDialog}
        onOpenChange={setShowCreateCertDialog}
        title="Thêm chứng chỉ"
        submitLabel="Lưu chứng chỉ"
        isSubmitting={createCert.isPending}
        onSubmit={handleCreateCert}
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
          if (editingCert) await handleUpdateCert(editingCert.id, input, setError);
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
