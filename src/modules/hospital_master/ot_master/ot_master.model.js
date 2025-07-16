import mongoose from 'mongoose';

const OTMasterSchema = new mongoose.Schema({
  otName: { type: String, required: true },
  slotStatus: [
    {
      slotTime: { type: String, required: true }, 
      status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'] },
    },
  ],

  floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster',required: true},
  currentStatus: { type: String, enum: ['Active', 'Maintenance'] }, 
});

export const OTMASTER_MODEL= mongoose.model('otmasters', OTMasterSchema);
