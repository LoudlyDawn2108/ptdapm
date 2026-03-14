import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../api";
import { applyFieldErrors } from "@/lib/error-handler";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logoImg from "../../../../assets/tlu-logo.png";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      toast.success("Đăng nhập thành công");
      navigate({ to: "/" });
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <div
      className="w-[460px] rounded-2xl px-10 py-10"
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Logo */}
      <div className="mb-4 flex justify-center">
        <img
          src={logoImg}
          alt="Logo Trường Đại học Thủy Lợi"
          className="h-20 w-20 rounded-full object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="mb-8 text-center text-2xl font-bold text-foreground">
        Đăng nhập
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <label
            htmlFor="login-username"
            className="block text-sm font-medium text-foreground"
          >
            Tên đăng nhập
          </label>
          <Input
            id="login-username"
            placeholder="admin"
            autoComplete="username"
            className="h-11 border-gray-300 bg-white/80 text-base placeholder:text-gray-400 focus-visible:ring-primary"
            {...form.register("username")}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-destructive">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-foreground"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              autoComplete="current-password"
              className="h-11 border-gray-300 bg-white/80 pr-10 text-base placeholder:text-gray-400 focus-visible:ring-primary"
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Root error message */}
        {rootError && (
          <p className="text-center text-sm font-medium text-destructive">
            {rootError}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="h-12 w-full rounded-lg text-base font-semibold"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>
    </div>
  );
}
