import { z } from 'zod';

export const createLab_masterSchema = z.object({
  body: z.object({
    labName: z.string().nonempty("Lab name is required"),
    department: z.string().nonempty("Department is required"),
    floorId: z
      .string()
      .nonempty("Floor ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID"),
    assignedDoctor: z.string().nonempty("Assigned doctor is required"),
    assistantDoctor: z.string().nonempty("Assistant doctor is required"),
    status: z.enum(['Active', 'Inactive', 'Maintenance']).optional(), 
  }),
});

export const updateLab_masterSchema = z.object({
  body: z.object({
    labName: z.string().optional(),
    department: z.string().optional(),
    floorId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID")
      .optional(),
    assignedDoctor: z.string().optional(),
    assistantDoctor: z.string().optional(),
    status: z.enum(['Active', 'Inactive', 'Maintenance']).optional(), 
  }),
  params: z.object({
    id: z
      .string()
      .nonempty("Lab ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Lab ID"),
  }),
});
