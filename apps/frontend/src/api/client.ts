import { treaty } from "@elysiajs/eden";

export const api: any = treaty(import.meta.env.VITE_API_URL ?? "http://localhost:3000", {
  fetch: {
    credentials: "include",
  },
});
