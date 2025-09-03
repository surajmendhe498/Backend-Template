import mongoose from 'mongoose';

const fileRecordingSchema= new mongoose.Schema({
patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true },
admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },   

docs: [{ _id: false, name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
labReports: [{ _id: false, name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
radiologyReports: [{ _id: false, name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
// audioRecordings: [{ _id: false, name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
// videoRecordings: [{ _id: false, name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],

});

export const FILERECORDING_MODEL= mongoose.model('filesRecording', fileRecordingSchema)