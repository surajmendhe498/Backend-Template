import { z } from "zod";

export const createDoctorSchema = z.object({
  body: z.object({
    doctorName: z.string().min(1, "Doctor name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    contactNo: z.string().min(10, "Contact number is required"),
    hospitalLandline: z.string().optional(),
    education: z.string().min(1, "Education is required"),
    speciality: z.string().min(1, "Speciality is required"),
    departmentId: z.string().min(1, "Department ID is required"),
    status: z.preprocess((val) => val === "true", z.boolean()), 
    photo: z.string().optional(),
    dateOfJoin: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid date format (expected YYYY-MM-DD)",
      }),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    doctorName: z.string().min(1, "Doctor name is required").optional(),
    email: z.string().email("Invalid email").optional(),
    address: z.string().min(1, "Address is required").optional(),
    city: z.string().min(1, "City is required").optional(),
    contactNo: z.string().min(10, "Contact number is required").optional(),
    hospitalLandline: z.string().optional(),
    education: z.string().min(1, "Education is required").optional(),
    speciality: z.string().min(1, "Speciality is required").optional(),
    departmentId: z.string().min(1, "Department ID is required").optional(),
    status: z
      .preprocess((val) => (val === "true" ? true : val === "false" ? false : val), z.boolean())
      .optional(),
    photo: z.string().optional(),
    dateOfJoin: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid date format (expected YYYY-MM-DD)",
      }),
  }),
});
