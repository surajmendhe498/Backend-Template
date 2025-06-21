import { z } from 'zod';

export const createWord_or_floor_masterSchema = z.object({
  body: z.object({
    floorName: z.string().min(1, "Floor name is required"), 
    floorNumber: z.number().min(1, "Floor number must be a positive integer"), 
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
});


export const updateWord_or_floor_masterSchema = z.object({
  body: z.object({
    floorName: z.string().optional(), 
    floorNumber: z.number().min(1, "Floor number must be a positive integer").optional(), 
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
  params: z.object({
    id: z.string().min(1, "ID is required"), 
  }),
});