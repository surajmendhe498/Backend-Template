import { z } from 'zod';

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Department name is required"),
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Department name is required").optional(),
  }),
});
