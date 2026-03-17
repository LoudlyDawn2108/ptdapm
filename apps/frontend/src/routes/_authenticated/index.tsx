import { PageHeader } from "@/components/layout/page-header";
import { QueryError } from "@/components/shared/query-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { statisticsOptions } from "@/features/dashboard/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

// ── Summary stat cards ──────────────────────────────────────────────────
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

// ── Chart card wrapper ──────────────────────────────────────────────────
const CHART_COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd",
  "#818cf8", "#4f46e5", "#7c3aed", "#5b21b6",
];

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

function LoadingChart() {
  return <Skeleton className="h-48 w-full rounded-md" />;
}

// ── Individual chart components ─────────────────────────────────────────
function AreaChartView({
  data,
  dataKey,
  nameKey,
}: {
  data: Array<{ name: string; value: number }>;
  dataKey?: string;
  nameKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey={nameKey ?? "name"}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey ?? "value"}
          stroke="#6366f1"
          fill="url(#fillGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BarChartView({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartView({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
          label={({ name = "", percent }: { name?: string; percent?: number }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          labelLine={false}
          className="text-[10px]"
        >
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: "12px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Label mappings ──────────────────────────────────────────────────────
const workStatusLabels: Record<string, string> = {
  pending: "Đang chờ xét",
  working: "Đang công tác",
  terminated: "Đã thôi việc",
};

const contractStatusLabels: Record<string, string> = {
  none: "Chưa HĐ",
  valid: "Còn hiệu lực",
  expired: "Hết hiệu lực",
  renewal_wait: "Chờ gia hạn",
};

const genderLabels: Record<string, string> = {
  NAM: "Nam",
  NU: "Nữ",
  KHAC: "Khác",
};

const educationLabels: Record<string, string> = {
  THCS: "THCS",
  THPT: "THPT",
  TRUNG_CAP: "Trung cấp",
  CAO_DANG: "Cao đẳng",
  DAI_HOC: "Đại học",
  THAC_SI: "Thạc sĩ",
  TIEN_SI: "Tiến sĩ",
};

const academicRankLabels: Record<string, string> = {
  GS: "Giáo sư",
  PGS: "Phó GS",
};

// ── Main page ───────────────────────────────────────────────────────────
function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery(statisticsOptions());
  const stats = data?.data as any;

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Thống kê"
          description="Tổng quan Hệ thống Quản lý Nhân sự — Trường Đại học Thủy Lợi"
        />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  // Transform backend data for charts
  const byWorkStatus = (stats?.byWorkStatus ?? []).map(
    (item: any) => ({
      name: workStatusLabels[item.status] ?? item.status,
      value: item.count,
    }),
  );

  const byContractStatus = (stats?.byContractStatus ?? []).map(
    (item: any) => ({
      name: contractStatusLabels[item.status] ?? item.status,
      value: item.count,
    }),
  );

  const byOrgUnit = (stats?.byOrgUnit ?? []).slice(0, 10).map(
    (item: any) => ({
      name: item.orgUnitName?.length > 15
        ? `${item.orgUnitName.substring(0, 15)}…`
        : (item.orgUnitName ?? "—"),
      value: item.count,
    }),
  );

  const byGender = (stats?.byGender ?? []).map(
    (item: any) => ({
      name: genderLabels[item.gender] ?? item.gender,
      value: item.count,
    }),
  );

  const byEducation = (stats?.byEducationLevel ?? []).map(
    (item: any) => ({
      name: educationLabels[item.level] ?? item.level,
      value: item.count,
    }),
  );

  const byAcademicRank = (stats?.byAcademicRank ?? []).map(
    (item: any) => ({
      name: academicRankLabels[item.rank] ?? item.rank,
      value: item.count,
    }),
  );

  return (
    <div>
      <PageHeader
        title="Thống kê"
        description="Tổng quan Hệ thống Quản lý Nhân sự — Trường Đại học Thủy Lợi"
      />

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng nhân sự"
          value={stats?.totalEmployees ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Đơn vị tổ chức"
          value={stats?.totalOrgUnits ?? 0}
          icon={Building2}
          loading={isLoading}
        />
        <StatCard
          title="Đang công tác"
          value={
            byWorkStatus.find((i: any) => i.name === "Đang công tác")?.value ?? 0
          }
          icon={BarChart3}
          loading={isLoading}
        />
      </div>

      {/* Charts grid — 2 columns */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Theo trạng thái công tác">
          {isLoading ? <LoadingChart /> : <AreaChartView data={byWorkStatus} />}
        </ChartCard>

        <ChartCard title="Theo trạng thái hợp đồng">
          {isLoading ? <LoadingChart /> : <AreaChartView data={byContractStatus} />}
        </ChartCard>

        <ChartCard title="Theo giới tính">
          {isLoading ? <LoadingChart /> : <PieChartView data={byGender} />}
        </ChartCard>

        <ChartCard title="Theo trình độ học vấn">
          {isLoading ? <LoadingChart /> : <BarChartView data={byEducation} />}
        </ChartCard>

        <ChartCard title="Theo đơn vị tổ chức (Top 10)">
          {isLoading ? <LoadingChart /> : <BarChartView data={byOrgUnit} />}
        </ChartCard>

        <ChartCard title="Theo học hàm">
          {isLoading ? <LoadingChart /> : <PieChartView data={byAcademicRank} />}
        </ChartCard>
      </div>
    </div>
  );
}
