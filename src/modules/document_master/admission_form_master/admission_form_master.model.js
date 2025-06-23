import mongoose from 'mongoose';

const PatientAdmissionSchema = new mongoose.Schema({
  fieldName: { type: String, required: true }, 
  showInPatientSticker: { type: Boolean, default: false }, 
  showInPageFloatingView: { type: Boolean, default: false },
  showInAdmissionCard: { type: Boolean, default: false }, 
  showInDischargeCard: { type: Boolean, default: false }, 
  isMandatory: { type: Boolean, default: false }, 
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active'
  }
});


export const PATIENTADMISSION_MODEL = mongoose.model('patientadmission', PatientAdmissionSchema);
