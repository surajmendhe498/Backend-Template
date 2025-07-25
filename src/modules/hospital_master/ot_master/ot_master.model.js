import mongoose from 'mongoose';

const OTMasterSchema = new mongoose.Schema({
  otName: { type: String, required: true },
  floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster',required: true},
  status: {type: Boolean, default: true}, 
});

export const OTMASTER_MODEL= mongoose.model('otmasters', OTMasterSchema);
