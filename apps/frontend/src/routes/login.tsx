import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionOptions } from "@/features/auth/api";
import { LoginForm } from "@/features/auth/components/login-form";
import bgImage from "../../assets/image-476.jpeg";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    try {
      // If already logged in, redirect to dashboard
      await context.queryClient.ensureQueryData(sessionOptions());
      throw redirect({ to: "/" });
    } catch (e) {
      // Re-throw redirect (from successful auth check)
      if (e && typeof e === "object" && "to" in e) {
        throw e;
      }
      // Any other error (network, "Not authenticated", etc.) → show login page
      return;
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      {/* Slight dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      {/* Login form */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
