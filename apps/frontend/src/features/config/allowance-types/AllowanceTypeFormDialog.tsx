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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CatalogStatus,
  type CreateAllowanceTypeInput,
  createAllowanceTypeSchema,
} from "@hrms/shared";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateAllowanceType,
  useUpdateAllowanceType,
} from "./api";
import type { AllowanceTypeRow } from "./columns";

interface AllowanceTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: AllowanceTypeRow | null;
}

export function AllowanceTypeFormDialog({
  open,
  onOpenChange,
  editingItem,
}: AllowanceTypeFormDialogProps) {
  const isUpdate = !!editingItem;
  const createMutation = useCreateAllowanceType();
  const updateMutation = useUpdateAllowanceType();

  const form = useForm({
    resolver: zodResolver(createAllowanceTypeSchema),
    defaultValues: {
      allowanceName: "",
      description: "",
      calcMethod: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editingItem) {
      form.reset({
        allowanceName: editingItem.allowanceName,
        description: editingItem.description ?? "",
        calcMethod: editingItem.calcMethod ?? "",
      });
    } else {
      form.reset({
        allowanceName: "",
        description: "",
        calcMethod: "",
      });
    }
  }, [open, editingItem, form]);

  const onSubmit = async (values: any) => {
    // Sanitize: strip empty optional fields (Zod .optional() rejects null)
    const sanitized: Record<string, any> = {
      allowanceName: values.allowanceName,
    };
    if (values.description) sanitized.description = values.description;
    if (values.calcMethod) sanitized.calcMethod = values.calcMethod;
    if (values.status) sanitized.status = values.status;
    try {
      if (isUpdate) {
        await updateMutation.mutateAsync({
          id: editingItem!.id,
          ...sanitized,
        });
        toast.success("Cập nhật danh mục phụ cấp thành công");
      } else {
        await createMutation.mutateAsync(sanitized as any);
        toast.success("Thêm danh mục phụ cấp thành công");
      }
      onOpenChange(false);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isUpdate ? (
              <>
                <Pencil className="h-5 w-5" />
                Cập nhật danh mục phụ cấp
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Thêm danh mục phụ cấp
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="allowanceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên loại phụ cấp <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phụ cấp chức vụ" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calcMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cách tính</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="baseSalary * coefficient"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Phụ cấp chức vụ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUpdate && (
              <FormField
                control={form.control}
                name={"status" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trạng thái <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value ?? editingItem?.status ?? "active"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(CatalogStatus).map(([code, meta]) => (
                          <SelectItem key={code} value={code}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending
                  ? "Đang lưu..."
                  : isUpdate
                    ? "Lưu danh mục phụ cấp"
                    : "Lưu danh mục phụ cấp"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
