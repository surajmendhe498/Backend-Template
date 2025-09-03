import mongoose from 'mongoose';

const fileRecordingSchema= new mongoose.Schema({
patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true },
admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },   

audioRecordings: [{ _id: false, name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
videoRecordings: [{ _id: false, name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],

});

export const AUDIOVIDEOREC_MODEL= mongoose.model('audio-video-rec', fileRecordingSchema)