import { PageHeader } from "@/components/layout/page-header";
import { QueryError } from "@/components/shared/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { statisticsOptions } from "@/features/dashboard/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, GraduationCap, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-5 w-5 text-muted-foreground/50" />
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <p className="mt-2 text-3xl font-bold">{value}</p>
      )}
    </div>
  );
}

function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery(statisticsOptions());
  const stats = data?.data;

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Bảng điều khiển"
          description="Tổng quan Hệ thống Quản lý Nhân sự — Trường Đại học Thủy Lợi"
        />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Bảng điều khiển"
        description="Tổng quan Hệ thống Quản lý Nhân sự — Trường Đại học Thủy Lợi"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng nhân sự"
          value={stats?.totalEmployees ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Đang công tác"
          value={stats?.activeEmployees ?? 0}
          icon={BarChart3}
          loading={isLoading}
        />
        <StatCard
          title="Đơn vị tổ chức"
          value={stats?.totalOrgUnits ?? 0}
          icon={Building2}
          loading={isLoading}
        />
        <StatCard
          title="Khóa đào tạo"
          value={stats?.totalTrainingCourses ?? 0}
          icon={GraduationCap}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
