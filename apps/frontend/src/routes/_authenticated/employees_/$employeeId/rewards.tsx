import { FormSkeleton } from "@/components/shared/loading-skeleton";
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
  useCreateEvaluation,
  useEmployeeDetail,
  useUpdateEvaluation,
} from "@/features/employees/api";
import type { EmployeeEvaluation } from "@/features/employees/types";
import { formatDate, formatForInput } from "@/lib/date-utils";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateEvaluationInput,
  createEvaluationSchema,
} from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Award, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { type UseFormSetError, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/rewards")({
  component: RewardsTab,
});

function RewardsTab() {
  const { employeeId } = Route.useParams();
  const { aggregate, isLoading } = useEmployeeDetail(employeeId);
  const createEvaluation = useCreateEvaluation();
  const updateEvaluation = useUpdateEvaluation();

  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [editingReward, setEditingReward] = useState<EmployeeEvaluation | null>(null);
  const [showDisciplineDialog, setShowDisciplineDialog] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<EmployeeEvaluation | null>(null);

  if (isLoading) return <FormSkeleton fields={3} />;
  if (!aggregate) return null;

  const evaluations = (aggregate?.evaluations ?? []) as EmployeeEvaluation[];
  const rewards = evaluations.filter((e) => e.evalType === "REWARD");
  const disciplines = evaluations.filter((e) => e.evalType === "DISCIPLINE");
  const staffCode = aggregate.employee?.staffCode ?? "";

  const handleCreateReward = async (
    input: CreateEvaluationInput,
    setError: UseFormSetError<CreateEvaluationInput>,
  ) => {
    try {
      await createEvaluation.mutateAsync({ employeeId, ...input });
      toast.success("Thêm khen thưởng thành công");
      setShowRewardDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdateReward = async (
    id: string,
    input: CreateEvaluationInput,
    setError: UseFormSetError<CreateEvaluationInput>,
  ) => {
    try {
      await updateEvaluation.mutateAsync({ employeeId, id, ...input });
      toast.success("Cập nhật khen thưởng thành công");
      setEditingReward(null);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleCreateDiscipline = async (
    input: CreateEvaluationInput,
    setError: UseFormSetError<CreateEvaluationInput>,
  ) => {
    try {
      await createEvaluation.mutateAsync({ employeeId, ...input });
      toast.success("Thêm kỷ luật thành công");
      setShowDisciplineDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdateDiscipline = async (
    id: string,
    input: CreateEvaluationInput,
    setError: UseFormSetError<CreateEvaluationInput>,
  ) => {
    try {
      await updateEvaluation.mutateAsync({ employeeId, id, ...input });
      toast.success("Cập nhật kỷ luật thành công");
      setEditingDiscipline(null);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Khen thưởng Section ── */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Award className="h-4 w-4 text-yellow-500" />
            Khen thưởng
          </h3>
          <Button size="sm" className="gap-1.5" onClick={() => setShowRewardDialog(true)}>
            <Plus className="h-4 w-4" />
            Thêm khen thưởng
          </Button>
        </div>

        {rewards.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                  <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại khen thưởng</th>
                  <th className="px-4 py-3 text-left font-medium">Tên khen thưởng</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày quyết định</th>
                  <th className="px-4 py-3 text-left font-medium">Số quyết định</th>
                  <th className="px-4 py-3 text-left font-medium">Nội dung</th>
                  <th className="px-4 py-3 text-left font-medium">Số tiền thưởng</th>
                  <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r, i) => (
                  <tr key={r.id ?? i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">{r.rewardType ?? "—"}</td>
                    <td className="px-4 py-3">{r.rewardName ?? "—"}</td>
                    <td className="px-4 py-3">{formatDate(r.decisionOn)}</td>
                    <td className="px-4 py-3">{r.decisionNo ?? "—"}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">{r.content ?? "—"}</td>
                    <td className="px-4 py-3">
                      {r.rewardAmount ? Number(r.rewardAmount).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setEditingReward(r)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">Chưa có khen thưởng.</p>
        )}
      </div>

      {/* ── Kỷ luật Section ── */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Kỷ luật
          </h3>
          <Button size="sm" className="gap-1.5" onClick={() => setShowDisciplineDialog(true)}>
            <Plus className="h-4 w-4" />
            Thêm kỷ luật
          </Button>
        </div>

        {disciplines.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                  <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại kỷ luật</th>
                  <th className="px-4 py-3 text-left font-medium">Tên kỷ luật</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày quyết định</th>
                  <th className="px-4 py-3 text-left font-medium">Lý do</th>
                  <th className="px-4 py-3 text-left font-medium">Hình thức xử lý</th>
                  <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((d, i) => (
                  <tr key={d.id ?? i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">{d.disciplineType ?? "—"}</td>
                    <td className="px-4 py-3">{d.disciplineName ?? "—"}</td>
                    <td className="px-4 py-3">{formatDate(d.decisionOn)}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">{d.reason ?? "—"}</td>
                    <td className="px-4 py-3">{d.actionForm ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setEditingDiscipline(d)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">Chưa có kỷ luật.</p>
        )}
      </div>

      {/* ── Reward Dialogs ── */}
      <RewardFormDialog
        open={showRewardDialog}
        onOpenChange={setShowRewardDialog}
        staffCode={staffCode}
        isSubmitting={createEvaluation.isPending}
        onSubmit={handleCreateReward}
      />
      <RewardFormDialog
        open={!!editingReward}
        onOpenChange={(open) => {
          if (!open) setEditingReward(null);
        }}
        evaluation={editingReward}
        staffCode={staffCode}
        isSubmitting={updateEvaluation.isPending}
        onSubmit={(input, setError) => handleUpdateReward(editingReward!.id, input, setError)}
      />

      {/* ── Discipline Dialogs ── */}
      <DisciplineFormDialog
        open={showDisciplineDialog}
        onOpenChange={setShowDisciplineDialog}
        staffCode={staffCode}
        isSubmitting={createEvaluation.isPending}
        onSubmit={handleCreateDiscipline}
      />
      <DisciplineFormDialog
        open={!!editingDiscipline}
        onOpenChange={(open) => {
          if (!open) setEditingDiscipline(null);
        }}
        evaluation={editingDiscipline}
        staffCode={staffCode}
        isSubmitting={updateEvaluation.isPending}
        onSubmit={(input, setError) =>
          handleUpdateDiscipline(editingDiscipline!.id, input, setError)
        }
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Reward Form Dialog
// ──────────────────────────────────────────────────────────────────────

function RewardFormDialog({
  open,
  onOpenChange,
  evaluation,
  staffCode,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation?: EmployeeEvaluation | null;
  staffCode?: string;
  isSubmitting: boolean;
  onSubmit: (
    input: CreateEvaluationInput,
    setError: UseFormSetError<CreateEvaluationInput>,
  ) => Promise<void>;
}) {
  const isEditing = !!evaluation;
  const form = useForm<CreateEvaluationInput>({
    resolver: zodResolver(createEvaluationSchema),
    defaultValues: {
      evalType: "REWARD",
      rewardType: "",
      rewardName: "",
      decisionOn: "",
      decisionNo: "",
      content: "",
      rewardAmount: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      evalType: "REWARD",
      rewardType: evaluation?.rewardType ?? "",
      rewardName: evaluation?.rewardName ?? "",
      decisionOn: formatForInput(evaluation?.decisionOn),
      decisionNo: evaluation?.decisionNo ?? "",
      content: evaluation?.content ?? "",
      rewardAmount: evaluation?.rewardAmount ?? "",
    });
  }, [open, evaluation, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
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
              {isEditing ? "Chỉnh sửa khen thưởng" : "Thêm khen thưởng"}
            </DialogTitle>
            {staffCode && (
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                Mã nhân sự: {staffCode}
              </span>
            )}
          </div>
          <DialogDescription className="sr-only">
            Nhập thông tin khen thưởng cho nhân sự.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form.setError))}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rewardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại khen thưởng <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập loại khen thưởng"
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
                name="rewardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên khen thưởng <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên khen thưởng"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="decisionOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày quyết định <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="decisionNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số quyết định <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số quyết định"
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung khen thưởng"
                      rows={3}
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
              name="rewardAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền thưởng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số tiền thưởng"
                      {...field}
                      value={field.value ?? ""}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Discipline Form Dialog
// ──────────────────────────────────────────────────────────────────────

function DisciplineFormDialog({
  open,
  onOpenChange,
  evaluation,
  staffCode,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation?: EmployeeEvaluation | null;
  staffCode?: string;
  isSubmitting: boolean;
  onSubmit: (
    input: CreateEvaluationInput,
    setError: UseFormSetError<CreateEvaluationInput>,
  ) => Promise<void>;
}) {
  const isEditing = !!evaluation;
  const form = useForm<CreateEvaluationInput>({
    resolver: zodResolver(createEvaluationSchema),
    defaultValues: {
      evalType: "DISCIPLINE",
      disciplineType: "",
      disciplineName: "",
      decisionOn: "",
      reason: "",
      actionForm: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      evalType: "DISCIPLINE",
      disciplineType: evaluation?.disciplineType ?? "",
      disciplineName: evaluation?.disciplineName ?? "",
      decisionOn: formatForInput(evaluation?.decisionOn),
      reason: evaluation?.reason ?? "",
      actionForm: evaluation?.actionForm ?? "",
    });
  }, [open, evaluation, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
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
              {isEditing ? "Chỉnh sửa kỷ luật" : "Thêm kỷ luật"}
            </DialogTitle>
            {staffCode && (
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                Mã nhân sự: {staffCode}
              </span>
            )}
          </div>
          <DialogDescription className="sr-only">
            Nhập thông tin kỷ luật cho nhân sự.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form.setError))}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="disciplineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại kỷ luật <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập loại kỷ luật"
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
                name="disciplineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên kỷ luật <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên kỷ luật"
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
              name="decisionOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ngày quyết định <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lý do <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do kỷ luật"
                      rows={3}
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
              name="actionForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Hình thức xử lý <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập hình thức xử lý"
                      {...field}
                      value={field.value ?? ""}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
