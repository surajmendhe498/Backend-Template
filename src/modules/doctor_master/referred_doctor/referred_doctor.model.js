import mongoose from "mongoose";

const ReferredDoctorSchema = new mongoose.Schema(
  {
    doctorName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    contactNo: { type: String, required: true },
    education: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true } 
);

export const REFERRED_DOCTOR_MODEL = mongoose.model("referred-doctor", ReferredDoctorSchema);
