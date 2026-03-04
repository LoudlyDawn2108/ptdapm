import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-3">
        <h1 className="text-lg font-semibold">HRMS - Quản lý Nhân sự</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
      <footer className="border-t border-border px-6 py-3 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Trường Đại học Thủy Lợi
      </footer>
    </div>
  );
}
