import { cn } from "@/lib/utils";
import type * as React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <label className={cn("flex flex-col gap-2 text-sm text-foreground", className)}>
      <span className="flex items-center gap-2 font-medium">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </span>
      {children}
      {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
