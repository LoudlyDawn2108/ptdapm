import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ReadOnlyField({
  label,
  value,
  className,
}: {
  label: string;
  value: string | undefined | null;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="rounded-lg border bg-background px-3 py-2 text-sm min-h-[38px] flex items-center">
        {value ?? "—"}
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 pt-6 pb-3">
      <h3 className="text-sm font-bold uppercase tracking-wide whitespace-nowrap">{title}</h3>
      <div className="h-px flex-1 bg-border" />
      {action}
    </div>
  );
}
