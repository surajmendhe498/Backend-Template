import { z } from 'zod';

export const createPatientSchema = z.object({
  body: z.object({
    existingPatient: z.boolean().optional(),
    reasonForAdmission: z.string().min(1, 'Reason for admission is required'),
    UHID: z.string().min(1, 'UHID is required'),
    IPD: z.string().optional(),
    emergencyNo: z.string().optional(),
    salutation: z.string().optional(),
    patientName: z.string().min(1, 'Patient name is required'),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    age: z
      .object({
        years: z.number().optional(),
        months: z.number().optional(),
      })
      .optional(),
    registrationType: z.enum(['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis']),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    existingPatient: z.boolean().optional(),
    reasonForAdmission: z.string().min(1, 'Reason for admission must not be empty.').optional(),
    IPD: z.string().optional(),
    emergencyNo: z.string().optional(),
    salutation: z.enum(['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']).optional(),
    patientName: z.string().min(1, 'Patient name must not be empty.').optional(),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format for date of birth.')
      .optional(),
    age: z
      .object({
        years: z.number().int().nonnegative().optional(),
        months: z.number().int().min(0).max(11).optional(),
      })
      .optional(),
    registrationType: z.enum(['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis']).optional(),
  }),
});

