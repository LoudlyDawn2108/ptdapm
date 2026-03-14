import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryError } from "@/components/shared/query-error";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { orgUnitStrings as t } from "@/features/org-units/strings";
import { useDebounce } from "@/hooks/use-debounce";
import { ORG_TREE_BASE_PADDING_PX, ORG_TREE_INDENT_PX, SKELETON_ROW_COUNT } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { OrgUnitStatus, OrgUnitType } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/org-units/")({
  beforeLoad: authorizeRoute("/org-units"),
  component: OrgUnitsPage,
});

function OrgUnitNode({ node, level = 0 }: { node: any; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children?.length > 0;
  const typeLabel = OrgUnitType[node.unitType as keyof typeof OrgUnitType]?.label ?? node.unitType;
  const statusLabel =
    OrgUnitStatus[node.status as keyof typeof OrgUnitStatus]?.label ?? node.status;

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50 cursor-pointer"
        style={{ paddingLeft: `${level * ORG_TREE_INDENT_PX + ORG_TREE_BASE_PADDING_PX}px` }}
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
        <StatusBadgeFromCode code={node.status} label={statusLabel} className="ml-auto text-xs" />
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
  const { data, isLoading, isError, error, refetch } = useQuery(orgUnitTreeOptions());
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText);
  const tree = data?.data ?? [];

  // Simple client-side filter for tree
  const filterTree = (nodes: any[], search: string): any[] => {
    if (!search) return nodes;
    return nodes
      .map((node) => {
        const matchesName = node.unitName?.toLowerCase().includes(search.toLowerCase());
        const filteredChildren = filterTree(node.children ?? [], search);
        if (matchesName || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredTree = filterTree(tree, debouncedSearch);

  if (isError) {
    return (
      <div>
        <PageHeader title={t.page.title} description={t.page.description} />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t.page.title}
        description={t.page.description}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t.page.addButton}
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder={t.page.searchPlaceholder}
          className="max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.page.treeTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <Skeleton key={`s-${i}`} className="h-8 w-full" />
              ))}
            </div>
          ) : filteredTree.length > 0 ? (
            filteredTree.map((node: any) => <OrgUnitNode key={node.id} node={node} />)
          ) : (
            <EmptyState description={t.page.emptySearch} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
