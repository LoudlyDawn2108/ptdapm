import { z } from "zod";

export const createTerminationSchema = z.object({
  terminatedOn: z.string().date("Ngày thôi việc không hợp lệ"),
  reason: z
    .string()
    .min(1, "Lý do thôi việc không được để trống")
    .max(1000, "Lý do thôi việc không được quá 1000 ký tự"),
});

export type CreateTerminationInput = z.infer<typeof createTerminationSchema>;
