import { treaty } from "@elysiajs/eden";
import type { ApiContract } from "@hrms/shared";
import type { AnyElysia } from "elysia";

type EdenContract = ApiContract & AnyElysia;

export const api = treaty<EdenContract>(
  import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  {
    fetch: {
      credentials: "include",
    },
  },
) as any;
