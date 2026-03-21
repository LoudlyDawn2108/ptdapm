import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "destructive" | "outline";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

// Map common status codes to variants
const STATUS_VARIANT_MAP: Record<string, StatusVariant> = {
  // Account status
  active: "success",
  locked: "destructive",
  // Work status
  pending: "warning",
  working: "success",
  terminated: "destructive",
  // Contract status
  none: "outline",
  valid: "success",
  expired: "destructive",
  renewal_wait: "warning",
  // Org unit status
  merged: "outline",
  dissolved: "destructive",
  // Training status
  open_registration: "success",
  in_progress: "warning",
  completed: "success",
  // Participation status
  registered: "default",
  learning: "warning",
  failed: "destructive",
  // Catalog status
  inactive: "outline",
  // Contract doc status
  draft: "outline",
};

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  default: "",
  success:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:
    "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  destructive: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  outline: "",
};

const DOT_CLASSES: Record<StatusVariant, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  destructive: "bg-red-500 dark:bg-red-400",
  outline: "bg-muted-foreground",
};

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? "default";
  const variantClass = VARIANT_CLASSES[resolvedVariant] ?? "";
  const dotClass = DOT_CLASSES[resolvedVariant] ?? "";

  return (
    <Badge
      variant={resolvedVariant === "outline" ? "outline" : "secondary"}
      className={cn(variantClass, className)}
    >
      <span className={cn("inline-block h-[6px] w-[6px] shrink-0 rounded-full", dotClass)} />
      {label}
    </Badge>
  );
}

/**
 * Auto-detect variant from status code.
 */
export function StatusBadgeFromCode({
  code,
  label,
  className,
}: {
  code: string;
  label: string;
  className?: string;
}) {
  const variant = STATUS_VARIANT_MAP[code] ?? "default";
  return <StatusBadge label={label} variant={variant} className={className} />;
}
