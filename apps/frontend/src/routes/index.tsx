import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Bảng điều khiển</h2>
      <p className="mt-2 text-muted-foreground">
        Chào mừng đến với Hệ thống Quản lý Nhân sự - Trường Đại học Thủy Lợi
      </p>
    </div>
  );
}
