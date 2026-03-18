import { z } from "zod";
import { PARTICIPATION_STATUS_CODES } from "../constants/enums";

// ---------------------------------------------------------------------------
// List My Training Registrations Query (UC 4.41)
// ---------------------------------------------------------------------------

export const listMyTrainingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  participationStatus: z.enum(PARTICIPATION_STATUS_CODES).optional(),
});

export type ListMyTrainingQuery = z.infer<typeof listMyTrainingQuerySchema>;
