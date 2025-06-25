import { z } from 'zod';

export const createSignatureMasterSchema = z.object({
  body: z.object({
    signatureTitle: z.string().min(1, 'Signature Title is required'),
    otherTitle: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
});
