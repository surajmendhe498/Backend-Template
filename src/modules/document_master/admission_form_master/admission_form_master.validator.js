import { z } from "zod";

export const createAdmissionFormMasterSchema = z.object({
  body: z.object({
    fieldName: z.string().min(1, "Field Name is required"),
    showInPatientSticker: z.boolean().optional(),
    showInPageFloatingView: z.boolean().optional(),
    showInAdmissionCard: z.boolean().optional(),
    showInDischargeCard: z.boolean().optional(),
    isMandatory: z.boolean().optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});
