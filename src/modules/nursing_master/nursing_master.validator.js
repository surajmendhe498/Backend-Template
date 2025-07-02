import { z } from 'zod';

export const createNurseSchema = z.object({
  body: z.object({
    nurseName: z.string().min(1, "Nurse name is required"),
    contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
    emailId: z.string().email("Invalid email address"),
    address: z.string().optional(),
    city: z.string().optional(),
    education: z.string().optional(),
    speciality: z.string().optional(),
    department: z.string().optional(),
    shift: z.string().optional(),
    word: z.string().optional(),
     status: z.coerce.boolean().optional(),
    photo: z.string().optional(), 
    dateOfJoin: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format for dateOfJoin",
    }),
  }),
});
