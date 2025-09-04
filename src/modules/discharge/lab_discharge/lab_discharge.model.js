import mongoose from 'mongoose';

const labDischargeSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dateOfDischarge: { type: Date, required: true },
    timeOfDischarge: { type: String, required: true }, 
    remark: { type: String },
  }
);

export const LAB_DISCHARGE_MODEL= mongoose.model('lab-discharge', labDischargeSchema);