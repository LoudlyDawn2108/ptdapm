import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryError } from "@/components/shared/query-error";
import { StatusBadgeFromCode } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { OrgUnitFormDialog } from "@/features/org-units/OrgUnitFormDialog";
import { useDebounce } from "@/hooks/use-debounce";
import { ORG_TREE_BASE_PADDING_PX, ORG_TREE_INDENT_PX, SKELETON_ROW_COUNT } from "@/lib/constants";
import { authorizeRoute } from "@/lib/permissions";
import { OrgUnitStatus, OrgUnitType } from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, ChevronDown, ChevronRight, Eye, Pencil, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/org-units/")({
  beforeLoad: authorizeRoute("/org-units"),
  component: OrgUnitsPage,
});

function OrgUnitNode({
  node,
  level = 0,
  onAdd,
  onEdit,
  onView,
}: {
  node: any;
  level?: number;
  onAdd: (parentId: string) => void;
  onEdit: (node: any) => void;
  onView: (node: any) => void;
}) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children?.length > 0;
  const statusLabel =
    OrgUnitStatus[node.status as keyof typeof OrgUnitStatus]?.label ?? node.status;
  const isDissolved = node.status === "dissolved";

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50 group"
        style={{ paddingLeft: `${level * ORG_TREE_INDENT_PX + ORG_TREE_BASE_PADDING_PX}px` }}
      >
        {/* Expand toggle */}
        <button
          type="button"
          className="shrink-0"
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        {/* Name */}
        <span className={`font-medium text-sm flex-1 ${isDissolved ? "text-muted-foreground line-through" : ""}`}>
          {node.unitName}
        </span>

        {/* Dissolved badge */}
        {isDissolved && (
          <span className="rounded border border-gray-300 px-2 py-0.5 text-xs text-muted-foreground">
            Giải thể
          </span>
        )}

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider delayDuration={300}>
            {!isDissolved && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => { e.stopPropagation(); onAdd(node.id); }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Thêm đơn vị con</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => { e.stopPropagation(); onView(node); }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>

            {!isDissolved && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sửa đơn vị</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>

      {expanded &&
        hasChildren &&
        node.children.map((child: any) => (
          <OrgUnitNode
            key={child.id}
            node={child}
            level={level + 1}
            onAdd={onAdd}
            onEdit={onEdit}
            onView={onView}
          />
        ))}
    </div>
  );
}

function OrgUnitsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery(orgUnitTreeOptions());
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText);
  const tree = data?.data ?? [];

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

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

  const filteredTree = filterTree(tree as any[], debouncedSearch);

  const handleAdd = (parentId: string | null) => {
    setCreateParentId(parentId);
    setEditingItem(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (node: any) => {
    setEditingItem(node);
    setCreateDialogOpen(false);
  };

  const handleView = (node: any) => {
    // For now, just open edit dialog in view mode
    // TODO: implement dedicated detail view with tabs
    handleEdit(node);
  };

  if (isError) {
    return (
      <div>
        <PageHeader title="Sơ đồ tổ chức" description="Cơ cấu tổ chức trường Đại học Thủy Lợi" />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Sơ đồ tổ chức"
        description="Cơ cấu tổ chức trường Đại học Thủy Lợi"
        actions={
          <Button onClick={() => handleAdd(null)}>
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
              {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <Skeleton key={`s-${i}`} className="h-8 w-full" />
              ))}
            </div>
          ) : filteredTree.length > 0 ? (
            filteredTree.map((node: any) => (
              <OrgUnitNode
                key={node.id}
                node={node}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))
          ) : (
            <EmptyState description="Không tìm thấy đơn vị nào" />
          )}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <OrgUnitFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultParentId={createParentId}
      />

      {/* Edit dialog */}
      <OrgUnitFormDialog
        open={!!editingItem}
        onOpenChange={(open) => { if (!open) setEditingItem(null); }}
        editingItem={editingItem}
      />
    </div>
  );
}
