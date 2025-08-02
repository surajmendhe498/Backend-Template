import mongoose from 'mongoose';

const WardMasterSchema = new mongoose.Schema({
  wardName: { type: String, required: true },
  floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster', required: true},
  status: {
      type: String,
      enum: ['Active', 'Inactive', 'Maintenance'],
      default: 'Active'
    }
});

export const WARDMASTER_MODEL= mongoose.model('wardmaster', WardMasterSchema);
