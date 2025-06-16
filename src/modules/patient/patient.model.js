import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    existingPatient: { type: Boolean, default: false },
    reasonForAdmission: { type: String, required: true },
    UHID: { type: String, unique: true, required: true },
    IPD: { type: String },
    emergencyNo: { type: String },
    salutation: { type: String },
    patientName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    age: {
      years: { type: Number },
      months: { type: Number },
    },
    registrationType: {
      type: String,
      enum: ['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis'],
      required: true,
    },
  },
  { timestamps: true }
);

export const PATIENT_MODEL = mongoose.model('Patient', PatientSchema);
