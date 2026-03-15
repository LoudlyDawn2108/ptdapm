import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import { Button } from "@/components/ui/button";
import { employeeDetailOptions } from "@/features/employees/api";
import { formatDate } from "@/lib/date-utils";
import { Gender } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/")({
  component: GeneralInfoTab,
});

function GeneralInfoTab() {
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));

  const aggregate = data?.data as any;
  const emp = aggregate?.employee;
  const partyMemberships = aggregate?.partyMemberships as any[] | undefined;
  const bankAccounts = aggregate?.bankAccounts as any[] | undefined;
  const foreignWorkPermits = aggregate?.foreignWorkPermits as any[] | undefined;

  if (isLoading) return <FormSkeleton fields={6} />;
  if (!emp) return null;

  const genderLabel = Gender[emp.gender as keyof typeof Gender]?.label ?? emp.gender;

  const party = partyMemberships?.[0];
  const bank = bankAccounts?.[0];
  const permit = foreignWorkPermits?.[0];

  return (
    <div className="rounded-xl border bg-white p-6 space-y-5">
      {/* ── Photo + Rows 1–2 ── */}
      <div className="flex gap-6">
        {/* Photo placeholder */}
        <div className="shrink-0 flex items-center justify-center w-[120px] h-[120px] rounded-lg bg-muted/60">
          <Plus className="h-8 w-8 text-white" />
        </div>

        {/* Rows 1-2: 3-col grid beside photo */}
        <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-4">
          <ReadOnlyField label="Họ tên" value={emp.fullName} />
          <ReadOnlyField label="Giới tính" value={genderLabel} />
          <ReadOnlyField label="Ngày sinh" value={formatDate(emp.dob)} />
          <ReadOnlyField label="Quê quán" value={emp.hometown} />
          <ReadOnlyField label="Email" value={emp.email} />
          <ReadOnlyField label="Số điện thoại" value={emp.phone} />
        </div>
      </div>

      {/* ── Row 3: Địa chỉ (2-col span) + CCCD ── */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        <ReadOnlyField label="Địa chỉ" value={emp.address} className="col-span-2" />
        <ReadOnlyField label="CCCD" value={emp.nationalId} />
      </div>

      {/* ── Row 4: Thuế, BHXH, BHYT ── */}
      <div className="grid grid-cols-3 gap-x-6">
        <ReadOnlyField label="Mã số thuế" value={emp.taxCode} />
        <ReadOnlyField label="Số bảo hiểm xã hội" value={emp.socialInsuranceNo} />
        <ReadOnlyField label="Số bảo hiểm y tế" value={emp.healthInsuranceNo} />
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Rows 5–6: Visa & Hộ chiếu ── */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ReadOnlyField label="Số Visa" value={emp.visaNumber} />
        <ReadOnlyField label="Ngày hết hạn Visa" value={formatDate(emp.visaExpiry)} />
        <ReadOnlyField label="Số Hộ chiếu" value={emp.passportNumber} />
        <ReadOnlyField label="Ngày hết hạn Hộ chiếu" value={formatDate(emp.passportExpiry)} />
      </div>

      {/* ── Row 7: Giấy phép lao động + Xem PDF ── */}
      <div className="flex items-end gap-6">
        <ReadOnlyField
          label="Số giấy phép lao động"
          value={permit?.permitNumber}
          className="flex-1"
        />
        <ReadOnlyField
          label="Ngày hết hạn giấy phép lao động"
          value={formatDate(permit?.expiryDate)}
          className="flex-1"
        />
        <Button className="gap-2 shrink-0">
          <Eye className="h-4 w-4" />
          Xem PDF
        </Button>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Row 8: Đảng / Đoàn ── */}
      <div className="grid grid-cols-2 gap-x-6">
        <ReadOnlyField label="Thông tin Đảng/Đoàn" value={party?.organizationType} />
        <ReadOnlyField label="Ngày vào Đảng/Đoàn" value={formatDate(party?.joinedOn)} />
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Row 9: Ngân hàng ── */}
      <div className="grid grid-cols-2 gap-x-6">
        <ReadOnlyField label="Số tài khoản" value={bank?.accountNo} />
        <ReadOnlyField label="Tên ngân hàng" value={bank?.bankName} />
      </div>
    </div>
  );
}
