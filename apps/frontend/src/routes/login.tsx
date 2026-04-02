import { sessionOptions } from "@/features/auth/api";
import { LoginForm } from "@/features/auth/components/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import bgImage from "../../assets/image-476.jpeg";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    // If already logged in, redirect to dashboard
    const session = await context.queryClient
      .fetchQuery(sessionOptions())
      .catch(() => null);

    if (session) {
      throw redirect({ to: "/" });
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
