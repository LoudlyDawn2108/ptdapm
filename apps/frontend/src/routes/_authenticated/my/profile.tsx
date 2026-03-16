import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { myEmployeeOptions } from "@/features/employees/api";
import type { EmployeeAggregate } from "@/features/employees/types";
import { formatDate } from "@/lib/date-utils";
import {
  AcademicRank,
  ContractStatus,
  EducationLevel,
  FamilyRelation,
  Gender,
  PartyOrgType,
  WorkStatus,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/my/profile")({
  component: MyProfilePage,
});

function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

function MyProfilePage() {
  const { data, isLoading } = useQuery(myEmployeeOptions());
  const [activeTab, setActiveTab] = useState("general");
  const aggregate = data?.data as EmployeeAggregate | undefined;
  const emp = aggregate?.employee;
  const salaryInfo = aggregate as
    | (EmployeeAggregate & {
        salaryGradeStep?: { gradeName?: string; stepName?: string; coefficient?: number };
      })
    | undefined;

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Hồ sơ cá nhân" />
        <FormSkeleton fields={8} />
      </div>
    );
  }

  if (!emp) {
    return (
      <div>
        <PageHeader title="Hồ sơ cá nhân" />
        <p className="text-muted-foreground">Không tìm thấy thông tin hồ sơ cá nhân.</p>
      </div>
    );
  }

  const initials = (emp.fullName ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const wsLabel = WorkStatus[emp.workStatus as keyof typeof WorkStatus]?.label ?? emp.workStatus;

  return (
    <div>
      <PageHeader title="">
        <div className="flex items-center gap-4 mb-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{emp.fullName}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Mã NV: {emp.staffCode ?? "—"}</span>
              <span>·</span>
              <StatusBadgeFromCode code={emp.workStatus} label={wsLabel} />
            </div>
          </div>
        </div>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="education">Trình độ</TabsTrigger>
          <TabsTrigger value="salary">Lương</TabsTrigger>
          <TabsTrigger value="family">Gia đình</TabsTrigger>
          <TabsTrigger value="party">Đảng/Đoàn</TabsTrigger>
        </TabsList>

        {/* ── Thông tin chung ── */}
        <TabsContent value="general" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <InfoRow label="Họ tên" value={emp.fullName} />
                  <InfoRow label="Ngày sinh" value={formatDate(emp.dob)} />
                  <InfoRow
                    label="Giới tính"
                    value={Gender[emp.gender as keyof typeof Gender]?.label ?? emp.gender}
                  />
                  <InfoRow label="CCCD/CMND" value={emp.nationalId} />
                  <InfoRow label="Quê quán" value={emp.hometown} />
                  <InfoRow label="Địa chỉ" value={emp.address} />
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <InfoRow label="Email" value={emp.email} />
                  <InfoRow label="Số điện thoại" value={emp.phone} />
                  <InfoRow label="Mã số thuế" value={emp.taxCode} />
                  <InfoRow label="Số BHXH" value={emp.socialInsuranceNo} />
                  <InfoRow label="Số BHYT" value={emp.healthInsuranceNo} />
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Trình độ ── */}
        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trình độ & Chức danh</CardTitle>
            </CardHeader>
            <CardContent>
              <dl>
                <InfoRow
                  label="Trình độ văn hóa"
                  value={
                    EducationLevel[emp.educationLevel as keyof typeof EducationLevel]?.label ??
                    emp.educationLevel
                  }
                />
                <InfoRow
                  label="Học hàm/Học vị"
                  value={
                    AcademicRank[emp.academicRank as keyof typeof AcademicRank]?.label ??
                    emp.academicRank
                  }
                />
                <InfoRow label="Đơn vị công tác" value={emp.currentOrgUnitName} />
                <InfoRow label="Chức vụ" value={emp.currentPositionTitle} />
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Lương ── */}
        <TabsContent value="salary" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hệ số lương</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <InfoRow label="Ngạch lương" value={salaryInfo?.salaryGradeStep?.gradeName} />
                  <InfoRow label="Bậc" value={salaryInfo?.salaryGradeStep?.stepName} />
                  <InfoRow
                    label="Hệ số"
                    value={salaryInfo?.salaryGradeStep?.coefficient?.toString()}
                  />
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin ngân hàng</CardTitle>
              </CardHeader>
              <CardContent>
                {aggregate?.bankAccounts && aggregate.bankAccounts.length > 0 ? (
                  <dl>
                    {aggregate.bankAccounts.map((b, i) => (
                      <div key={b.id ?? i} className="py-2 border-b last:border-0 space-y-1">
                        <InfoRow label="Ngân hàng" value={b.bankName} />
                        <InfoRow label="Số tài khoản" value={b.accountNo} />
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa có thông tin ngân hàng.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Gia đình ── */}
        <TabsContent value="family" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin gia đình</CardTitle>
            </CardHeader>
            <CardContent>
              {aggregate?.familyMembers && aggregate.familyMembers.length > 0 ? (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="py-2 pr-4">Quan hệ</th>
                        <th className="py-2">Họ tên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aggregate.familyMembers.map((m, i) => (
                        <tr key={m.id ?? i} className="border-b last:border-0">
                          <td className="py-2 pr-4">
                            {FamilyRelation[m.relation as keyof typeof FamilyRelation]?.label ??
                              m.relation}
                          </td>
                          <td className="py-2 font-medium">{m.fullName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có thông tin gia đình.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Đảng/Đoàn ── */}
        <TabsContent value="party" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin Đảng/Đoàn</CardTitle>
            </CardHeader>
            <CardContent>
              {aggregate?.partyMemberships && aggregate.partyMemberships.length > 0 ? (
                <dl>
                  {aggregate.partyMemberships.map((m, i) => (
                    <div key={m.id ?? i} className="py-2 border-b last:border-0 space-y-1">
                      <InfoRow
                        label="Tổ chức"
                        value={
                          PartyOrgType[m.organizationType as keyof typeof PartyOrgType]?.label ??
                          m.organizationType
                        }
                      />
                      <InfoRow label="Ngày gia nhập" value={formatDate(m.joinedOn)} />
                      <InfoRow label="Chi tiết" value={m.details} />
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có thông tin Đảng/Đoàn.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
