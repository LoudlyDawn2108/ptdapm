import { PageHeader } from "@/components/layout/page-header";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statisticsOptions } from "@/features/dashboard/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#818cf8",
  "#4f46e5",
  "#7c3aed",
  "#5b21b6",
  "#06b6d4",
  "#14b8a6",
];

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  fontSize: "12px",
};

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
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function LoadingChart() {
  return <Skeleton className="h-48 w-full rounded-md" />;
}

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
    <ResponsiveContainer width="100%" height={250}>
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
        <Tooltip contentStyle={TOOLTIP_STYLE} />
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

function BarChartView({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
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
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={`bar-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartView({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
          label={({ name = "", percent }: { name?: string; percent?: number }) =>
            `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
          }
          labelLine={false}
          className="text-[10px]"
        >
          {data.map((_, i) => (
            <Cell key={`pie-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function MultiLineChartView({
  data,
  lines,
}: {
  data: Array<Record<string, unknown>>;
  lines: Array<{ dataKey: string; name: string; color: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
              Không có dữ liệu
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function exportToCSV(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const BOM = "\uFEFF";
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function ExportButton({
  filename,
  headers,
  rows,
}: {
  filename: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => exportToCSV(filename, headers, rows)}
      className="gap-1.5"
    >
      <Download className="h-4 w-4" />
      Xuất báo cáo
    </Button>
  );
}

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
  SO_CAP: "Sơ cấp",
  TRUNG_CAP: "Trung cấp",
  CAO_DANG: "Cao đẳng",
  DAI_HOC: "Đại học",
  THAC_SI: "Thạc sĩ",
  TIEN_SI: "Tiến sĩ",
  TSKH: "Tiến sĩ khoa học",
};

const academicRankLabels: Record<string, string> = {
  DAI_HOC: "Đại học",
  THAC_SI: "Thạc sĩ",
  TIEN_SI: "Tiến sĩ",
  PGS: "Phó Giáo sư",
  GS: "Giáo sư",
};

const contractDocStatusLabels: Record<string, string> = {
  draft: "Nháp",
  valid: "Đang hiệu lực",
  expired: "Hết hiệu lực",
  terminated: "Đã chấm dứt",
};

const trainingStatusLabels: Record<string, string> = {
  open_registration: "Mở đăng ký",
  in_progress: "Đang diễn ra",
  completed: "Đã hoàn thành",
};

const participationStatusLabels: Record<string, string> = {
  registered: "Đã đăng ký",
  learning: "Đang học",
  completed: "Hoàn thành",
  failed: "Không đạt",
};

const resultStatusLabels: Record<string, string> = {
  completed: "Hoàn thành",
  failed: "Không đạt",
};

const orgUnitTypeLabels: Record<string, string> = {
  HOI_DONG: "Hội đồng",
  BAN: "Ban",
  KHOA: "Khoa",
  PHONG: "Phòng",
  BO_MON: "Bộ môn",
  PHONG_THI_NGHIEM: "Phòng thí nghiệm",
  TRUNG_TAM: "Trung tâm",
};

function mapData<T extends Record<string, unknown>>(
  arr: T[] | undefined,
  nameField: string,
  labels: Record<string, string>,
): Array<{ name: string; value: number }> {
  return (arr ?? []).map((item) => ({
    name: labels[item[nameField] as string] ?? (item[nameField] as string),
    value: item.count as number,
  }));
}

function ReportGroupOverview({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const byWorkStatus = mapData(stats?.byWorkStatus as any[], "status", workStatusLabels);
  const byGender = mapData(stats?.byGender as any[], "gender", genderLabels);
  const workingCount = byWorkStatus.find((i) => i.name === "Đang công tác")?.value ?? 0;

  const exportHeaders = ["Chỉ số", "Giá trị"];
  const exportRows: Array<Array<string | number>> = [
    ["Tổng nhân sự", (stats?.totalEmployees as number) ?? 0],
    ["Đơn vị tổ chức", (stats?.totalOrgUnits as number) ?? 0],
    ["Đang công tác", workingCount],
    ...byWorkStatus.map((i) => [`Trạng thái: ${i.name}`, i.value]),
    ...byGender.map((i) => [`Giới tính: ${i.name}`, i.value]),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportButton filename="bao-cao-tong-quan" headers={exportHeaders} rows={exportRows} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng nhân sự"
          value={(stats?.totalEmployees as number) ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Đơn vị tổ chức"
          value={(stats?.totalOrgUnits as number) ?? 0}
          icon={Building2}
          loading={isLoading}
        />
        <StatCard title="Đang công tác" value={workingCount} icon={UserCheck} loading={isLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Theo trạng thái công tác">
          {isLoading ? <LoadingChart /> : <PieChartView data={byWorkStatus} />}
        </ChartCard>
        <ChartCard title="Theo giới tính">
          {isLoading ? <LoadingChart /> : <PieChartView data={byGender} />}
        </ChartCard>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Chi tiết trạng thái công tác</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            headers={["Trạng thái", "Số lượng"]}
            rows={byWorkStatus.map((i) => [i.name, i.value])}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportGroupTurnover({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const newHires = (stats?.newHiresByMonth as any[]) ?? [];
  const terminations = (stats?.terminationsByMonth as any[]) ?? [];

  const allMonths = Array.from(
    new Set([...newHires.map((h) => h.month), ...terminations.map((t) => t.month)]),
  ).sort();
  const combinedData = allMonths.map((month) => ({
    month,
    newHires: newHires.find((h) => h.month === month)?.count ?? 0,
    terminations: terminations.find((t) => t.month === month)?.count ?? 0,
  }));

  const exportHeaders = ["Tháng", "Tuyển mới", "Nghỉ việc"];
  const exportRows = combinedData.map(
    (d) => [d.month, d.newHires, d.terminations] as Array<string | number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Tổng nghỉ việc"
            value={(stats?.totalTerminations as number) ?? 0}
            icon={TrendingUp}
            loading={isLoading}
          />
        </div>
        <ExportButton filename="bao-cao-bien-dong" headers={exportHeaders} rows={exportRows} />
      </div>

      <ChartCard title="Biến động nhân sự theo tháng (12 tháng gần nhất)">
        {isLoading ? (
          <LoadingChart />
        ) : (
          <MultiLineChartView
            data={combinedData}
            lines={[
              { dataKey: "newHires", name: "Tuyển mới", color: "#6366f1" },
              { dataKey: "terminations", name: "Nghỉ việc", color: "#ef4444" },
            ]}
          />
        )}
      </ChartCard>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Chi tiết biến động theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable headers={exportHeaders} rows={exportRows} />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportGroupByOrgUnit({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const byOrgUnit = ((stats?.byOrgUnit as any[]) ?? []).map((item) => ({
    name:
      (item.orgUnitName as string)?.length > 20
        ? `${(item.orgUnitName as string).substring(0, 20)}…`
        : (item.orgUnitName ?? "—"),
    fullName: item.orgUnitName ?? "—",
    value: item.count as number,
  }));
  const orgUnitsByType = mapData(stats?.orgUnitsByType as any[], "unitType", orgUnitTypeLabels);

  const exportHeaders = ["Đơn vị", "Số nhân sự"];
  const exportRows = byOrgUnit.map((i) => [i.fullName, i.value] as Array<string | number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportButton filename="bao-cao-co-cau-don-vi" headers={exportHeaders} rows={exportRows} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Nhân sự theo đơn vị (Top 20)">
          {isLoading ? <LoadingChart /> : <BarChartView data={byOrgUnit} />}
        </ChartCard>
        <ChartCard title="Đơn vị theo loại hình">
          {isLoading ? <LoadingChart /> : <PieChartView data={orgUnitsByType} />}
        </ChartCard>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Chi tiết nhân sự theo đơn vị</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            headers={["STT", "Đơn vị", "Số nhân sự"]}
            rows={byOrgUnit.map((item, i) => [i + 1, item.fullName, item.value])}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportGroupByQualification({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const byEducation = mapData(stats?.byEducationLevel as any[], "level", educationLabels);
  const byRank = mapData(stats?.byAcademicRank as any[], "rank", academicRankLabels);
  const byTitle = mapData(stats?.byAcademicTitle as any[], "title", {});

  const exportHeaders = ["Phân loại", "Giá trị", "Số lượng"];
  const exportRows: Array<Array<string | number>> = [
    ...byEducation.map((i) => ["Trình độ", i.name, i.value]),
    ...byRank.map((i) => ["Học hàm", i.name, i.value]),
    ...byTitle.map((i) => ["Chức danh", i.name, i.value]),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportButton
          filename="bao-cao-trinh-do-hoc-ham"
          headers={exportHeaders}
          rows={exportRows}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Theo trình độ học vấn">
          {isLoading ? <LoadingChart /> : <BarChartView data={byEducation} />}
        </ChartCard>
        <ChartCard title="Theo học hàm">
          {isLoading ? <LoadingChart /> : <PieChartView data={byRank} />}
        </ChartCard>
        <ChartCard title="Theo chức danh">
          {isLoading ? <LoadingChart /> : <BarChartView data={byTitle} />}
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trình độ học vấn</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Trình độ", "Số lượng"]}
              rows={byEducation.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Học hàm</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Học hàm", "Số lượng"]}
              rows={byRank.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chức danh</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Chức danh", "Số lượng"]}
              rows={byTitle.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportGroupAppointments({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const appointments = ((stats?.appointmentsByMonth as any[]) ?? []).map((i) => ({
    name: i.month as string,
    value: i.count as number,
  }));
  const dismissals = ((stats?.dismissalsByMonth as any[]) ?? []).map((i) => ({
    name: i.month as string,
    value: i.count as number,
  }));
  const appointmentsByOrgUnit = ((stats?.appointmentsByOrgUnit as any[]) ?? []).map((i) => ({
    name: i.orgUnitName as string,
    value: i.count as number,
  }));

  const allMonths = Array.from(
    new Set([...appointments.map((a) => a.name), ...dismissals.map((d) => d.name)]),
  ).sort();
  const combinedData = allMonths.map((month) => ({
    month,
    appointments: appointments.find((a) => a.name === month)?.value ?? 0,
    dismissals: dismissals.find((d) => d.name === month)?.value ?? 0,
  }));

  const exportHeaders = ["Tháng", "Bổ nhiệm", "Bãi nhiệm"];
  const exportRows = combinedData.map(
    (d) => [d.month, d.appointments, d.dismissals] as Array<string | number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportButton filename="bao-cao-bo-nhiem" headers={exportHeaders} rows={exportRows} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Bổ nhiệm / Bãi nhiệm theo tháng">
          {isLoading ? (
            <LoadingChart />
          ) : (
            <MultiLineChartView
              data={combinedData}
              lines={[
                { dataKey: "appointments", name: "Bổ nhiệm", color: "#6366f1" },
                { dataKey: "dismissals", name: "Bãi nhiệm", color: "#ef4444" },
              ]}
            />
          )}
        </ChartCard>
        <ChartCard title="Bổ nhiệm theo đơn vị (Top 10)">
          {isLoading ? <LoadingChart /> : <BarChartView data={appointmentsByOrgUnit} />}
        </ChartCard>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Chi tiết bổ nhiệm / bãi nhiệm theo tháng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable headers={exportHeaders} rows={exportRows} />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportGroupTraining({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const trainingByStatus = mapData(
    stats?.trainingByStatus as any[],
    "status",
    trainingStatusLabels,
  );
  const registrationsByStatus = mapData(
    stats?.registrationsByStatus as any[],
    "status",
    participationStatusLabels,
  );
  const resultsByStatus = mapData(
    stats?.trainingResultsByStatus as any[],
    "status",
    resultStatusLabels,
  );

  const exportHeaders = ["Phân loại", "Trạng thái", "Số lượng"];
  const exportRows: Array<Array<string | number>> = [
    ["Tổng khóa đào tạo", "", (stats?.totalCourses as number) ?? 0],
    ["Tổng lượt đăng ký", "", (stats?.totalRegistrations as number) ?? 0],
    ...trainingByStatus.map((i) => ["Khóa đào tạo", i.name, i.value]),
    ...registrationsByStatus.map((i) => ["Đăng ký", i.name, i.value]),
    ...resultsByStatus.map((i) => ["Kết quả", i.name, i.value]),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Tổng khóa đào tạo"
            value={(stats?.totalCourses as number) ?? 0}
            icon={GraduationCap}
            loading={isLoading}
          />
          <StatCard
            title="Tổng lượt đăng ký"
            value={(stats?.totalRegistrations as number) ?? 0}
            icon={BookOpen}
            loading={isLoading}
          />
        </div>
        <ExportButton filename="bao-cao-dao-tao" headers={exportHeaders} rows={exportRows} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ChartCard title="Khóa đào tạo theo trạng thái">
          {isLoading ? <LoadingChart /> : <PieChartView data={trainingByStatus} />}
        </ChartCard>
        <ChartCard title="Đăng ký theo trạng thái">
          {isLoading ? <LoadingChart /> : <PieChartView data={registrationsByStatus} />}
        </ChartCard>
        <ChartCard title="Kết quả đào tạo">
          {isLoading ? <LoadingChart /> : <PieChartView data={resultsByStatus} />}
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Khóa đào tạo</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Trạng thái", "Số lượng"]}
              rows={trainingByStatus.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lượt đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Trạng thái", "Số lượng"]}
              rows={registrationsByStatus.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Kết quả", "Số lượng"]}
              rows={resultsByStatus.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportGroupContracts({
  stats,
  isLoading,
}: { stats: Record<string, unknown>; isLoading: boolean }) {
  const byContractStatus = mapData(
    stats?.byContractStatus as any[],
    "status",
    contractStatusLabels,
  );
  const byDocStatus = mapData(
    stats?.contractsByDocStatus as any[],
    "status",
    contractDocStatusLabels,
  );
  const byType = ((stats?.contractsByType as any[]) ?? []).map((i) => ({
    name: i.contractTypeName as string,
    value: i.count as number,
  }));

  const exportHeaders = ["Phân loại", "Giá trị", "Số lượng"];
  const exportRows: Array<Array<string | number>> = [
    ["Tổng hợp đồng", "", (stats?.totalContracts as number) ?? 0],
    ...byContractStatus.map((i) => ["Trạng thái NV", i.name, i.value]),
    ...byDocStatus.map((i) => ["Trạng thái HĐ", i.name, i.value]),
    ...byType.map((i) => ["Loại HĐ", i.name, i.value]),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <StatCard
          title="Tổng hợp đồng"
          value={(stats?.totalContracts as number) ?? 0}
          icon={ClipboardList}
          loading={isLoading}
        />
        <ExportButton filename="bao-cao-hop-dong" headers={exportHeaders} rows={exportRows} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ChartCard title="Trạng thái hợp đồng nhân viên">
          {isLoading ? <LoadingChart /> : <PieChartView data={byContractStatus} />}
        </ChartCard>
        <ChartCard title="Trạng thái văn bản hợp đồng">
          {isLoading ? <LoadingChart /> : <PieChartView data={byDocStatus} />}
        </ChartCard>
        <ChartCard title="Hợp đồng theo loại">
          {isLoading ? <LoadingChart /> : <BarChartView data={byType} />}
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tình trạng hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Trạng thái", "Số lượng"]}
              rows={[...byContractStatus.map((i) => [i.name, i.value])]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Phân loại hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Loại hợp đồng", "Số lượng"]}
              rows={byType.map((i) => [i.name, i.value])}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const REPORT_GROUPS = [
  { value: "overview", label: "Tổng quan nhân sự", icon: Users },
  { value: "turnover", label: "Biến động nhân sự", icon: TrendingUp },
  { value: "org-unit", label: "Cơ cấu theo đơn vị", icon: Building2 },
  { value: "qualification", label: "Trình độ, học hàm, chức danh", icon: GraduationCap },
  { value: "appointment", label: "Bổ nhiệm nhân sự", icon: UserCheck },
  { value: "training", label: "Đào tạo và phát triển", icon: BookOpen },
  { value: "contract", label: "Hợp đồng và tình trạng", icon: FileText },
] as const;

function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery(statisticsOptions());
  const stats = (data?.data ?? {}) as Record<string, unknown>;

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Báo cáo và Thống kê"
          description="Tổng quan Hệ thống Quản lý Nhân sự — Trường Đại học Thủy Lợi"
        />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Báo cáo và Thống kê"
        description="Tổng quan Hệ thống Quản lý Nhân sự — Trường Đại học Thủy Lợi"
      />

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex flex-wrap gap-1">
          {REPORT_GROUPS.map((group) => (
            <TabsTrigger key={group.value} value={group.value} className="gap-1.5">
              <group.icon className="h-4 w-4" />
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <ReportGroupOverview stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="turnover">
          <ReportGroupTurnover stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="org-unit">
          <ReportGroupByOrgUnit stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="qualification">
          <ReportGroupByQualification stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="appointment">
          <ReportGroupAppointments stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="training">
          <ReportGroupTraining stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="contract">
          <ReportGroupContracts stats={stats} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
