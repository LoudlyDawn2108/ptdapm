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
  createSalaryGradeSchema,
} from "@hrms/shared";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateSalaryGrade,
  useUpdateSalaryGrade,
} from "./api";

export interface GradeRow {
  id: string;
  gradeCode: string;
  gradeName: string;
  status: string;
}

interface SalaryGradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: GradeRow | null;
}

export function SalaryGradeFormDialog({
  open,
  onOpenChange,
  editingItem,
}: SalaryGradeFormDialogProps) {
  const isUpdate = !!editingItem;
  const createMutation = useCreateSalaryGrade();
  const updateMutation = useUpdateSalaryGrade();

  const form = useForm({
    resolver: zodResolver(createSalaryGradeSchema),
    defaultValues: {
      gradeCode: "",
      gradeName: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editingItem) {
      form.reset({
        gradeCode: editingItem.gradeCode,
        gradeName: editingItem.gradeName,
      });
    } else {
      form.reset({
        gradeCode: "",
        gradeName: "",
      });
    }
  }, [open, editingItem, form]);

  const onSubmit = async (values: any) => {
    const sanitized: Record<string, any> = {
      gradeCode: values.gradeCode,
      gradeName: values.gradeName,
    };
    if (values.status) sanitized.status = values.status;

    try {
      if (isUpdate) {
        await updateMutation.mutateAsync({
          id: editingItem!.id,
          ...sanitized,
        } as any);
        toast.success("Cập nhật ngạch lương thành công");
      } else {
        await createMutation.mutateAsync(sanitized as any);
        toast.success("Thêm ngạch lương thành công");
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
                Cập nhật ngạch lương
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Thêm ngạch lương
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="gradeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mã ngạch lương <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: A1"
                      disabled={isUpdate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên ngạch lương <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: Giảng viên cao cấp"
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
                {isPending ? "Đang lưu..." : "Lưu ngạch lương"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
