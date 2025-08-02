import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    doctorName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    contactNo: { type: String, required: true },
    hospitalLandline: { type: String },
    education: { type: String, required: true },
    speciality: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'department', required: true },
    status: { type: Boolean, default: true },
    photo: { type: String }, 
    dateOfJoin: {type: Date}
  },
  { timestamps: true } 
);

export const DOCTOR_MODEL = mongoose.model("doctor", DoctorSchema);
