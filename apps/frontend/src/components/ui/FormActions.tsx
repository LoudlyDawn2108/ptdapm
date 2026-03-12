import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type * as React from "react";

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  actions?: React.ReactNode;
  className?: string;
  formId?: string;
}

export function FormActions({
  submitLabel = "Lưu",
  cancelLabel = "Hủy",
  onCancel,
  loading,
  actions,
  className,
  formId,
}: FormActionsProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-3", className)}>
      {actions}
      {onCancel ? (
        <button
          type="button"
          className="h-10 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </button>
      ) : null}
      <button
        type="submit"
        form={formId}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Đang lưu" : submitLabel}
      </button>
    </div>
  );
}
