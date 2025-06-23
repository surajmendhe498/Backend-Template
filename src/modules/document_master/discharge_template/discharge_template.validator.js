import { z } from 'zod';

export const createDischargeTemplateSchema = z.object({
  body: z.object({
    templateName: z.string().min(1, "Template name is required"),
  }),
});
