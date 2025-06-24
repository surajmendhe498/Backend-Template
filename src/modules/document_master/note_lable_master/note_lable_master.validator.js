import { z } from 'zod';

export const Notes_lable_masterSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"), 
    otherTitle: z.string().optional(),           
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
});
