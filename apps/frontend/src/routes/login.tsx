import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <p className="text-center text-muted-foreground">Hệ thống Quản lý Nhân sự</p>
      </div>
    </div>
  );
}
