import mongoose from 'mongoose';

const LabMasterSchema = new mongoose.Schema(
  {
    labName: { type: String, required: true }, 
    department: { type: String, required: true }, 
    // floorNumber: { type: String, required: true }, 
    floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster',required: true},
    status: { 
      type: String, 
      enum: ['Active', 'Maintenance'], 
      default: 'Active' 
    }, 
  },
  { timestamps: true }
);

export const LABMASTER_MODEL= mongoose.model('labmaster', LabMasterSchema);
