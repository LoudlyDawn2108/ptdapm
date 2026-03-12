import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuthStore } from "../stores/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data, error } = await api.auth.session.get();
        if (!isMounted) return;
        if (error || !data) {
          navigate({ to: "/login" });
          return;
        }
        setUser(data.user);
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        navigate({ to: "/login" });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  const handleLogout = async () => {
    try {
      await api.auth.logout.post();
    } finally {
      clearUser();
      navigate({ to: "/login" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="flex w-64 flex-col border-r border-border bg-slate-950 text-slate-100">
        <div className="px-6 py-5 text-lg font-semibold">HRMS</div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          <Link
            to="/employees"
            className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-900"
          >
            Nhân sự
          </Link>
          <Link
            to="/my/profile"
            className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-900"
          >
            Hồ sơ cá nhân
          </Link>
        </nav>
        <div className="border-t border-slate-900 px-6 py-4 text-xs text-slate-400">
          Trường Đại học Thủy Lợi
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Xin chào</p>
            <p className="text-base font-semibold">
              {user?.fullName ?? user?.username ?? "Người dùng"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Đăng xuất
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
