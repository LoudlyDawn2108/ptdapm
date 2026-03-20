import { z } from "zod";
import { CONTRACT_DOC_STATUS_CODES } from "../constants/enums";

const contractDocStatusSchema = z.enum(CONTRACT_DOC_STATUS_CODES);

export const createEmploymentContractSchema = z.object({
  contractTypeId: z.string().uuid("Loại hợp đồng không hợp lệ"),
  contractNo: z.string().min(1, "Số hợp đồng không được để trống"),
  signedOn: z.string().min(1, "Ngày ký không được để trống"),
  effectiveFrom: z.string().min(1, "Ngày hiệu lực không được để trống"),
  effectiveTo: z.string().min(1, "Ngày hết hạn không được để trống"),
  orgUnitId: z.string().uuid("Đơn vị công tác không hợp lệ"),
  contentHtml: z.string().nullish(),
  contractFileId: z.string().uuid().nullish(),
});

export type CreateEmploymentContractInput = z.infer<typeof createEmploymentContractSchema>;

export const updateEmploymentContractSchema = createEmploymentContractSchema.partial().extend({
  status: contractDocStatusSchema.optional(),
});

export type UpdateEmploymentContractInput = z.infer<typeof updateEmploymentContractSchema>;
