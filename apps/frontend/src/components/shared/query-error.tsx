import { Button } from "@/components/ui/button";
import { commonStrings as t } from "@/lib/strings";
import { AlertCircle } from "lucide-react";

interface QueryErrorProps {
  error: Error | null;
  onRetry?: () => void;
}

export function QueryError({ error, onRetry }: QueryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive/50 mb-4" />
      <h3 className="text-lg font-medium">{t.errors.title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {error?.message ?? t.errors.fallback}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          {t.actions.retry}
        </Button>
      )}
    </div>
  );
}
