import mongoose from 'mongoose';

const LabMasterSchema = new mongoose.Schema(
  {
    labName: { type: String, required: true }, 
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'department', required: true }, 
    floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster',required: true},
    assignedDoctor: {type: String, required: true},
    assistantDoctor: {type: String, required: true},
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Maintenance'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

export const LABMASTER_MODEL= mongoose.model('labmaster', LabMasterSchema);
