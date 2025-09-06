import mongoose from "mongoose";

const ExchangeSchema = new mongoose.Schema({
  patientA: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
  admissionAId: { type: mongoose.Schema.Types.ObjectId, required: true },
  patientB: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
  admissionBId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fromA: { floor: String, bed: String },
  toA: { floor: String, bed: String },
  fromB: { floor: String, bed: String },
  toB: { floor: String, bed: String },
  exchangeDate: { type: Date },
  exchangeTime: { type: String }
}, { timestamps: true });

export const EXCHANGE_MODEL = mongoose.model("exchange-patients", ExchangeSchema);
