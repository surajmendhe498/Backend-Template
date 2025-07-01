// import { z } from 'zod';

// export const createPatientSchema = z.object({
//   body: z.object({
//     UHID: z.string().min(1, 'UHID is required.'),
//     registrationType: z.enum(['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis'], {
//       required_error: 'Registration type is required.',
//     }),
//     admissionDetails: z.object({
//       existingPatient: z.boolean().optional(),
//       reasonForAdmission: z.string().optional(),
//       IPD: z.string().min(1, 'IPD is required.'),
//       emergencyNo: z.string().optional(),
//       salutation: z.string().optional(),
//       patientName: z.string().min(1, 'Patient name is required.'),
//       dateOfBirth: z
//         .string()
//         .refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format.' })
//         .optional(),
//       age: z
//         .object({
//           years: z.number().int().nonnegative().optional(),
//           months: z.number().int().min(0).max(11).optional(),
//         })
//         .optional(),
//     }),
//     identityDetails: z.object({
//       address: z.string().optional(),
//       city: z.string().optional(),
//       pinCode: z.string().optional(),
//       corporation: z.enum(['In-Corporation', 'Out-Corporation'], {
//         required_error: 'Corporation type is required.',
//       }),
//       responsiblePerson: z.string().optional(),
//       relationship: z.enum(['Parent', 'Spouse', 'Sibling', 'Other']).optional(),
//       relativeContactNo: z.string().optional(),
//       aadharNo: z.string().optional(),
//     }),
//   }),
// });

// export const updatePatientSchema = z.object({
//   body: z.object({
//     UHID: z.string().optional(),
//     registrationType: z
//       .enum(['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis'])
//       .optional(),
//     admissionDetails: z
//       .object({
//         existingPatient: z.boolean().optional(),
//         reasonForAdmission: z.string().optional(),
//         IPD: z.string().optional(),
//         emergencyNo: z.string().optional(),
//         salutation: z.string().optional(),
//         patientName: z.string().optional(),
//         dateOfBirth: z
//           .string()
//           .refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format.' })
//           .optional(),
//         age: z
//           .object({
//             years: z.number().int().nonnegative().optional(),
//             months: z.number().int().min(0).max(11).optional(),
//           })
//           .optional(),
//       })
//       .optional(),
//     identityDetails: z
//       .object({
//         address: z.string().optional(),
//         city: z.string().optional(),
//         pinCode: z.string().optional(),
//         corporation: z.enum(['In-Corporation', 'Out-Corporation']).optional(),
//         responsiblePerson: z.string().optional(),
//         relationship: z.enum(['Parent', 'Spouse', 'Sibling', 'Other']).optional(),
//         relativeContactNo: z.string().optional(),
//         aadharNo: z.string().optional(),
//       })
//       .optional(),
//   }),
// });
