import mongoose from 'mongoose';

const DashboardStatisticsSchema = new mongoose.Schema({
  totalAdmittedPatients: { type: Number, default: 0 },
  currentAdmittedPatients: { type: Number, default: 0 },
  totalDischargedPatients: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }, 
});

export const DashboardStatistics = mongoose.model('dashboard-statistics', DashboardStatisticsSchema);
