import mongoose from 'mongoose';

const PreRegistrationInsuranceSchema = new mongoose.Schema({
  tpaName: { type: String },
  policyNo: { type: String },
  ccnNo: { type: String },
  insurance: { type: String },
  scheme: { type: String },
  corporate: { type: String },
  companyName: { type: String },
  claimStatus: { type: String },
}, { timestamps: true });

export const PRE_REGISTRATION_MODEL = mongoose.model('pre_registration_insurance', PreRegistrationInsuranceSchema);
