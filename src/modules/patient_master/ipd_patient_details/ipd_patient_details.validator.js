import { z } from "zod";

export const createIpd_patient_detailsSchema = z.object({
  body: z.object({
    patientName: z.string().min(1, "Patient name is required"),
    uhidNo: z.string().min(1, "UHID is required"),
    ipdNo: z.string().min(1, "IPD number is required"),
    bedNo: z.string().optional(),
    floor: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]),
    doctor: z.string().min(1, "Doctor is required"),
    contactNo: z.string().optional(),
    admissionDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    dischargeDate: z.string().optional().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    status: z.enum(["Admitted", "Discharged"]),
  }),
});
