import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryError } from "@/components/shared/query-error";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  salaryGradeListOptions,
  salaryGradeStepsOptions,
  useDeleteSalaryGrade,
  useDeleteSalaryGradeStep,
} from "@/features/config/salary-grades/api";
import {
  SalaryGradeFormDialog,
  type GradeRow,
} from "@/features/config/salary-grades/SalaryGradeFormDialog";
import {
  SalaryGradeStepFormDialog,
  type StepRow,
  type GradeOption,
} from "@/features/config/salary-grades/SalaryGradeStepFormDialog";
import { useDebounce } from "@/hooks/use-debounce";
import { SKELETON_ROW_COUNT } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { CatalogStatus } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/config/salary-grades/")({
  beforeLoad: authorizeRoute("/config/salary-grades"),
  component: SalaryGradesPage,
});

// ── Step table for a single grade ───────────────────────────────────────
function GradeStepsTable({
  grade,
  onEditStep,
}: {
  grade: GradeRow;
  onEditStep: (step: StepRow) => void;
}) {
  const { data, isLoading } = useQuery(salaryGradeStepsOptions(grade.id));
  const deleteStepMutation = useDeleteSalaryGradeStep();
  const steps = ((data?.data ?? []) as any[]).map((s: any) => ({
    ...s,
    gradeId: s.salaryGradeId ?? s.gradeId ?? grade.id,
  })) as StepRow[];

  if (isLoading) {
    return (
      <div className="space-y-2 px-4 pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`sk-${i}`} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <p className="px-4 pb-4 text-sm text-muted-foreground">
        Chưa có bậc lương nào trong ngạch này.
      </p>
    );
  }

  return (
    <div className="overflow-auto px-4 pb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
            <th className="rounded-l-lg px-4 py-2.5 text-left font-medium">MÃ HSL</th>
            <th className="px-4 py-2.5 text-left font-medium">BẬC LƯƠNG</th>
            <th className="px-4 py-2.5 text-left font-medium">HỆ SỐ LƯƠNG</th>
            <th className="px-4 py-2.5 text-left font-medium">TRẠNG THÁI</th>
            <th className="rounded-r-lg px-4 py-2.5 text-right font-medium">THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => {
            const s = CatalogStatus[step.status as keyof typeof CatalogStatus];
            return (
              <tr key={step.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2.5 font-mono text-xs">
                  HSL{grade.gradeCode}{String(step.stepNo).padStart(2, "0")}
                </td>
                <td className="px-4 py-2.5">Bậc {step.stepNo}</td>
                <td className="px-4 py-2.5">{step.coefficient}</td>
                <td className="px-4 py-2.5">
                  <StatusBadgeFromCode
                    code={step.status}
                    label={s?.label ?? step.status}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onEditStep({ ...step, gradeId: grade.id })
                      }
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      title="Xóa hệ số lương"
                      description={`Bạn có chắc chắn muốn xóa hệ số lương HSL${grade.gradeCode}${String(step.stepNo).padStart(2, "0")}?\nHành động này không thể hoàn tác`}
                      confirmLabel="Xóa"
                      variant="destructive"
                      onConfirm={() =>
                        deleteStepMutation.mutate(
                          { gradeId: grade.id, stepId: step.id },
                          { onSuccess: () => toast.success("Đã xóa bậc lương") },
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Accordion section for a single grade ────────────────────────────────
function GradeAccordion({
  grade,
  onAddStep,
  onEditStep,
  onEditGrade,
  onDeleteGrade,
}: {
  grade: GradeRow;
  onAddStep: (gradeId: string, gradeName: string) => void;
  onEditStep: (step: StepRow) => void;
  onEditGrade: (grade: GradeRow) => void;
  onDeleteGrade: (grade: GradeRow) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between bg-gradient-to-r from-blue-500 to-blue-400 px-4 py-2.5 text-white hover:from-blue-600 hover:to-blue-500 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-semibold text-sm italic">{grade.gradeName}</span>
        <div className="flex items-center gap-1">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>
      <div className="flex w-full items-center justify-between px-4 py-1">
        <div />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEditGrade(grade); }}
            title="Sửa ngạch lương"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm" title="Xóa ngạch lương">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
            title="Xóa ngạch lương"
            description={`Bạn có chắc muốn xóa ngạch "${grade.gradeName}"?\nHành động này không thể hoàn tác`}
            confirmLabel="Xác nhận xóa"
            variant="destructive"
            onConfirm={() => onDeleteGrade(grade)}
          />
        </div>
      </div>
      {expanded && (
        <div>
          <GradeStepsTable grade={grade} onEditStep={onEditStep} />
        </div>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────
function SalaryGradesPage() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText);
  const { data, isLoading, isError, error, refetch } = useQuery(
    salaryGradeListOptions({ page: 1, pageSize: 100, search: debouncedSearch }),
  );
  const grades = ((data as any)?.data?.items ?? []) as GradeRow[];
  const deleteGradeMutation = useDeleteSalaryGrade();

  // Grade dialog state
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeRow | null>(null);

  // Step dialog state
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [stepGradeId, setStepGradeId] = useState("");
  const [stepGradeName, setStepGradeName] = useState("");
  const [editingStep, setEditingStep] = useState<StepRow | null>(null);

  const handleAddGrade = () => {
    setEditingGrade(null);
    setGradeDialogOpen(true);
  };

  const handleAddStepFromTop = () => {
    // Default to the first grade if available
    if (grades.length > 0) {
      setStepGradeId(grades[0]?.id ?? "");
      setStepGradeName(grades[0]?.gradeName ?? "");
    } else {
      setStepGradeId("");
      setStepGradeName("");
    }
    setEditingStep(null);
    setStepDialogOpen(true);
  };

  const handleEditGrade = (grade: GradeRow) => {
    setEditingGrade(grade);
    setGradeDialogOpen(true);
  };

  const handleDeleteGrade = (grade: GradeRow) => {
    deleteGradeMutation.mutate(grade.id, {
      onSuccess: () => toast.success(`Đã xóa ngạch "${grade.gradeName}"`),
    });
  };

  const handleAddStep = (gradeId: string, gradeName: string) => {
    setStepGradeId(gradeId);
    setStepGradeName(gradeName);
    setEditingStep(null);
    setStepDialogOpen(true);
  };

  const handleEditStep = (step: StepRow) => {
    setStepGradeId(step.gradeId);
    const grade = grades.find((g) => g.id === step.gradeId);
    setStepGradeName(grade?.gradeName ?? "");
    setEditingStep(step);
    setStepDialogOpen(true);
  };

  if (isError) {
    return (
      <div>
        <PageHeader title="Hệ số lương" description="Quản lý danh mục hệ số lương" />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Hệ số lương"
        description="Quản lý danh mục hệ số lương"
        actions={
          <Button onClick={handleAddStepFromTop}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm hệ số lương
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo mã ngạch, tên..."
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
            <Skeleton key={`s-${i}`} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : grades.length > 0 ? (
        <div className="space-y-3">
          {grades.map((grade) => (
            <GradeAccordion
              key={grade.id}
              grade={grade}
              onAddStep={handleAddStep}
              onEditStep={handleEditStep}
              onEditGrade={handleEditGrade}
              onDeleteGrade={handleDeleteGrade}
            />
          ))}
        </div>
      ) : (
        <EmptyState description="Không có hệ số lương nào" />
      )}

      {/* Grade Create/Edit Dialog */}
      <SalaryGradeFormDialog
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
        editingItem={editingGrade}
      />

      {/* Step Create/Edit Dialog */}
      <SalaryGradeStepFormDialog
        open={stepDialogOpen}
        onOpenChange={setStepDialogOpen}
        gradeId={stepGradeId}
        gradeName={stepGradeName}
        editingStep={editingStep}
        grades={grades.map((g) => ({ id: g.id, gradeCode: g.gradeCode, gradeName: g.gradeName } as GradeOption))}
        onGradeChange={(id, name) => { setStepGradeId(id); setStepGradeName(name); }}
      />
    </div>
  );
}
