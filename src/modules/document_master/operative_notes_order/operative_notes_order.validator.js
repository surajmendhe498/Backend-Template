import { z } from 'zod';

export const createOperative_notes_orderSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"), 
    otherTitle: z.string().optional(),           
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
});
