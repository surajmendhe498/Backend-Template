import { z } from 'zod';

export const createBedMasterSchema = z.object({
  body: z.object({
    floorName: z.string().nonempty("Floor name is required"),
    bedName: z.string().nonempty("Bed name is required"),
    applicableClass: z.string().nonempty("Applicable class is required"),
    bedStatus: z.enum(['Vacant', 'Occupied', 'Under Maintenance']),
    status: z.enum(['Active', 'Inactive']),
  }),
});

export const updateBedMasterSchema = z.object({
  body: z.object({
    floorName: z.string().optional(), 
    bedName: z.string().optional(), 
    applicableClass: z.string().optional(), 
    bedStatus: z.enum(['Vacant', 'Occupied', 'Under Maintenance']).optional(), 
    status: z.enum(['Active', 'Inactive']).optional(), 
  }),
  params: z.object({
    id: z.string().min(1, "Bed ID is required"), 
  }),
});