import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { contractTypeListOptions } from "@/features/config/contract-types/api";
import { useMyEmployeeDetail } from "@/features/employees/api";
import type { EmploymentContract } from "@/features/employees/types";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { formatDate } from "@/lib/date-utils";
import { ContractDocStatus } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/my/profile/contracts")({
  component: ContractsTab,
});

/** Contract with optional joined display names from the API */
type ContractRow = EmploymentContract & {
  contractTypeName?: string;
  orgUnitName?: string;
};

type OrgUnitNode = { id: string; unitName: string; children?: OrgUnitNode[] };

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active" || status === "valid";

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Đang hoạt động
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Ngừng sử dụng
    </span>
  );
}

function ContractsTab() {
  const { aggregate, isLoading } = useMyEmployeeDetail();
  const { data: contractTypesData } = useQuery(
    contractTypeListOptions({ page: 1, pageSize: 100, search: undefined }),
  );
  const { data: orgUnitsData } = useQuery(orgUnitTreeOptions());
  const [viewingContract, setViewingContract] = useState<ContractRow | null>(null);
  const contracts = aggregate?.contracts as ContractRow[] | undefined;
  const contractTypes = (contractTypesData?.data?.items ?? []) as Array<{
    id: string;
    contractTypeName: string;
  }>;

  const orgUnitOptions = useMemo(() => {
    const flatten = (
      nodes: OrgUnitNode[] | undefined,
      acc: Array<{ id: string; unitName: string }> = [],
    ) => {
      for (const node of nodes ?? []) {
        acc.push({ id: node.id, unitName: node.unitName });
        flatten(node.children, acc);
      }
      return acc;
    };

    return flatten((orgUnitsData?.data ?? []) as OrgUnitNode[]);
  }, [orgUnitsData?.data]);

  const contractTypeMap = useMemo(
    () => new Map(contractTypes.map((item) => [item.id, item.contractTypeName])),
    [contractTypes],
  );
  const orgUnitMap = useMemo(
    () => new Map(orgUnitOptions.map((item) => [item.id, item.unitName])),
    [orgUnitOptions],
  );

  if (isLoading) return <FormSkeleton fields={3} />;

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Table */}
      {contracts && contracts.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại hợp đồng</th>
                <th className="px-4 py-3 text-left font-medium">Ngày ký</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hiệu lực</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hết hạn</th>
                <th className="px-4 py-3 text-left font-medium">Đơn vị công tác</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, i) => (
                <tr key={c.id ?? i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    {c.contractTypeName ?? contractTypeMap.get(c.contractTypeId) ?? "—"}
                  </td>
                  <td className="px-4 py-3">{formatDate(c.signedOn)}</td>
                  <td className="px-4 py-3">{formatDate(c.effectiveFrom)}</td>
                  <td className="px-4 py-3">{formatDate(c.effectiveTo)}</td>
                  <td className="px-4 py-3">
                    {c.orgUnitName ?? orgUnitMap.get(c.orgUnitId) ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setViewingContract(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">Chưa có hợp đồng nào.</p>
      )}

      <ContractDetailDialog
        contract={viewingContract}
        onOpenChange={(open) => {
          if (!open) setViewingContract(null);
        }}
        contractTypeName={
          viewingContract
            ? (viewingContract.contractTypeName ??
              contractTypeMap.get(viewingContract.contractTypeId))
            : undefined
        }
        orgUnitName={
          viewingContract
            ? (viewingContract.orgUnitName ?? orgUnitMap.get(viewingContract.orgUnitId))
            : undefined
        }
      />
    </div>
  );
}

function ContractDetailDialog({
  contract,
  onOpenChange,
  contractTypeName,
  orgUnitName,
}: {
  contract: ContractRow | null;
  onOpenChange: (open: boolean) => void;
  contractTypeName?: string;
  orgUnitName?: string;
}) {
  const statusLabel = contract
    ? (ContractDocStatus[contract.status as keyof typeof ContractDocStatus]?.label ??
      contract.status)
    : "";

  return (
    <Dialog open={!!contract} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết hợp đồng</DialogTitle>
          <DialogDescription>Xem thông tin chi tiết của hợp đồng lao động.</DialogDescription>
        </DialogHeader>

        {contract ? (
          <div className="grid gap-3 text-sm">
            <DetailRow label="Loại hợp đồng" value={contractTypeName ?? "—"} />
            <DetailRow label="Số hợp đồng" value={contract.contractNo ?? "—"} />
            <DetailRow label="Ngày ký" value={formatDate(contract.signedOn) || "—"} />
            <DetailRow label="Ngày hiệu lực" value={formatDate(contract.effectiveFrom) || "—"} />
            <DetailRow label="Ngày hết hạn" value={formatDate(contract.effectiveTo) || "—"} />
            <DetailRow label="Đơn vị công tác" value={orgUnitName ?? "—"} />
            <DetailRow label="Trạng thái" value={statusLabel || "—"} />
            <DetailRow label="Nội dung" value={contract.contentHtml ?? "—"} multiline />
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className={multiline ? "space-y-1" : "flex items-start justify-between gap-4"}>
      <p className="font-medium text-muted-foreground">{label}</p>
      <p
        className={
          multiline ? "rounded-md border bg-muted/30 p-3 whitespace-pre-wrap" : "text-right"
        }
      >
        {value}
      </p>
    </div>
  );
}
