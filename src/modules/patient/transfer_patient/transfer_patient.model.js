import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true
  },
  admissionId: {  
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'patients.admissionDetails'
  },
  from: {
    floor: { type: String, required: true },
    bed: { type: String, required: true }
  },
  to: {
    floor: { type: String, required: true },
    bed: { type: String, required: true }
  },
  transferDate: { type: Date },
  transferTime: { type: String}
}, {
  timestamps: true
});

export const TRANSFER_MODEL = mongoose.model('transfer-patients', TransferSchema);
