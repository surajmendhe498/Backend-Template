import mongoose from 'mongoose';

const finalDischargeSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dateOfDischarge: { type: Date, required: true },
    timeOfDischarge: { type: String, required: true }, 
    reasonForDischarge: { type: String },
  }
);

export const FINAL_DISCHARGE_MODEL= mongoose.model('final-discharge', finalDischargeSchema);