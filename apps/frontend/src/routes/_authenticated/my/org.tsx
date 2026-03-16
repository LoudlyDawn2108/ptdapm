import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { QueryError } from "@/components/shared/query-error";
import { ReadOnlyField } from "@/components/shared/read-only-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { useEmployeeDetail } from "@/features/employees/api";
import { OrgUnitStatus, OrgUnitType } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/my/org")({
  component: MyOrgPage,
});

type OrgNode = {
  id: string;
  unitName: string;
  unitCode: string;
  unitType: string;
  status: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  children?: OrgNode[];
};

function MyOrgPage() {
  const { user } = useAuth();
  const { data: treeData, isLoading, isError, error, refetch } = useQuery(orgUnitTreeOptions());

  const allUnits = useMemo(() => {
    const flatten = (nodes: OrgNode[] | undefined, acc: OrgNode[] = []) => {
      for (const n of nodes ?? []) {
        acc.push(n);
        flatten(n.children, acc);
      }
      return acc;
    };
    return flatten((treeData?.data ?? []) as OrgNode[]);
  }, [treeData?.data]);

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Đơn vị công tác"
          description="Thông tin đơn vị công tác của bạn"
        />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Đơn vị công tác"
          description="Thông tin đơn vị công tác của bạn"
        />
        <FormSkeleton fields={6} />
      </div>
    );
  }

  // Find user's org unit from employeeId link (if available)
  // For now, show the first active org unit (self-service page)
  const myUnit = allUnits.length > 0 ? allUnits[0] : null;

  return (
    <div>
      <PageHeader
        title="Đơn vị công tác"
        description="Thông tin đơn vị công tác của bạn"
      />

      {myUnit ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5" />
              {myUnit.unitName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <ReadOnlyField label="Mã đơn vị" value={myUnit.unitCode} />
              <ReadOnlyField label="Tên đơn vị" value={myUnit.unitName} />
              <ReadOnlyField
                label="Loại đơn vị"
                value={OrgUnitType[myUnit.unitType as keyof typeof OrgUnitType]?.label ?? myUnit.unitType}
              />
              <ReadOnlyField
                label="Trạng thái"
                value={OrgUnitStatus[myUnit.status as keyof typeof OrgUnitStatus]?.label ?? myUnit.status}
              />
              <ReadOnlyField label="Email" value={myUnit.email} />
              <ReadOnlyField label="Số điện thoại" value={myUnit.phone} />
              <ReadOnlyField label="Địa chỉ" value={myUnit.address} />
              <ReadOnlyField label="Trang web" value={myUnit.website} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có thông tin đơn vị công tác.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
