import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchOrgUnitDropdown } from "@/lib/api/config-dropdowns";
import { applyFieldErrors } from "@/lib/error-handler";
import { ApiResponseError } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrgEventReason, enumToSortedList } from "@hrms/shared";
import { RefreshCw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useDissolveOrgUnit, useMergeOrgUnit } from "./api";

const formSchema = z
  .object({
    eventType: z.enum(["DISSOLVE", "MERGE"], {
      error: "Vui lòng chọn loại sự kiện",
    }),
    effectiveOn: z
      .string({ error: "Ngày hiệu lực không được để trống" })
      .min(1, "Ngày hiệu lực không được để trống"),
    decisionNo: z.string().optional(),
    decisionOn: z.string().optional(),
    reason: z.string({ error: "Vui lòng chọn lý do" }).min(1, "Vui lòng chọn lý do"),
    note: z.string().optional(),
    // Dissolve-specific
    childAction: z.enum(["dissolve_all", "reassign"]).optional(),
    newParentId: z.string().optional(),
    // Merge-specific
    targetOrgUnitId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.eventType === "MERGE" && !data.targetOrgUnitId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Đơn vị nhận sáp nhập không được để trống",
        path: ["targetOrgUnitId"],
      });
    }
    if (data.eventType === "DISSOLVE" && !data.childAction) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn xử lý đơn vị con",
        path: ["childAction"],
      });
    }
    if (data.eventType === "DISSOLVE" && data.childAction === "reassign" && !data.newParentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn đơn vị tiếp nhận",
        path: ["newParentId"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgUnitId: string;
  orgUnitName: string;
  hasChildren: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function UpdateStatusDialog({
  open,
  onOpenChange,
  orgUnitId,
  orgUnitName,
  hasChildren,
}: UpdateStatusDialogProps) {
  const dissolveMutation = useDissolveOrgUnit();
  const mergeMutation = useMergeOrgUnit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "DISSOLVE",
      effectiveOn: "",
      decisionNo: "",
      decisionOn: "",
      reason: "",
      note: "",
      childAction: hasChildren ? "dissolve_all" : "dissolve_all",
      newParentId: "",
      targetOrgUnitId: "",
    },
  });

  const eventType = form.watch("eventType");
  const childAction = form.watch("childAction");

  useEffect(() => {
    if (!open) return;
    form.reset({
      eventType: "DISSOLVE",
      effectiveOn: "",
      decisionNo: "",
      decisionOn: "",
      reason: "",
      note: "",
      childAction: "dissolve_all",
      newParentId: "",
      targetOrgUnitId: "",
    });
    setSelectedFile(null);
  }, [open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (values.eventType === "DISSOLVE") {
        await dissolveMutation.mutateAsync({
          id: orgUnitId,
          effectiveOn: values.effectiveOn,
          decisionNo: values.decisionNo || null,
          decisionOn: values.decisionOn || null,
          reason: values.reason as any,
          note: values.note || null,
          childAction: values.childAction as "dissolve_all" | "reassign",
          newParentId: values.childAction === "reassign" ? values.newParentId || null : null,
        });
        toast.success("Giải thể đơn vị thành công");
      } else {
        await mergeMutation.mutateAsync({
          id: orgUnitId,
          effectiveOn: values.effectiveOn,
          decisionNo: values.decisionNo || null,
          decisionOn: values.decisionOn || null,
          reason: values.reason as any,
          note: values.note || null,
          targetOrgUnitId: values.targetOrgUnitId!,
        });
        toast.success("Sáp nhập đơn vị thành công");
      }
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiResponseError) {
        applyFieldErrors(form.setError, error);
      } else {
        const message = error instanceof Error ? error.message : "Có lỗi xảy ra";
        toast.error(message);
      }
    }
  };

  const isPending = dissolveMutation.isPending || mergeMutation.isPending;
  const sortedReasons = enumToSortedList(OrgEventReason);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ hỗ trợ file .pdf, .doc, .docx");
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Cập nhật trạng thái
          </DialogTitle>
          <DialogDescription>
            Cập nhật trạng thái cho đơn vị <strong>{orgUnitName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Loại sự kiện */}
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loại sự kiện <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="DISSOLVE" id="dissolve" />
                        <Label htmlFor="dissolve" className="cursor-pointer font-normal">
                          Giải thể
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="MERGE" id="merge" />
                        <Label htmlFor="merge" className="cursor-pointer font-normal">
                          Sáp nhập
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày hiệu lực */}
            <FormField
              control={form.control}
              name="effectiveOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ngày hiệu lực <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thông tin quyết định */}
            <div className="rounded-lg border p-4 space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Thông tin quyết định</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="decisionNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số quyết định</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: QĐ-001/2026" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="decisionOn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày quyết định</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File đính kèm */}
              <div className="space-y-2">
                <Label>File đính kèm quyết định</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn file
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "Chưa chọn file (.pdf, .doc, .docx)"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Xóa file
                  </Button>
                )}
              </div>
            </div>

            {/* Lý do */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lý do <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortedReasons.map((r) => (
                        <SelectItem key={r.code} value={r.code}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dissolve: Xử lý đơn vị con */}
            {eventType === "DISSOLVE" && hasChildren && (
              <FormField
                control={form.control}
                name="childAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Xử lý đơn vị con <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cách xử lý" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dissolve_all">Giải thể tất cả đơn vị con</SelectItem>
                        <SelectItem value="reassign">Chuyển sang đơn vị khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Dissolve + Reassign: Đơn vị tiếp nhận */}
            {eventType === "DISSOLVE" && childAction === "reassign" && (
              <FormField
                control={form.control}
                name="newParentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Đơn vị tiếp nhận <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        queryKey={["org-units", "reassign-target"]}
                        fetchOptions={fetchOrgUnitDropdown}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Chọn đơn vị tiếp nhận..."
                        emptyMessage="Không tìm thấy đơn vị."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Merge: Đơn vị nhận sáp nhập */}
            {eventType === "MERGE" && (
              <FormField
                control={form.control}
                name="targetOrgUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Đơn vị nhận sáp nhập <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        queryKey={["org-units", "merge-target"]}
                        fetchOptions={fetchOrgUnitDropdown}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Chọn đơn vị nhận sáp nhập..."
                        emptyMessage="Không tìm thấy đơn vị."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập ghi chú thêm (nếu có)..."
                      className="min-h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} variant="destructive">
                {isPending ? "Đang xử lý..." : "Xác nhận cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
