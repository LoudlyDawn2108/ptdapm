import { Button } from "@/components/ui/button";
import { useMyEmployeeDetail } from "@/features/employees/api";
import { orgUnitDetailOptions } from "@/features/org-units/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/my/org/children")({
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

function ChildUnitNode({ node, level = 0 }: { node: ChildUnit; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isDissolved = node.status === "dissolved";

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50"
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
          className={`font-medium text-sm flex-1 ${isDissolved ? "text-muted-foreground line-through" : ""}`}
        >
          {node.unitName}
        </span>

        {/* Dissolved badge */}
        {isDissolved && (
          <span className="rounded border border-gray-300 px-2 py-0.5 text-xs text-muted-foreground">
            Giải thể
          </span>
        )}
      </div>

      {expanded &&
        hasChildren &&
        node.children!.map((child) => (
          <ChildUnitNode key={child.id} node={child} level={level + 1} />
        ))}
    </div>
  );
}

function ChildrenTab() {
  const { employee } = useMyEmployeeDetail();
  const orgUnitId = employee?.currentOrgUnitId;

  const { data: orgDetail } = useQuery({
    ...orgUnitDetailOptions(orgUnitId ?? ""),
    enabled: !!orgUnitId,
  });

  const unit = orgDetail?.data;

  // Build a tree from children. The API returns direct children flat.
  // Wrap the unit itself as the root to show the hierarchy properly.
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

  return (
    <div className="rounded-xl border bg-card p-6">
      {treeRoot ? (
        <ChildUnitNode node={treeRoot} />
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Không có đơn vị trực thuộc.
        </p>
      )}
    </div>
  );
}
