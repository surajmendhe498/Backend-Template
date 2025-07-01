import mongoose from 'mongoose';

const FloorMasterSchema = new mongoose.Schema({
  floorName: { type: String, required: true }, 
  floorNumber: { type: Number, required: true }, 
  status: {
    type: String,
    enum: ['Active', 'Inactive'], 
    default: 'Active',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, 
});

export const FLOORMASTER_MODEL = mongoose.model('floormaster', FloorMasterSchema);


