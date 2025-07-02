import mongoose from 'mongoose';

const NurseSchema = new mongoose.Schema(
  {
    nurseName: { type: String, required: true },
    contactNo: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    address: { type: String },
    city: { type: String },
    education: { type: String },
    speciality: { type: String },
    department: { type: String },
    shift: { type: String },
    word: { type: String },
    status: { type: Boolean, default: true },
    photo: { type: String }, 
    dateOfJoin: { type: Date, required: true },
  },
  {
    timestamps: true 
  }
);

export const NURSE_MODEL = mongoose.model('nurse', NurseSchema);
