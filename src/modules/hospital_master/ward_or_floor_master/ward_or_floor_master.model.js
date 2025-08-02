import mongoose from 'mongoose';

const FloorMasterSchema = new mongoose.Schema({
  floorName: { type: String, required: true }, 
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance '], 
    default: 'Active',
  },
});

export const FLOORMASTER_MODEL = mongoose.model('floormaster', FloorMasterSchema);


