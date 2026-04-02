import { z } from "zod";

/**
 * Regex pattern to detect common SQL injection attempts.
 * Matches patterns like: ' OR, ' AND, --, ;--, UNION SELECT, etc.
 */
const SQL_INJECTION_PATTERN =
  /('[\s]*OR[\s]+|'[\s]*AND[\s]+|--[\s]*$|;[\s]*--|UNION[\s]+SELECT|DROP[\s]+TABLE|INSERT[\s]+INTO|DELETE[\s]+FROM|UPDATE[\s]+.*SET|SELECT[\s]+.*FROM|'[\s]*=[\s]*'|1[\s]*=[\s]*1|'[\s]*;)/i;

/**
 * Validates that a string does not contain SQL injection patterns.
 * Use this for text fields that could be vulnerable to injection attacks.
 */
export function noSqlInjection(
  errorMessage = "Dữ liệu chứa ký tự không hợp lệ",
) {
  return z.string().refine((value) => !SQL_INJECTION_PATTERN.test(value), {
    message: errorMessage,
  });
}

/**
 * Creates a safe string schema that blocks SQL injection patterns.
 * Supports optional max length and nullish values.
 */
export function safeString(maxLength?: number) {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.refine((value) => !SQL_INJECTION_PATTERN.test(value), {
    message: "Dữ liệu chứa ký tự không hợp lệ",
  });
}

/**
 * Creates a safe optional string schema that blocks SQL injection patterns.
 */
export function safeStringNullish(maxLength?: number) {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema
    .nullish()
    .refine((value) => value == null || !SQL_INJECTION_PATTERN.test(value), {
      message: "Dữ liệu chứa ký tự không hợp lệ",
    });
}

export const paginationSchema = z.object({
  page: z.coerce
    .number({ error: "Page must be a number" })
    .int()
    .min(1)
    .default(1),
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
  limit: z.coerce
    .number({ error: "Limit must be a number" })
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type DropdownQuery = z.infer<typeof dropdownQuerySchema>;
