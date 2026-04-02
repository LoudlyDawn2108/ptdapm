import { RoleGuard } from "@/components/shared/role-guard";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orgUnitDetailOptions, useAddAssignment, useEndAssignment } from "@/features/org-units/api";
import { fetchEmployeeDropdown } from "@/lib/api/config-dropdowns";
import { formatDate } from "@/lib/date-utils";
import { ApiResponseError } from "@/lib/error-handler";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/org-units_/$orgUnitId/staff")({
  component: StaffTab,
});

type AssignmentEntry = {
  id: string;
  employeeId: string;
  positionTitle: string | null;
  startedOn: string | null;
  endedOn: string | null;
  staffCode: string;
  fullName: string;
};

function StaffTab() {
  const { orgUnitId } = Route.useParams();

  const { data: orgDetail } = useQuery(orgUnitDetailOptions(orgUnitId));
  const endAssignment = useEndAssignment();
  const addAssignment = useAddAssignment();

  const unit = orgDetail?.data;
  const assignments = (unit?.assignments ?? []) as AssignmentEntry[];

  // End assignment dialog
  const [endTarget, setEndTarget] = useState<AssignmentEntry | null>(null);

  // Add assignment dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({
    employeeId: "",
    positionTitle: "",
    startedOn: new Date().toISOString().split("T")[0]!,
  });

  const handleEndAssignment = async () => {
    if (!endTarget) return;
    try {
      await endAssignment.mutateAsync({
        orgUnitId,
        assignmentId: endTarget.id,
      });
      toast.success("Bãi nhiệm thành công");
      setEndTarget(null);
    } catch (err: unknown) {
      if (!(err instanceof ApiResponseError)) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
        toast.error(message);
      }
    }
  };

  const handleAddAssignment = async () => {
    if (!addForm.employeeId || !addForm.startedOn) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      await addAssignment.mutateAsync({
        orgUnitId,
        employeeId: addForm.employeeId,
        positionTitle: addForm.positionTitle || undefined,
        startedOn: addForm.startedOn,
      });
      toast.success("Bổ nhiệm thành công");
      setShowAddDialog(false);
      setAddForm({
        employeeId: "",
        positionTitle: "",
        startedOn: new Date().toISOString().split("T")[0]!,
      });
    } catch (err: unknown) {
      if (!(err instanceof ApiResponseError)) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
        toast.error(message);
      }
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Add button */}
      <RoleGuard roles={["ADMIN", "TCCB"]}>
        {unit?.status === "active" && (
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Bổ nhiệm nhân sự
            </Button>
          </div>
        )}
      </RoleGuard>

      {assignments.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-2.5 text-left font-medium">Mã NS</th>
                <th className="px-4 py-2.5 text-left font-medium">Họ tên</th>
                <th className="px-4 py-2.5 text-left font-medium">Đơn vị công tác</th>
                <th className="px-4 py-2.5 text-left font-medium">Chức vụ</th>
                <th className="px-4 py-2.5 text-left font-medium">Ngày bổ nhiệm</th>
                <th className="px-4 py-2.5 text-left font-medium">Trạng thái</th>
                <th className="rounded-r-lg px-4 py-2.5 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const isEnded = !!a.endedOn;
                return (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2.5">{a.staffCode}</td>
                    <td className="px-4 py-2.5">{a.fullName}</td>
                    <td className="px-4 py-2.5">{unit?.unitName ?? "—"}</td>
                    <td className="px-4 py-2.5">{a.positionTitle ?? "—"}</td>
                    <td className="px-4 py-2.5">{formatDate(a.startedOn)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadgeFromCode
                        code={isEnded ? "terminated" : "active"}
                        label={isEnded ? "Đã thôi việc" : "Đang công tác"}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <RoleGuard roles={["ADMIN", "TCCB"]}>
                        {!isEnded && unit?.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setEndTarget(a)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </RoleGuard>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Chưa có nhân sự trong đơn vị này.
        </p>
      )}

      {/* ── End Assignment Confirmation Dialog ──────────────── */}
      <Dialog
        open={!!endTarget}
        onOpenChange={(open) => {
          if (!open) setEndTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-center text-lg">Bãi nhiệm nhân sự</DialogTitle>
            <DialogDescription className="text-center">
              Bạn có chắc chắn muốn bãi nhiệm nhân sự {endTarget?.staffCode} — {endTarget?.fullName}
              ?
              <br />
              Hành động này không thể hoàn tác
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center sm:justify-center gap-3">
            <Button variant="outline" onClick={() => setEndTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={endAssignment.isPending}
              onClick={handleEndAssignment}
            >
              {endAssignment.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Assignment Dialog ──────────────────────────── */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bổ nhiệm nhân sự</DialogTitle>
            <DialogDescription>Thêm nhân sự vào đơn vị {unit?.unitName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Nhân sự <span className="text-destructive">*</span>
              </Label>
              <Combobox
                queryKey={["employees", "combobox"]}
                fetchOptions={fetchEmployeeDropdown}
                value={addForm.employeeId}
                onChange={(val) => setAddForm((f) => ({ ...f, employeeId: val }))}
                placeholder="Tìm kiếm nhân sự..."
                emptyMessage="Không tìm thấy nhân sự."
              />
            </div>
            <div className="space-y-2">
              <Label>Chức vụ</Label>
              <Input
                placeholder="Ví dụ: Giảng viên, Trưởng phòng..."
                value={addForm.positionTitle}
                onChange={(e) => setAddForm((f) => ({ ...f, positionTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày bổ nhiệm</Label>
              <Input
                type="date"
                value={addForm.startedOn}
                onChange={(e) => setAddForm((f) => ({ ...f, startedOn: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button disabled={addAssignment.isPending} onClick={handleAddAssignment}>
              {addAssignment.isPending ? "Đang xử lý..." : "Bổ nhiệm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
