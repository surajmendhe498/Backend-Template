import { z } from 'zod';

export const createLab_masterSchema = z.object({
  body: z.object({
    labName: z.string().min(1, "Lab name is required"),
    department: z.string().min(1, "Department is required"),
    floorNumber: z.string().min(1, "Floor number is required"),
    status: z.enum(['Active', 'Maintenance']).optional(),
  }),
});

export const updateLab_masterSchema = z.object({
  body: z.object({
    labName: z.string().min(1, "Lab name is required").optional(),
    department: z.string().min(1, "Department is required").optional(),
    floorNumber: z.string().min(1, "Floor number is required").optional(),
    status: z.enum(['Active', 'Maintenance']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "ID is required"), 
  }),
});
