import { z } from 'zod';

export const createOt_masterSchema = z.object({
  body: z.object({
    otName: z.string().nonempty("OT name is required"),
    floorId: z
      .string()
      .nonempty("Floor ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID"),
    status: z.enum(['Active', 'Inactive', 'Maintenance']).optional(),
  }),
});

export const updateOt_masterSchema = z.object({
  body: z.object({
    otName: z.string().optional(),
    floorId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID")
      .optional(),
    status: z.enum(['Active', 'Inactive', 'Maintenance']).optional(),
  }),
  params: z.object({
    id: z
      .string()
      .nonempty("OT Master ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid OT Master ID"),
  }),
});
