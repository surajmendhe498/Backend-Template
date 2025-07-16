import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true
  },
  from: {
    floor: { type: String, required: true },
    bed: { type: String, required: true }
  },
  to: {
    floor: { type: String, required: true },
    bed: { type: String, required: true }
  },
  transferDate: { type: String, required: true },
  transferTime: { type: String, required: true }
}, {
  timestamps: true
});

export const TRANSFER_MODEL = mongoose.model('transfers', TransferSchema);
