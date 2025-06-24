import { z } from 'zod';

export const createOtNotesTemplateSchema = z.object({
  body: z.object({
    templateName: z.string().min(1, "Template name is required"),
  }),
});
