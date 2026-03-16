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
  type CreateSalaryGradeStepInput,
  createSalaryGradeStepSchema,
} from "@hrms/shared";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateSalaryGradeStep,
  useUpdateSalaryGradeStep,
} from "./api";

export interface StepRow {
  id: string;
  gradeId: string;
  stepNo: number;
  coefficient: string;
  status: string;
}

interface SalaryGradeStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeId: string;
  gradeName: string;
  editingStep?: StepRow | null;
}

export function SalaryGradeStepFormDialog({
  open,
  onOpenChange,
  gradeId,
  gradeName,
  editingStep,
}: SalaryGradeStepFormDialogProps) {
  const isUpdate = !!editingStep;
  const createMutation = useCreateSalaryGradeStep();
  const updateMutation = useUpdateSalaryGradeStep();

  const form = useForm<CreateSalaryGradeStepInput & { status?: string }>({
    resolver: zodResolver(createSalaryGradeStepSchema),
    defaultValues: {
      stepNo: 1,
      coefficient: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editingStep) {
      form.reset({
        stepNo: editingStep.stepNo,
        coefficient: editingStep.coefficient,
      });
    } else {
      form.reset({
        stepNo: 1,
        coefficient: "",
      });
    }
  }, [open, editingStep, form]);

  const onSubmit = async (values: CreateSalaryGradeStepInput & { status?: string }) => {
    try {
      if (isUpdate) {
        await updateMutation.mutateAsync({
          gradeId,
          stepId: editingStep!.id,
          ...values,
        });
        toast.success("Cập nhật hệ số lương thành công");
      } else {
        await createMutation.mutateAsync({ gradeId, ...values });
        toast.success("Thêm hệ số lương thành công");
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
                Cập nhật hệ số lương
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Thêm hệ số lương
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <span className="font-medium">Ngạch viên chức:</span> {gradeName}
            </div>

            <FormField
              control={form.control}
              name="stepNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bậc lương <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coefficient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Hệ số lương <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2.34" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUpdate && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trạng thái <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value ?? editingStep?.status ?? "active"}
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
                {isPending ? "Đang lưu..." : "Lưu hệ số lương"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
