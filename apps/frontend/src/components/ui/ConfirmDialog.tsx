import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import * as React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  variant = "default",
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="h-10 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={cn(
              "h-10 rounded-full px-6 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              variant === "danger"
                ? "bg-destructive hover:opacity-90"
                : "bg-primary hover:opacity-90",
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            variant === "danger"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary",
          )}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
    </Modal>
  );
}
