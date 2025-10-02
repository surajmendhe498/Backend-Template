import mongoose from "mongoose";

const SentMessageSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
  admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reportType: { type: String, enum: ["docs", "labReports", "radiologyReports"], required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, required: true },
  target: { type: String, enum: ["doctor", "patient"], required: true },
  recipientNumber: { type: String, required: true },
  messageSid: { type: String },  // Twilio SID
  status: { type: String, default: "sent" }, // sent, failed, delivered
  createdAt: { type: Date, default: Date.now }
});

export const SENT_MESSAGE_MODEL = mongoose.model("sent_messages", SentMessageSchema);
