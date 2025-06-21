import mongoose from 'mongoose';

const IPDPatientDetailsSchema = new mongoose.Schema({
  patientName: { type: String, required: true }, 
  uhidNo: { type: String, required: true }, 
  ipdNo: { type: String, required: true }, 
  bedNo: { type: String }, 
  floor: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other']}, 
  doctor: { type: String }, 
  contactNo: { type: String }, 
  admissionDate: { type: Date }, 
  dischargeDate: { type: Date },
  status: { type: String, enum: ['Admitted', 'Discharged'] }, 
}, { timestamps: true });

export const IPD_Patient_Details = mongoose.model('ipd-patient-details', IPDPatientDetailsSchema);
