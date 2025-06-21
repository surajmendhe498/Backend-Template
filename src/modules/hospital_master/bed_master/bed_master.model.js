import mongoose from 'mongoose';

const BedMasterSchema = new mongoose.Schema({
  floorName: { type: String},
  bedName: { type: String}, 
  applicableClass: { type: String},
  bedStatus: {
    type: String,
    enum: ['Vacant', 'Occupied', 'Under Maintenance'], 
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'], 
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, 
});

export const BEDMASTER_MODEL = mongoose.model('bedmaster', BedMasterSchema);
