import mongoose from 'mongoose';

const fileRecordingSchema= new mongoose.Schema({
patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true },
admissionId: { type: mongoose.Schema.Types.ObjectId, required: true },   

docs: [{ _id: false, name: String, path: String }],
labReports: [{ _id: false, name: String, path: String }],
audioRecordings: [{ _id: false, name: String, path: String }],
videoRecordings: [{ _id: false, name: String, path: String }],

});

export const FILERECORDING_MODEL= mongoose.model('filesRecording', fileRecordingSchema)