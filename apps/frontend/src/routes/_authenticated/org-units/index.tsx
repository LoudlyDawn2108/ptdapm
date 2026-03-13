import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { OrgUnitType, OrgUnitStatus } from "@hrms/shared";
import { Plus, Building2, ChevronRight, ChevronDown } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export const Route = createFileRoute("/_authenticated/org-units/")({
  component: OrgUnitsPage,
});

function OrgUnitNode({ node, level = 0 }: { node: any; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children?.length > 0;
  const typeLabel =
    OrgUnitType[node.unitType as keyof typeof OrgUnitType]?.label ??
    node.unitType;
  const statusLabel =
    OrgUnitStatus[node.status as keyof typeof OrgUnitStatus]?.label ??
    node.status;

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50 cursor-pointer"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <Building2 className="h-4 w-4 shrink-0 text-primary" />
        <span className="font-medium text-sm">{node.unitName}</span>
        <span className="text-xs text-muted-foreground">({typeLabel})</span>
        <StatusBadgeFromCode
          code={node.status}
          label={statusLabel}
          className="ml-auto text-xs"
        />
      </div>
      {expanded &&
        hasChildren &&
        node.children.map((child: any) => (
          <OrgUnitNode key={child.id} node={child} level={level + 1} />
        ))}
    </div>
  );
}

function OrgUnitsPage() {
  const { data, isLoading } = useQuery(orgUnitTreeOptions());
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText);
  const tree = data?.data ?? [];

  // Simple client-side filter for tree
  const filterTree = (nodes: any[], search: string): any[] => {
    if (!search) return nodes;
    return nodes
      .map((node) => {
        const matchesName = node.unitName
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const filteredChildren = filterTree(node.children ?? [], search);
        if (matchesName || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredTree = filterTree(tree, debouncedSearch);

  return (
    <div>
      <PageHeader
        title="Đơn vị tổ chức"
        description="Cơ cấu tổ chức trường Đại học Thủy Lợi"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm đơn vị
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm đơn vị..."
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cây tổ chức</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`s-${i}`} className="h-8 w-full" />
              ))}
            </div>
          ) : filteredTree.length > 0 ? (
            filteredTree.map((node: any) => (
              <OrgUnitNode key={node.id} node={node} />
            ))
          ) : (
            <EmptyState description="Không tìm thấy đơn vị nào" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
