import mongoose from 'mongoose';

const LabMasterSchema = new mongoose.Schema(
  {
    labName: { type: String, required: true }, 
    department: { type: String, required: true }, 
    floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster',required: true},
    assignedDoctor: {type: String, required: true},
    assistantDoctor: {type: String, required: true},
    status: {type: Boolean, default: true}
  },
  { timestamps: true }
);

export const LABMASTER_MODEL= mongoose.model('labmaster', LabMasterSchema);
