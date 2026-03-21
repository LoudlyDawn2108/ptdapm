import { ReadOnlyField } from "@/components/shared/read-only-field";
import { useMyEmployeeDetail } from "@/features/employees/api";
import { orgUnitDetailOptions, orgUnitTreeOptions } from "@/features/org-units/api";
import { OrgUnitStatus, OrgUnitType } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/my/org/")({
  component: GeneralInfoTab,
});

type OrgNode = {
  id: string;
  unitName: string;
  children?: OrgNode[];
};

function GeneralInfoTab() {
  const { employee } = useMyEmployeeDetail();
  const orgUnitId = employee?.currentOrgUnitId;

  const { data: orgDetail } = useQuery({
    ...orgUnitDetailOptions(orgUnitId ?? ""),
    enabled: !!orgUnitId,
  });

  // Get parent name from tree
  const { data: treeData } = useQuery(orgUnitTreeOptions());
  const parentName = useMemo(() => {
    if (!orgDetail?.data?.parentId || !treeData?.data) return null;
    const parentId = orgDetail.data.parentId;
    const flatten = (nodes: OrgNode[] | undefined, acc: OrgNode[] = []) => {
      for (const n of nodes ?? []) {
        acc.push(n);
        flatten(n.children, acc);
      }
      return acc;
    };
    const allUnits = flatten(treeData.data as OrgNode[]);
    return allUnits.find((u) => u.id === parentId)?.unitName ?? null;
  }, [orgDetail?.data?.parentId, treeData?.data]);

  const unit = orgDetail?.data;
  if (!unit) return null;

  const unitTypeLabel =
    OrgUnitType[unit.unitType as keyof typeof OrgUnitType]?.label ?? unit.unitType;
  const statusLabel =
    OrgUnitStatus[unit.status as keyof typeof OrgUnitStatus]?.label ?? unit.status;

  return (
    <div className="rounded-xl border bg-white p-6 space-y-5">
      {/* Row 1: Mã đơn vị + Tên đơn vị */}
      <div className="grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="Mã đơn vị" value={unit.unitCode} />
        <ReadOnlyField label="Tên đơn vị" value={unit.unitName} />
      </div>

      {/* Row 2: Loại đơn vị + Đơn vị cha */}
      <div className="grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="Loại đơn vị" value={unitTypeLabel} />
        <ReadOnlyField label="Đơn vị cha" value={parentName} />
      </div>

      {/* Row 3: Email + Số điện thoại */}
      <div className="grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="Email" value={unit.email} />
        <ReadOnlyField label="Số điện thoại" value={unit.phone} />
      </div>

      {/* Row 4: Link website */}
      <ReadOnlyField label="Link website" value={unit.website} />

      {/* Row 5: Địa chỉ */}
      <ReadOnlyField label="Địa chỉ" value={unit.address} />

      {/* Row 6: Địa chỉ văn phòng */}
      <ReadOnlyField label="Địa chỉ văn phòng" value={unit.officeAddress} />

      {/* Row 7: Trạng thái */}
      <ReadOnlyField label="Trạng thái" value={statusLabel} />
    </div>
  );
}
