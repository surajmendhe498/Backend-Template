import mongoose from 'mongoose';

const pharmacyDischargeSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dateOfDischarge: { type: Date, required: true },
    timeOfDischarge: { type: String, required: true }, 
    remark: { type: String },
  }
);

export const PHARMACY_DISCHARGE_MODEL= mongoose.model('pharmacy-discharge', pharmacyDischargeSchema);