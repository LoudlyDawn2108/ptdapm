import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number({ error: "Page must be a number" }).int().min(1).default(1),
  pageSize: z.coerce
    .number({ error: "Page size must be a number" })
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export const idParamSchema = z.object({
  id: z.uuid(),
});

export type IdParam = z.infer<typeof idParamSchema>;

export const employeeIdParamSchema = z.object({
  employeeId: z.uuid(),
});

export type EmployeeIdParam = z.infer<typeof employeeIdParamSchema>;

export const contractIdParamSchema = z.object({
  contractId: z.uuid(),
});

export type ContractIdParam = z.infer<typeof contractIdParamSchema>;

export const dropdownQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number({ error: "Limit must be a number" }).int().min(1).max(100).default(20),
});

export type DropdownQuery = z.infer<typeof dropdownQuerySchema>;
