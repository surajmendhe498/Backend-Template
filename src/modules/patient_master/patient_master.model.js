import mongoose from 'mongoose';

const PatientMasterSchema = new mongoose.Schema({
  patientPhoto: { type: String }, 
  patientName: { type: String, required: true },
  bedNo: { type: String},
  floor: { type: String }, 
  doctor: { type: String, required: true }, 
  paymentMode: { type: String, enum: ["Cash", "Card", "Online"], required: true },
  admissionDate: { type: Date, required: true },
  dischargeDate: { type: Date }, 
  duration: { type: String }, 
  admissionReason: { type: String }, 
  consultant: { type: String },
  dischargeSummaryStatus: { type: String, enum: ["Pending", "Completed"] },
  paymentDetails: {
    amount: { type: String }, 
  },
  status: { type: String, enum: ["Admitted", "Discharged"], required: true },
});

export const PATIENT_MASTER = mongoose.model('patient-masters', PatientMasterSchema);
