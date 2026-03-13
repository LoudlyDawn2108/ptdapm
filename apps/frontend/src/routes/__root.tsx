import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Lỗi</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <a href="/" className="mt-4 underline">
        Về trang chủ
      </a>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">404 — Không tìm thấy</h1>
      <a href="/" className="mt-4 underline">
        Về trang chủ
      </a>
    </div>
  ),
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}
