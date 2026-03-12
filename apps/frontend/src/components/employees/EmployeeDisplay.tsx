import { displayValue, toLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  AcademicRank,
  AcademicTitle,
  ContractStatus,
  EducationLevel,
  Gender,
  TrainingLevel,
  WorkStatus,
} from "@hrms/shared";
import * as React from "react";

export interface EmployeeDisplayData {
  staffCode?: string | null;
  fullName?: string | null;
  dob?: string | null;
  gender?: keyof typeof Gender | null;
  nationalId?: string | null;
  hometown?: string | null;
  address?: string | null;
  taxCode?: string | null;
  socialInsuranceNo?: string | null;
  healthInsuranceNo?: string | null;
  email?: string | null;
  phone?: string | null;
  isForeigner?: boolean | null;
  educationLevel?: keyof typeof EducationLevel | null;
  trainingLevel?: keyof typeof TrainingLevel | null;
  academicTitle?: keyof typeof AcademicTitle | null;
  academicRank?: keyof typeof AcademicRank | null;
  workStatus?: keyof typeof WorkStatus | null;
  contractStatus?: keyof typeof ContractStatus | null;
  currentOrgUnitId?: string | null;
  currentPositionTitle?: string | null;
}

interface EmployeeDisplayProps {
  data: EmployeeDisplayData;
  className?: string;
}

export function EmployeeDisplay({ data, className }: EmployeeDisplayProps) {
  const infoGroups = [
    {
      title: "Thông tin cơ bản",
      items: [
        { label: "Mã cán bộ", value: displayValue(data.staffCode) },
        { label: "Họ và tên", value: displayValue(data.fullName) },
        { label: "Ngày sinh", value: displayValue(data.dob) },
        { label: "Giới tính", value: toLabel(Gender, data.gender ?? undefined) },
        { label: "Số CCCD/CMND", value: displayValue(data.nationalId) },
        { label: "Quê quán", value: displayValue(data.hometown) },
        { label: "Địa chỉ", value: displayValue(data.address) },
      ],
    },
    {
      title: "Thông tin liên hệ",
      items: [
        { label: "Email", value: displayValue(data.email) },
        { label: "Số điện thoại", value: displayValue(data.phone) },
        { label: "Mã số thuế", value: displayValue(data.taxCode) },
        { label: "Số BHXH", value: displayValue(data.socialInsuranceNo) },
        { label: "Số BHYT", value: displayValue(data.healthInsuranceNo) },
        { label: "Người nước ngoài", value: displayValue(data.isForeigner) },
      ],
    },
    {
      title: "Thông tin học vấn & công tác",
      items: [
        { label: "Trình độ văn hóa", value: toLabel(EducationLevel, data.educationLevel) },
        { label: "Trình độ đào tạo", value: toLabel(TrainingLevel, data.trainingLevel) },
        { label: "Chức danh nghề nghiệp", value: toLabel(AcademicTitle, data.academicTitle) },
        { label: "Học hàm", value: toLabel(AcademicRank, data.academicRank) },
        { label: "Trạng thái làm việc", value: toLabel(WorkStatus, data.workStatus) },
        { label: "Trạng thái hợp đồng", value: toLabel(ContractStatus, data.contractStatus) },
        { label: "Đơn vị công tác", value: displayValue(data.currentOrgUnitId) },
        { label: "Chức vụ hiện tại", value: displayValue(data.currentPositionTitle) },
      ],
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {infoGroups.map((group) => (
        <section key={group.title} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">{group.title}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
