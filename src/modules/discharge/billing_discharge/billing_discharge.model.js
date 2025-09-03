import mongoose from 'mongoose';

const billingDischargeSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dateOfDischarge: { type: Date, required: true },
    timeOfDischarge: { type: String, required: true }, 
    remark: { type: String },
  }
);

export const BILLING_DISCHARGE_MODEL= mongoose.model('billing-discharge', billingDischargeSchema);