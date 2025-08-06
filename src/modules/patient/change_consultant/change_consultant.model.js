import mongoose from 'mongoose';

const ConsultantChangeSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patients',
      required: true,
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    consultingDoctorName: {
      type: String,
      required: true,
    },
    changeDate: {
      type: Date,
      required: true,
    },
    changeTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CONSULTANT_CHANGE_MODEL = mongoose.model('consultant-change', ConsultantChangeSchema);
