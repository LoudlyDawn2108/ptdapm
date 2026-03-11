import { api } from "@/api/client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { type CreateEmployeeInput, WorkStatus } from "@hrms/shared";
import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId")({
  component: EmployeeDetailLayout,
});

interface EmployeeDetailData {
  id: string;
  staffCode?: string | null;
  fullName?: string | null;
  workStatus?: keyof typeof WorkStatus | null;
  dob?: string | null;
  gender?: string | null;
  nationalId?: string | null;
  hometown?: string | null;
  address?: string | null;
  taxCode?: string | null;
  socialInsuranceNo?: string | null;
  healthInsuranceNo?: string | null;
  email?: string | null;
  phone?: string | null;
  isForeigner?: boolean | null;
  educationLevel?: string | null;
  trainingLevel?: string | null;
  academicTitle?: string | null;
  academicRank?: string | null;
  contractStatus?: string | null;
  currentOrgUnitId?: string | null;
  currentPositionTitle?: string | null;
  salaryGradeStepId?: string | null;
  portraitFileId?: string | null;
}

interface EmployeeDetailPayload {
  employee: EmployeeDetailData;
}

type EmployeeDetailResponse = {
  data?: {
    data?: EmployeeDetailPayload;
  };
};

type EmployeeDetailEndpoints = {
  get: () => Promise<EmployeeDetailResponse>;
  delete: () => Promise<EmployeeDetailResponse>;
  put: (body: CreateEmployeeInput) => Promise<EmployeeDetailResponse>;
};

type EmployeesApi = (params: {
  employeeId: string;
}) => EmployeeDetailEndpoints;

const employeesApi = (api.api as unknown as { employees: EmployeesApi }).employees;

export interface EmployeeDetailContextValue {
  employee: EmployeeDetailData | null;
  isLoading: boolean;
  reload: () => Promise<void>;
}

const EmployeeDetailContext = React.createContext<EmployeeDetailContextValue | null>(null);

export function useEmployeeDetail() {
  const context = React.useContext(EmployeeDetailContext);
  if (!context) {
    throw new Error("useEmployeeDetail must be used within EmployeeDetailLayout");
  }
  return context;
}

const tabs = [
  { key: "personal", label: "Thông tin cá nhân", to: "/employees/$employeeId" },
  { key: "family", label: "Gia đình", to: "/employees/$employeeId/family" },
  {
    key: "bank-accounts",
    label: "Tài khoản ngân hàng",
    to: "/employees/$employeeId/bank-accounts",
  },
  {
    key: "previous-jobs",
    label: "Quá trình công tác",
    to: "/employees/$employeeId/previous-jobs",
  },
  { key: "party-memberships", label: "Đảng/Đoàn", to: "/employees/$employeeId/party-memberships" },
  {
    key: "allowances",
    label: "Phụ cấp",
    to: "/employees/$employeeId/allowances",
  },
];

function getTabFromPath(pathname: string) {
  if (pathname.includes("/family")) return "family";
  if (pathname.includes("/bank-accounts")) return "bank-accounts";
  if (pathname.includes("/previous-jobs")) return "previous-jobs";
  if (pathname.includes("/party-memberships")) return "party-memberships";
  if (pathname.includes("/allowances")) return "allowances";
  return "personal";
}

function EmployeeDetailLayout() {
  const routeApi = Route as unknown as {
    useParams: () => { employeeId: string };
    useSearch?: () => { tab?: string; mode?: string };
  };
  const { employeeId } = routeApi.useParams();
  const search = (routeApi.useSearch?.() ?? {}) as { tab?: string; mode?: string };
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const [employee, setEmployee] = React.useState<EmployeeDetailData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasEmployee, setHasEmployee] = React.useState<boolean | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const loadEmployee = React.useCallback(
    async (isActive?: () => boolean) => {
      setIsLoading(true);
      try {
        const response = await employeesApi({ employeeId }).get();
        if (isActive && !isActive()) return;
        const payload = response.data?.data?.employee;

        if (payload) {
          setEmployee(payload ?? null);
          setHasEmployee(true);
        } else {
          setEmployee(null);
          setHasEmployee(false);
        }
      } catch {
        if (isActive && !isActive()) return;
        setEmployee(null);
        setHasEmployee(false);
      } finally {
        if (!isActive || isActive()) {
          setIsLoading(false);
        }
      }
    },
    [employeeId],
  );

  React.useEffect(() => {
    let active = true;
    loadEmployee(() => active);
    return () => {
      active = false;
    };
  }, [loadEmployee]);

  const activeTab = React.useMemo(() => {
    const derived = getTabFromPath(location.pathname);
    return search.tab ?? derived;
  }, [location.pathname, search.tab]);

  const toLabel = <T extends { label: string }>(
    record: Record<string, T>,
    value?: string | null,
  ) => {
    if (!value) return "—";
    return record[value]?.label ?? value;
  };

  const workStatusLabel = toLabel(WorkStatus, employee?.workStatus ?? undefined);

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    const url = `${baseUrl}/api/employees/${employeeId}/export?format=csv`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await employeesApi({ employeeId }).delete();
      if (response.data?.data) {
        setConfirmOpen(false);
        navigate({ to: "/employees" });
      }
    } catch {
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={employee?.fullName ?? "Hồ sơ nhân sự"}
        description={
          hasEmployee ? `Mã cán bộ: ${employee?.staffCode ?? "—"} · ${workStatusLabel}` : ""
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              onClick={() =>
                (
                  navigate as unknown as (opts: {
                    search: Record<string, string | undefined>;
                  }) => void
                )({ search: { ...search, mode: "edit", tab: activeTab } })
              }
            >
              Chỉnh sửa
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              onClick={handleExport}
            >
              Xuất file
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-destructive/40 bg-destructive/10 px-4 text-sm font-medium text-destructive transition hover:bg-destructive/20"
              onClick={() => setConfirmOpen(true)}
            >
              Xóa
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Link
              key={tab.key}
              to={tab.to}
              params={{ employeeId }}
              search={{ tab: tab.key }}
              className={cn(
                "relative px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground",
                isActive && "text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-primary transition",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </Link>
          );
        })}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Đang tải thông tin nhân sự...
        </div>
      ) : hasEmployee ? (
        <EmployeeDetailContext.Provider value={{ employee, isLoading, reload: loadEmployee }}>
          <Outlet />
        </EmployeeDetailContext.Provider>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Không tìm thấy hồ sơ nhân sự
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa hồ sơ nhân sự"
        description="Bạn có chắc chắn muốn xóa hồ sơ nhân sự này?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        loading={deleteLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
