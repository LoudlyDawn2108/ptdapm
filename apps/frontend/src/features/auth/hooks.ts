import { useAuthStore } from "@/stores/auth";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  return {
    user,
    isAdmin: user?.role === "ADMIN",
    isTCCB: user?.role === "TCCB",
    isTCKT: user?.role === "TCKT",
    isEmployee: user?.role === "EMPLOYEE",
    hasRole: (...roles: string[]) =>
      user ? roles.includes(user.role) : false,
  };
}
