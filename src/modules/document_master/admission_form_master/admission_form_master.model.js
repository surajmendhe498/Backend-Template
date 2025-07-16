import mongoose from 'mongoose';

const PatientAdmissionSchema = new mongoose.Schema({
  fieldName: { type: String, required: true, unique: true },

  showInPatientSticker: { type: Boolean, default: false },
  showInPageFloatingView: { type: Boolean, default: false },
  showInAdmissionCard: { type: Boolean, default: false },
  showInDischargeCard: { type: Boolean, default: false },
  isMandatory: { type: Boolean, default: false },
  status: { type: Boolean, default: false }
});


export const PATIENTADMISSION_MODEL = mongoose.model('patientadmissionfield', PatientAdmissionSchema);
