import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFile } from "@/features/employees/api";
import { applyFieldErrors } from "@/lib/error-handler";
import {
  ResultStatus,
  createTrainingResultSchema,
  type CreateTrainingResultInput,
} from "@hrms/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateTrainingResult } from "./api";

interface TrainingResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  registration: {
    id: string;
    staffCode: string;
    fullName: string;
  } | null;
}

export function TrainingResultDialog({
  open,
  onOpenChange,
  courseId,
  registration,
}: TrainingResultDialogProps) {
  const createResult = useCreateTrainingResult(courseId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CreateTrainingResultInput>({
    resolver: zodResolver(createTrainingResultSchema),
    defaultValues: {
      registrationId: "",
      resultStatus: "completed",
      certificateFileId: undefined,
      note: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      registrationId: registration?.id ?? "",
      resultStatus: "completed",
      certificateFileId: undefined,
      note: undefined,
    });
    setFileName(null);
  }, [open, registration, form]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Chỉ chấp nhận file PDF");
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      form.setValue("certificateFileId", uploaded.id, {
        shouldValidate: true,
      });
      setFileName(uploaded.originalName);
    } catch {
      toast.error("Tải file chứng chỉ thất bại");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    values: CreateTrainingResultInput,
    setError: UseFormSetError<CreateTrainingResultInput>,
  ) => {
    try {
      await createResult.mutateAsync(values);
      toast.success("Ghi nhận kết quả thành công");
      onOpenChange(false);
    } catch (error) {
      applyFieldErrors(setError, error);
      // Show generic toast if it's not an already-handled API error
      if (
        !(error instanceof Error && error.name === "ApiResponseError") &&
        typeof error !== "string"
      ) {
        toast.error("Ghi nhận kết quả thất bại");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <DialogTitle>Ghi nhận kết quả</DialogTitle>
            </div>
            {registration && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Mã nhân sự: {registration.staffCode}
              </span>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              handleSubmit(values, form.setError),
            )}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Kết quả */}
              <FormField
                control={form.control}
                name="resultStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Kết quả <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn kết quả" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ResultStatus).map(([code, entry]) => (
                          <SelectItem key={code} value={code}>
                            {entry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File chứng chỉ */}
              <FormField
                control={form.control}
                name="certificateFileId"
                render={() => (
                  <FormItem>
                    <FormLabel>File chứng chỉ</FormLabel>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-1.5"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Đang tải..." : "Tải PDF"}
                      </Button>
                      {fileName && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {fileName}
                        </p>
                      )}
                    </div>
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
              <Button
                type="submit"
                disabled={createResult.isPending || isUploading}
                className="gap-1.5"
              >
                <ClipboardCheck className="h-4 w-4" />
                {createResult.isPending ? "Đang lưu..." : "Lưu kết quả"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
