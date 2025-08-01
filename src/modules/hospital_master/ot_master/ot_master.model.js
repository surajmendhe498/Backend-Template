import mongoose from 'mongoose';

const OTMasterSchema = new mongoose.Schema({
  otName: { type: String, required: true },
  floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster',required: true},
  status: {
      type: String,
      enum: ['Active', 'Inactive', 'Maintenance'],
      default: 'Active'
    }
});

export const OTMASTER_MODEL= mongoose.model('otmasters', OTMasterSchema);
