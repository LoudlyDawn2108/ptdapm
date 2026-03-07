import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export type IdParam = z.infer<typeof idParamSchema>;

export const employeeIdParamSchema = z.object({
  employeeId: z.string().uuid(),
});

export type EmployeeIdParam = z.infer<typeof employeeIdParamSchema>;
