import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OrgUnitFormDialog } from "@/features/org-units/OrgUnitFormDialog";
import { orgUnitDetailOptions } from "@/features/org-units/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Eye, Pencil, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/org-units_/$orgUnitId/children")({
  component: ChildrenTab,
});

type ChildUnit = {
  id: string;
  unitName: string;
  unitCode: string;
  status: string;
  parentId: string | null;
  children?: ChildUnit[];
};

function ChildUnitNode({
  node,
  level = 0,
  onAdd,
  onEdit,
  onView,
}: {
  node: ChildUnit;
  level?: number;
  onAdd: (parentId: string) => void;
  onEdit: (node: ChildUnit) => void;
  onView: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isInactive = node.status !== "active";

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50 group"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
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
        <span
          className={`font-medium text-sm flex-1 ${isInactive ? "text-muted-foreground line-through" : ""}`}
        >
          {node.unitName}
        </span>

        {isInactive && (
          <span className="rounded border border-gray-300 px-2 py-0.5 text-xs text-muted-foreground">
            {node.status === "dissolved" ? "Giải thể" : "Đã sáp nhập"}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider delayDuration={300}>
            {!isInactive && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd(node.id);
                    }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(node.id);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>

            {!isInactive && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(node);
                    }}
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
        node.children!.map((child) => (
          <ChildUnitNode
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

function ChildrenTab() {
  const { orgUnitId } = Route.useParams();
  const navigate = useNavigate();

  const { data: orgDetail } = useQuery(orgUnitDetailOptions(orgUnitId));

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const unit = orgDetail?.data;

  const treeRoot: ChildUnit | null = unit
    ? {
        id: unit.id,
        unitName: unit.unitName,
        unitCode: unit.unitCode,
        status: unit.status,
        parentId: unit.parentId,
        children: (unit.children ?? []) as ChildUnit[],
      }
    : null;

  const handleAdd = (parentId: string) => {
    setCreateParentId(parentId);
    setEditingItem(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (node: any) => {
    setEditingItem(node);
    setCreateDialogOpen(false);
  };

  const handleView = (id: string) => {
    void navigate({ to: "/org-units/$orgUnitId", params: { orgUnitId: id } });
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      {treeRoot && (treeRoot.children?.length ?? 0) > 0 ? (
        <ChildUnitNode node={treeRoot} onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Không có đơn vị trực thuộc.
        </p>
      )}

      {/* Add dialog */}
      <OrgUnitFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultParentId={createParentId}
      />

      {/* Edit dialog */}
      <OrgUnitFormDialog
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    </div>
  );
}
