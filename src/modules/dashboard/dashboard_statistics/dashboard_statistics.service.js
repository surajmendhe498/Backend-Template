import { DashboardStatistics } from "./dashboard_statistics.model.js";
import { PATIENT_MASTER } from "../../patient_master/patient_master.model.js";

class Dashboard_statisticsService {

  async getAll() {
    const totalAdmittedPatients = await PATIENT_MASTER.countDocuments();
    const currentAdmittedPatients = await PATIENT_MASTER.countDocuments({ status: "Admitted" });
    const totalDischargedPatients = await PATIENT_MASTER.countDocuments({ status: "Discharged" });

    const stats = await DashboardStatistics.findOneAndUpdate(
      {},
      {
        totalAdmittedPatients,
        currentAdmittedPatients,
        totalDischargedPatients,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return stats;
  }
  
  async getTrends(year = new Date().getFullYear()) {
    // Aggregation pipeline to group by months and count admitted/discharged patients
    const trends = await PATIENT_MASTER.aggregate([
      {
        $match: {
          $or: [{ admissionDate: { $exists: true } }, { dischargeDate: { $exists: true } }],
          $expr: { $eq: [{ $year: "$admissionDate" }, year] }, 
        },
      },
      {
        $project: {
          month: { $month: "$admissionDate" },
          status: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          admitted: {
            $sum: { $cond: [{ $eq: ["$status", "Admitted"] }, 1, 0] },
          },
          discharged: {
            $sum: { $cond: [{ $eq: ["$status", "Discharged"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          admitted: 1,
          discharged: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const trendsWithMonthNames = trends.map((t) => ({
      month: months[t.month - 1],
      admitted: t.admitted,
      discharged: t.discharged,
    }));

    return trendsWithMonthNames;
  }
}

export default new Dashboard_statisticsService();
