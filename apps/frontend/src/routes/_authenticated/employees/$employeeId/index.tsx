import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { employeeDetailOptions } from "@/features/employees/api";
import {
  AcademicRank,
  AcademicTitle,
  ContractStatus,
  EducationLevel,
  FamilyRelation,
  Gender,
  PartyOrgType,
  TrainingLevel,
  WorkStatus,
  enumToSortedList,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Pencil, User } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/employees/$employeeId/")({
  component: EmployeeDetailPage,
});

/* ── Enum maps ── */
function buildMap<T extends Record<string, { code: string; label: string }>>(enumObj: T) {
  return new Map(enumToSortedList(enumObj).map((e) => [e.code, e.label]));
}

/* ── Helpers ── */

function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-3 text-center text-sm text-slate-400">
        Không có dữ liệu
      </td>
    </tr>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = value.split("T")[0];
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

/* ── Main Component ── */

function EmployeeDetailPage() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));

  const genderMap = useMemo(() => buildMap(Gender), []);
  const workStatusMap = useMemo(() => buildMap(WorkStatus), []);
  const contractStatusMap = useMemo(() => buildMap(ContractStatus), []);
  const educationLevelMap = useMemo(() => buildMap(EducationLevel), []);
  const trainingLevelMap = useMemo(() => buildMap(TrainingLevel), []);
  const academicTitleMap = useMemo(() => buildMap(AcademicTitle), []);
  const academicRankMap = useMemo(() => buildMap(AcademicRank), []);
  const familyRelationMap = useMemo(() => buildMap(FamilyRelation), []);
  const partyOrgTypeMap = useMemo(() => buildMap(PartyOrgType), []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormSkeleton fields={10} />
      </div>
    );
  }

  const aggregate = data?.data;
  const emp = aggregate?.employee;

  if (!emp) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-slate-600">Không tìm thấy thông tin nhân sự.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/employees">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const familyMembers = aggregate?.familyMembers ?? [];
  const bankAccounts = aggregate?.bankAccounts ?? [];
  const previousJobs = aggregate?.previousJobs ?? [];
  const partyMemberships = aggregate?.partyMemberships ?? [];
  const degrees = aggregate?.degrees ?? [];
  const certifications = aggregate?.certifications ?? [];

  /* ── Status pill (matches list page) ── */
  const statusTone = (code?: string) => {
    if (!code) return "muted" as const;
    if (["working", "valid", "active"].includes(code)) return "success" as const;
    if (["terminated", "expired", "locked"].includes(code)) return "danger" as const;
    if (["pending", "renewal_wait"].includes(code)) return "warning" as const;
    return "muted" as const;
  };

  const statusClasses: Record<
    "success" | "warning" | "danger" | "muted",
    { wrap: string; dot: string }
  > = {
    success: { wrap: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    warning: { wrap: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    danger: { wrap: "bg-red-50 text-red-700", dot: "bg-red-500" },
    muted: { wrap: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  };

  const StatusPill = ({ code, label }: { code?: string; label: string }) => {
    const tone = statusTone(code);
    const s = statusClasses[tone];
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${s.wrap}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        {label}
      </span>
    );
  };

  const thClass =
    "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 bg-slate-50";
  const tdClass = "px-4 py-2.5 text-sm text-slate-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9EEFF] text-[#3B5CCC]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-slate-800">{emp.fullName}</h1>
              <span className="font-mono text-xs text-slate-500">{emp.staffCode ?? "—"}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill
                code={emp.workStatus}
                label={workStatusMap.get(emp.workStatus) ?? emp.workStatus ?? "—"}
              />
              <StatusPill
                code={emp.contractStatus}
                label={contractStatusMap.get(emp.contractStatus) ?? emp.contractStatus ?? "—"}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="h-9 rounded-lg">
            <Link to="/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-lg bg-[#3B5CCC] px-4 text-white hover:bg-[#2F4FB8]"
          >
            <Link to="/employees/$employeeId/edit" params={{ employeeId }}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="space-y-8 px-6 pb-8 pt-6">
        {/* THÔNG TIN CÁ NHÂN */}
        <section>
          <SectionHeader title="THÔNG TIN CÁ NHÂN" />
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoField label="Họ tên" value={emp.fullName} />
            <InfoField label="Giới tính" value={genderMap.get(emp.gender)} />
            <InfoField label="Ngày sinh" value={formatDate(emp.dob)} />
            <InfoField label="Quê quán" value={emp.hometown} />
            <InfoField label="Email" value={emp.email} />
            <InfoField label="Số điện thoại" value={emp.phone} />
            <InfoField label="Địa chỉ" value={emp.address} />
            <InfoField label="Số CCCD/CMND" value={emp.nationalId} />
            <InfoField label="Mã số thuế" value={emp.taxCode} />
            <InfoField label="Bảo hiểm xã hội" value={emp.socialInsuranceNo} />
            <InfoField label="Bảo hiểm y tế" value={emp.healthInsuranceNo} />
          </div>
        </section>

        {/* TRÌNH ĐỘ HỌC VẤN */}
        <section>
          <SectionHeader title="TRÌNH ĐỘ HỌC VẤN" />
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoField
              label="Trình độ văn hóa"
              value={educationLevelMap.get(emp.educationLevel ?? "")}
            />
            <InfoField
              label="Trình độ đào tạo"
              value={trainingLevelMap.get(emp.trainingLevel ?? "")}
            />
            <InfoField
              label="Chức danh nghề nghiệp"
              value={academicTitleMap.get(emp.academicTitle ?? "")}
            />
            <InfoField label="Học hàm/học vị" value={academicRankMap.get(emp.academicRank ?? "")} />
          </div>
        </section>

        {/* ĐƠN VỊ & TRẠNG THÁI */}
        <section>
          <SectionHeader title="ĐƠN VỊ & TRẠNG THÁI" />
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoField label="Đơn vị công tác" value={emp.currentOrgUnitId ?? undefined} />
            <InfoField label="Chức vụ" value={emp.currentPositionTitle} />
            <InfoField label="Trạng thái làm việc" value={workStatusMap.get(emp.workStatus)} />
            <InfoField
              label="Trạng thái hợp đồng"
              value={contractStatusMap.get(emp.contractStatus)}
            />
          </div>
        </section>

        {/* THÔNG TIN GIA ĐÌNH */}
        <section>
          <SectionHeader title="THÔNG TIN GIA ĐÌNH" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={thClass}>Quan hệ</th>
                  <th className={thClass}>Họ tên</th>
                  <th className={thClass}>Ngày sinh</th>
                  <th className={thClass}>Số điện thoại</th>
                  <th className={thClass}>Người phụ thuộc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {familyMembers.length === 0 ? (
                  <EmptyRow colSpan={5} />
                ) : (
                  familyMembers.map((fm) => (
                    <tr key={fm.id}>
                      <td className={tdClass}>
                        {familyRelationMap.get(fm.relation) ?? fm.relation}
                      </td>
                      <td className={tdClass}>{fm.fullName}</td>
                      <td className={tdClass}>{formatDate(fm.dob)}</td>
                      <td className={tdClass}>{fm.phone || "—"}</td>
                      <td className={tdClass}>{fm.isDependent ? "Có" : "Không"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* THÔNG TIN NGÂN HÀNG */}
        <section>
          <SectionHeader title="THÔNG TIN NGÂN HÀNG" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={thClass}>Ngân hàng</th>
                  <th className={thClass}>Số tài khoản</th>
                  <th className={thClass}>Tài khoản chính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bankAccounts.length === 0 ? (
                  <EmptyRow colSpan={3} />
                ) : (
                  bankAccounts.map((ba) => (
                    <tr key={ba.id}>
                      <td className={tdClass}>{ba.bankName}</td>
                      <td className={`${tdClass} font-mono`}>{ba.accountNo}</td>
                      <td className={tdClass}>{ba.isPrimary ? "Có" : "Không"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* QUÁ TRÌNH CÔNG TÁC */}
        <section>
          <SectionHeader title="QUÁ TRÌNH CÔNG TÁC" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={thClass}>Nơi làm việc</th>
                  <th className={thClass}>Từ ngày</th>
                  <th className={thClass}>Đến ngày</th>
                  <th className={thClass}>Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previousJobs.length === 0 ? (
                  <EmptyRow colSpan={4} />
                ) : (
                  previousJobs.map((pj) => (
                    <tr key={pj.id}>
                      <td className={tdClass}>{pj.workplace}</td>
                      <td className={tdClass}>{formatDate(pj.startedOn)}</td>
                      <td className={tdClass}>{formatDate(pj.endedOn)}</td>
                      <td className={tdClass}>{pj.note || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* THÔNG TIN ĐOÀN/ĐẢNG */}
        <section>
          <SectionHeader title="THÔNG TIN ĐOÀN/ĐẢNG" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={thClass}>Loại tổ chức</th>
                  <th className={thClass}>Ngày gia nhập</th>
                  <th className={thClass}>Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partyMemberships.length === 0 ? (
                  <EmptyRow colSpan={3} />
                ) : (
                  partyMemberships.map((pm) => (
                    <tr key={pm.id}>
                      <td className={tdClass}>
                        {partyOrgTypeMap.get(pm.organizationType) ?? pm.organizationType}
                      </td>
                      <td className={tdClass}>{formatDate(pm.joinedOn)}</td>
                      <td className={tdClass}>{pm.details || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* THÔNG TIN BẰNG CẤP */}
        <section>
          <SectionHeader title="THÔNG TIN BẰNG CẤP" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={thClass}>Tên bằng cấp</th>
                  <th className={thClass}>Trường</th>
                  <th className={thClass}>Chuyên ngành</th>
                  <th className={thClass}>Năm tốt nghiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {degrees.length === 0 ? (
                  <EmptyRow colSpan={4} />
                ) : (
                  degrees.map((d) => (
                    <tr key={d.id}>
                      <td className={tdClass}>{d.degreeName}</td>
                      <td className={tdClass}>{d.school}</td>
                      <td className={tdClass}>{d.major || "—"}</td>
                      <td className={tdClass}>{d.graduationYear ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* THÔNG TIN CHỨNG CHỈ */}
        <section>
          <SectionHeader title="THÔNG TIN CHỨNG CHỈ" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={thClass}>Tên chứng chỉ</th>
                  <th className={thClass}>Nơi cấp</th>
                  <th className={thClass}>Ngày cấp</th>
                  <th className={thClass}>Ngày hết hạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certifications.length === 0 ? (
                  <EmptyRow colSpan={4} />
                ) : (
                  certifications.map((c) => (
                    <tr key={c.id}>
                      <td className={tdClass}>{c.certName}</td>
                      <td className={tdClass}>{c.issuedBy || "—"}</td>
                      <td className={tdClass}>{formatDate(c.issuedOn)}</td>
                      <td className={tdClass}>{formatDate(c.expiresOn)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
