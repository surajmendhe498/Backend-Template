import { z } from 'zod';

export const createWardSchema = z.object({
  body: z.object({
    wardName: z.string().min(1, 'Ward name is required'),
    floorId: z.string().min(1, 'Floor ID is required'),
    status: z.enum(['Active', 'Inactive', 'Maintenance']).optional()
  })
});

export const updateWardSchema = z.object({
  body: z.object({
    wardName: z.string().optional(),
    floorId: z.string().optional(),
    status: z.enum(['Active', 'Inactive', 'Maintenance']).optional()
  })
});
