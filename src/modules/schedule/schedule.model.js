import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    otId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'otmasters',
      required: true
    },
    surgeryName: {
      type: String,
      required: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patients',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'doctor',
      required: true
    },
    startDateTime: {
      type: Date,
      required: true
    },
    endDateTime: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export const SCHEDULE_MODEL = mongoose.model('schedules', ScheduleSchema);
