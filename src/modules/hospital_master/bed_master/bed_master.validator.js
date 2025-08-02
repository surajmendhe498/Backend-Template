import { z } from 'zod';

export const createBedMasterSchema = z.object({
  body: z.object({
    floorId: z
      .string()
      .nonempty("Floor ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID"), 
    bedName: z.string().nonempty("Bed name is required"),
    applicableClass: z.string().nonempty("Applicable class is required"),
    bedStatus: z.enum(['Vacant', 'Occupied', 'Under Maintenance']),
    departmentId: z
      .string()
      .nonempty("Department ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Department ID"),
    status: z.enum(['Active', 'Inactive']),
    wardId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Ward ID")
      .optional(),
  }),
});

export const updateBedMasterSchema = z.object({
  body: z.object({
    floorId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID")
      .optional(),
    bedName: z.string().optional(),
    applicableClass: z.string().optional(),
    bedStatus: z.enum(['Vacant', 'Occupied', 'Under Maintenance']).optional(),
    departmentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Department ID")
      .optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
    wardId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Ward ID")
      .optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Bed ID is required"),
  }),
});
