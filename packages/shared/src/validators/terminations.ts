import { z } from "zod";

export const createTerminationSchema = z.object({
  terminatedOn: z.string().date(),
  reason: z.string().min(1, "Lý do thôi việc không được để trống"),
});

export type CreateTerminationInput = z.infer<typeof createTerminationSchema>;
