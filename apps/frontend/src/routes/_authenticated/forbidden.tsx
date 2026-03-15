import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/forbidden")({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldAlert className="h-16 w-16 text-destructive/60 mb-6" />
      <h1 className="text-2xl font-semibold">Không có quyền truy cập</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây
        là lỗi.
      </p>
      <Button variant="outline" asChild className="mt-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Về trang chủ
        </Link>
      </Button>
    </div>
  );
}
