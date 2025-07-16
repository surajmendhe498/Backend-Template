import mongoose from 'mongoose';

const admissionReasonSchema= new mongoose.Schema({
   admissionReason: {
    type: String,
    required: true
   }
});

export const ADMISSION_REASON_MODEL= mongoose.model('admission-reason', admissionReasonSchema);