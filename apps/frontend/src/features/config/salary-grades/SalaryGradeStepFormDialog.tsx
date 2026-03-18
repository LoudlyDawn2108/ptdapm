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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateSalaryGrade,
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

export interface GradeOption {
  id: string;
  gradeCode: string;
  gradeName: string;
}

interface SalaryGradeStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected grade ID (when clicking "+" on an accordion) */
  gradeId?: string;
  /** Pre-selected grade name */
  gradeName?: string;
  editingStep?: StepRow | null;
  /** Available grades for autocomplete suggestions */
  grades?: GradeOption[];
}

export function SalaryGradeStepFormDialog({
  open,
  onOpenChange,
  gradeId: initialGradeId,
  gradeName: initialGradeName,
  editingStep,
  grades = [],
}: SalaryGradeStepFormDialogProps) {
  const isUpdate = !!editingStep;
  const createStepMutation = useCreateSalaryGradeStep();
  const updateStepMutation = useUpdateSalaryGradeStep();
  const createGradeMutation = useCreateSalaryGrade();

  // Free-text input state for grade name
  const [gradeInput, setGradeInput] = useState(initialGradeName ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gradeError, setGradeError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      // Find grade name for the editing step
      const g = grades.find((gr) => gr.id === editingStep.gradeId);
      setGradeInput(g?.gradeName ?? initialGradeName ?? "");
    } else {
      form.reset({ stepNo: 1, coefficient: "" });
      setGradeInput(initialGradeName ?? "");
    }
    setGradeError("");
  }, [open, editingStep, initialGradeName, form, grades]);

  // Filter suggestions based on input
  const filteredGrades = gradeInput.trim()
    ? grades.filter((g) =>
        g.gradeName.toLowerCase().includes(gradeInput.trim().toLowerCase()),
      )
    : grades;

  // Check if input exactly matches an existing grade
  const exactMatch = grades.find(
    (g) => g.gradeName.toLowerCase() === gradeInput.trim().toLowerCase(),
  );

  const onSubmit = async (values: CreateSalaryGradeStepInput & { status?: string }) => {
    const trimmedName = gradeInput.trim();
    if (!trimmedName) {
      setGradeError("Vui lòng nhập tên ngạch viên chức");
      return;
    }

    try {
      let targetGradeId: string;

      if (isUpdate) {
        // When updating, use the original gradeId
        targetGradeId = editingStep!.gradeId;
      } else if (exactMatch) {
        // Name matches an existing grade → use its ID
        targetGradeId = exactMatch.id;
      } else {
        // New grade name → create a new grade first
        // Generate a code from the name (uppercase, no spaces, max 50 chars)
        const autoCode = trimmedName
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[^A-Z0-9_]/g, "")
          .substring(0, 50);

        const gradeResult = await createGradeMutation.mutateAsync({
          gradeCode: autoCode,
          gradeName: trimmedName,
        });
        targetGradeId = (gradeResult as any).data?.id ?? (gradeResult as any).id;
        toast.success(`Đã tạo ngạch "${trimmedName}"`);
      }

      if (isUpdate) {
        await updateStepMutation.mutateAsync({
          gradeId: targetGradeId,
          stepId: editingStep!.id,
          stepNo: values.stepNo,
          coefficient: values.coefficient,
          ...(values.status ? { status: values.status as "active" | "inactive" } : {}),
        });
        toast.success("Cập nhật hệ số lương thành công");
      } else {
        await createStepMutation.mutateAsync({
          gradeId: targetGradeId,
          ...values,
        });
        toast.success("Thêm hệ số lương thành công");
      }
      onOpenChange(false);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  };

  const isPending =
    createStepMutation.isPending ||
    updateStepMutation.isPending ||
    createGradeMutation.isPending;

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
            {/* Mã hệ số lương (auto-generated, readonly) */}
            <div>
              <label className="text-sm font-medium">
                Mã hệ số lương <span className="text-destructive">*</span>
              </label>
              <Input
                value={
                  (() => {
                    const match = grades.find(
                      (g) => g.gradeName.toLowerCase() === gradeInput.trim().toLowerCase(),
                    );
                    const code = match?.gradeCode ?? gradeInput.trim().toUpperCase().replace(/\s+/g, "").substring(0, 10);
                    const step = form.watch("stepNo") ?? 1;
                    return code ? `HSL${code}${String(step).padStart(2, "0")}` : "";
                  })()
                }
                disabled
                className="mt-1.5"
              />
            </div>

            {/* Ngạch viên chức — free-text input with suggestions */}
            <div className="relative">
              <label className="text-sm font-medium">
                Ngạch viên chức <span className="text-destructive">*</span>
              </label>
              <Input
                ref={inputRef}
                value={gradeInput}
                onChange={(e) => {
                  setGradeInput(e.target.value);
                  setGradeError("");
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="Nhập tên ngạch, VD: Trưởng Khoa"
                className="mt-1.5"
                disabled={isUpdate}
              />
              {gradeError && (
                <p className="mt-1 text-sm text-destructive">{gradeError}</p>
              )}
              {!isUpdate && gradeInput.trim() && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {exactMatch ? (
                    <span className="text-green-600">
                      ✓ Sẽ thêm bậc vào ngạch "{exactMatch.gradeName}"
                    </span>
                  ) : (
                    <span className="text-blue-600">
                      + Sẽ tạo ngạch mới "{gradeInput.trim()}"
                    </span>
                  )}
                </p>
              )}
              {showSuggestions && !isUpdate && filteredGrades.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-popover shadow-md">
                  {filteredGrades.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setGradeInput(g.gradeName);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="font-medium">{g.gradeName}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({g.gradeCode})
                      </span>
                    </button>
                  ))}
                </div>
              )}
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
