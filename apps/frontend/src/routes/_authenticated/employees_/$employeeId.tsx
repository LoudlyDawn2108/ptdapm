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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks";
import { useEmployeeDetail, useMarkResigned } from "@/features/employees/api";
import { ApiResponseError } from "@/lib/error-handler";
import { authorizeRoute } from "@/lib/permissions";
import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { Pencil, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TAB_ITEMS = [
  { value: "", label: "Thông tin chung", path: "" },
  { value: "family", label: "Thông tin gia đình", path: "/family" },
  { value: "work-history", label: "Lịch sử công tác", path: "/work-history" },
  { value: "education", label: "Trình độ học vấn", path: "/education" },
  { value: "party", label: "Đảng/Đoàn", path: "/party" },
  { value: "salary", label: "Lương và phụ cấp", path: "/salary" },
  { value: "contracts", label: "Hợp đồng", path: "/contracts" },
  { value: "assignments", label: "Bổ nhiệm", path: "/assignments" },
  { value: "rewards", label: "Khen thưởng/Kỷ luật", path: "/rewards" },
] as const;

export const Route = createFileRoute("/_authenticated/employees_/$employeeId")({
  beforeLoad: authorizeRoute("/employees"),
  component: EmployeeDetailLayout,
});

function EmployeeDetailLayout() {
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [showResignDialog, setShowResignDialog] = useState(false);
  const [resignReason, setResignReason] = useState("");
  const markResigned = useMarkResigned();

  const { aggregate, employee: emp, isLoading } = useEmployeeDetail(employeeId);

  // Determine active tab from current path
  const basePath = `/employees/${employeeId}`;
  const activeTab = (() => {
    const suffix = currentPath.replace(basePath, "").replace(/^\//, "");
    return suffix || "";
  })();

  const canEdit =
    user && (user.role === "TCCB" || user.role === "ADMIN") && emp?.workStatus !== "terminated";

  if (isLoading) {
    return <FormSkeleton fields={8} />;
  }

  if (!emp) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy thông tin nhân sự.</p>
      </div>
    );
  }

  const handleCloseResignDialog = () => {
    setShowResignDialog(false);
    setResignReason("");
  };

  const handleConfirmResigned = async () => {
    try {
      await markResigned.mutateAsync({
        id: employeeId,
        reason: resignReason || undefined,
      });
      toast.success("Đã đánh dấu thôi việc thành công");
      handleCloseResignDialog();
    } catch (err: unknown) {
      if (!(err instanceof ApiResponseError)) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
        toast.error(message);
      }
    }
  };

  return (
    <div>
      {/* ── Action Buttons ───────────────── */}
      <div className="flex items-center justify-end gap-3 mb-4">
        {canEdit && (
          <Button variant="outline" asChild>
            <Link to="/employees/$employeeId/edit" params={{ employeeId }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa hồ sơ
            </Link>
          </Button>
        )}
        {canEdit && emp.workStatus !== "terminated" && (
          <Button variant="destructive" onClick={() => setShowResignDialog(true)}>
            <UserX className="mr-2 h-4 w-4" />
            Đánh dấu thôi việc
          </Button>
        )}
      </div>

      {/* ── Tab Navigation ───────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          const tab = TAB_ITEMS.find((t) => t.value === val);
          if (tab) {
            void navigate({
              to: `/employees/$employeeId${tab.path}`,
              params: { employeeId },
            } as Parameters<typeof navigate>[0]);
          }
        }}
        className="mb-6"
      >
        <TabsList className="w-full justify-start overflow-x-auto" aria-label="Chi tiết nhân sự">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} aria-label={`Tab ${tab.label}`}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ── Tab Content (child routes) ──── */}
      <Outlet />

      <Dialog
        open={showResignDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseResignDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đánh dấu thôi việc</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đánh dấu <strong>{emp.fullName}</strong> thôi việc? Hành động
              này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="resign-reason">
              Lý do thôi việc
            </label>
            <Input
              id="resign-reason"
              value={resignReason}
              onChange={(e) => setResignReason(e.target.value)}
              placeholder="Nhập lý do..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseResignDialog}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={markResigned.isPending}
              onClick={handleConfirmResigned}
            >
              {markResigned.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
