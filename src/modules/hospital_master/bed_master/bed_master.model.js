import mongoose from 'mongoose';

const BedMasterSchema = new mongoose.Schema({
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'floormaster', 
    required: true,
  },
  bedName: { type: String}, 
  applicableClass: { type: String},
  bedStatus: {
    type: String,
    enum: ['Vacant', 'Occupied', 'Under Maintenance'], 
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'department',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'], 
    required: true,
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'wardmaster',
  }
});

export const BEDMASTER_MODEL = mongoose.model('bedmaster', BedMasterSchema);
