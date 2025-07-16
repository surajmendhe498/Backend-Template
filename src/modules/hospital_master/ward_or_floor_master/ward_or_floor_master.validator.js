import { z } from 'zod';

export const createWard_or_floor_masterSchema = z.object({
  body: z.object({
    floorName: z.string().min(1, "Floor name is required"), 
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
});


export const updateWard_or_floor_masterSchema = z.object({
  body: z.object({
    floorName: z.string().optional(), 
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
  params: z.object({
    id: z.string().min(1, "ID is required"), 
  }),
});