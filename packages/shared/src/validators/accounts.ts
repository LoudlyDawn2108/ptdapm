import { z } from "zod";
import { AUTH_USER_STATUS_CODES, ROLE_CODES } from "../constants/enums";
import { paginationSchema } from "./common";

// ---------------------------------------------------------------------------
// Create Account
// ---------------------------------------------------------------------------
export const createAccountSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  employeeId: z.uuid("Mã nhân sự không hợp lệ"),
  roleCode: z.enum(ROLE_CODES, {
    error: "Vai trò không hợp lệ",
  }),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

// ---------------------------------------------------------------------------
// Update Account
// ---------------------------------------------------------------------------
export const updateAccountSchema = z.object({
  email: z.string().email("Email không hợp lệ").optional(),
  roleCode: z
    .enum(ROLE_CODES, {
      error: "Vai trò không hợp lệ",
    })
    .optional(),
  status: z
    .enum(AUTH_USER_STATUS_CODES, {
      error: "Trạng thái không hợp lệ",
    })
    .optional(),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

// ---------------------------------------------------------------------------
// Set Account Status
// ---------------------------------------------------------------------------
export const setAccountStatusSchema = z.object({
  status: z.enum(AUTH_USER_STATUS_CODES, {
    error: "Trạng thái không hợp lệ",
  }),
});

export type SetAccountStatusInput = z.infer<typeof setAccountStatusSchema>;

// ---------------------------------------------------------------------------
// List Accounts Query
// ---------------------------------------------------------------------------
export const listAccountsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  role: z.enum(ROLE_CODES).optional(),
  status: z.enum(AUTH_USER_STATUS_CODES).optional(),
});

export type ListAccountsQuery = z.infer<typeof listAccountsQuerySchema>;
