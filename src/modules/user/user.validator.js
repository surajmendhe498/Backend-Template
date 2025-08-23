import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Admin", "Nursing", "Management", "Medical officer", "Consultant", "Billing", "MRD"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email required"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10, "Reset token required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});



export const updateSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(["Admin", "Nursing", "Management", "Medical officer", "Consultant", "Billing", "MRD"]).optional(),
  }),
});