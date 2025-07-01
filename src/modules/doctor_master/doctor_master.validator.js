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
    department: z.string().min(1, "Department is required"),
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
