import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface QueryErrorProps {
  error: Error | null;
  onRetry?: () => void;
}

export function QueryError({ error, onRetry }: QueryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive/50 mb-4" />
      <h3 className="text-lg font-medium">Đã xảy ra lỗi</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {error?.message ?? "Không thể tải dữ liệu. Vui lòng thử lại sau."}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
