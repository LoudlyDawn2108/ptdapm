import { treaty } from "@elysiajs/eden";
import type { App } from "@hrms/backend";

export const api = treaty<App>(import.meta.env.VITE_API_URL ?? "http://localhost:3000", {
  fetch: {
    credentials: "include",
  },
});

// biome-ignore lint/suspicious/noExplicitAny: Eden Treaty nested route inference limitation
export const employeesApi = (api as unknown as Record<string, any>).api.employees;
