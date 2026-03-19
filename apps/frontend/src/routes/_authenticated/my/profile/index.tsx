import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import { Button } from "@/components/ui/button";
import { getFileUrl, useMyEmployeeDetail } from "@/features/employees/api";
import { formatDate } from "@/lib/date-utils";
import { Gender } from "@hrms/shared";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my/profile/")({
  component: GeneralInfoTab,
});

function GeneralInfoTab() {
  const { aggregate, employee: emp, isLoading } = useMyEmployeeDetail();
  const partyMemberships = aggregate?.partyMemberships;
  const bankAccounts = aggregate?.bankAccounts;
  const foreignWorkPermits = aggregate?.foreignWorkPermits;

  if (isLoading) return <FormSkeleton fields={6} />;
  if (!emp) return null;

  const genderLabel = Gender[emp.gender as keyof typeof Gender]?.label ?? emp.gender;

  const party = partyMemberships?.[0];
  const bank = bankAccounts?.find((x) => x.isPrimary) ?? bankAccounts?.[0];
  const permit = foreignWorkPermits?.[0];

  return (
    <div className="rounded-xl border bg-white p-6 space-y-5">
      {/* ── Photo + Rows 1–2 ── */}
      <div className="flex gap-6">
        <div className="shrink-0 flex items-center justify-center w-[120px] h-[120px] rounded-lg bg-muted/60 overflow-hidden">
          {emp.portraitFileId ? (
            <img
              src={getFileUrl(emp.portraitFileId)}
              alt={emp.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Plus className="h-8 w-8 text-white" />
          )}
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
        <ReadOnlyField label="Số Visa" value={permit?.visaNo} />
        <ReadOnlyField label="Ngày hết hạn Visa" value={formatDate(permit?.visaExpiresOn)} />
        <ReadOnlyField label="Số Hộ chiếu" value={permit?.passportNo} />
        <ReadOnlyField
          label="Ngày hết hạn Hộ chiếu"
          value={formatDate(permit?.passportExpiresOn)}
        />
      </div>

      {/* ── Row 7: Giấy phép lao động + Xem PDF ── */}
      <div className="flex items-end gap-6">
        <ReadOnlyField
          label="Số giấy phép lao động"
          value={permit?.workPermitNo}
          className="flex-1"
        />
        <ReadOnlyField
          label="Ngày hết hạn giấy phép lao động"
          value={formatDate(permit?.workPermitExpiresOn)}
          className="flex-1"
        />
        <Button
          className="gap-2 shrink-0"
          disabled={!permit?.workPermitFileId}
          onClick={() =>
            permit?.workPermitFileId && window.open(getFileUrl(permit.workPermitFileId), "_blank")
          }
        >
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
