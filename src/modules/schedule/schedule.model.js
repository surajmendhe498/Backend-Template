import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    otId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'otmasters',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    surgeryName: {
      type: String,
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const SCHEDULE_MODEL = mongoose.model('schedules', ScheduleSchema);
