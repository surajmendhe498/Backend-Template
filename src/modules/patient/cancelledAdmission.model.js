// import mongoose from 'mongoose';

// const CancelledAdmissionSchema = new mongoose.Schema({
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true },
//   admissionId: { type: Object, required: true },
//   reason: {
//     type: String,
//     required: true,
//     enum: ["Financial Issue", "Double Entry", "Low/High BP", "Fever", "Shifting to other hospital", "Ayushman Card Issue"], 
//   },
//   cancelledAt: { type: Date, default: Date.now },
// });

// export const CANCELLED_ADMISSION_MODEL = mongoose.model('cancelled_admissions', CancelledAdmissionSchema);

import mongoose from 'mongoose';

const CancelledAdmissionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true },
  admissionId: { type: Object, required: true },
  reason: {
    type: String,
    required: true,
    enum: ["Financial Issue", "Double Entry", "Low/High BP", "Fever", "Shifting to other hospital", "Ayushman Card Issue"], 
  },
  patientIdentity: { type: mongoose.Schema.Types.Mixed, required: true }, // store identity snapshot
  admissionDetails: { type: mongoose.Schema.Types.Mixed, required: true }, // store admission snapshot
  cancelledAt: { type: Date, default: Date.now },
});


export const CANCELLED_ADMISSION_MODEL = mongoose.model('cancelled_admissions', CancelledAdmissionSchema);
