import mongoose from "mongoose";

const AssignSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
  admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  from: { floor: String, bed: String },
  to: { floor: String, bed: String },
  assignDate: { type: Date },
  assignTime: { type: String },
}, { timestamps: true });

export const ASSIGN_MODEL = mongoose.model("assign-patients", AssignSchema);
