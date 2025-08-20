import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(["User", "Admin"]).optional(), 
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  }),
});
