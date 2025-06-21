import { z } from 'zod';

export const createPatientMasterSchema = z.object({
  body: z.object({
    patientPhoto: z.string().optional(), 
    patientName: z.string().min(1, "Patient name is required"),
    bedNo: z.string().optional(), 
    floor: z.string().optional(),
    doctor: z.string().min(1, "Doctor name is required"),
    paymentMode: z.enum(["Cash", "Card", "Online"], "Payment mode must be one of 'Cash', 'Card', or 'Online'"),
    admissionDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Admission date must be a valid date",
    }),
    dischargeDate: z
      .string()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Discharge date must be a valid date",
      }),
    duration: z.string().optional(),
    admissionReason: z.string().optional(),
    consultant: z.string().optional(),
    dischargeSummaryStatus: z.enum(["Pending", "Completed"]).optional(),
    paymentDetails: z
      .object({
        amount: z.string().optional(), 
        // transactionId: z.string().optional(),
      })
      .optional(),
    status: z.enum(["Admitted", "Discharged"], "Status must be 'Admitted' or 'Discharged'"),
  }),
});
