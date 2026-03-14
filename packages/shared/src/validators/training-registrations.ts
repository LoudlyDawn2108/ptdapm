import { z } from "zod";
import {
  PARTICIPATION_STATUS_CODES,
  type ParticipationStatusCode,
} from "../constants/enums";

// ---------------------------------------------------------------------------
// Create Training Registration (UC 4.40 — Đăng ký tham gia khóa đào tạo)
// ---------------------------------------------------------------------------

export const createTrainingRegistrationSchema = z.object({
  employeeId: z.string().uuid("Mã nhân sự không hợp lệ").optional(),
});

export type CreateTrainingRegistrationInput = z.infer<
  typeof createTrainingRegistrationSchema
>;

// ---------------------------------------------------------------------------
// List Training Registrations Query
// ---------------------------------------------------------------------------

export const listTrainingRegistrationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  participationStatus: z
    .enum(
      PARTICIPATION_STATUS_CODES as [
        ParticipationStatusCode,
        ...ParticipationStatusCode[],
      ],
    )
    .optional(),
});

export type ListTrainingRegistrationsQuery = z.infer<
  typeof listTrainingRegistrationsQuerySchema
>;
