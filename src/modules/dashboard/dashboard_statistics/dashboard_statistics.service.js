import { DashboardStatistics } from "./dashboard_statistics.model.js";
import { PATIENT_MODEL } from "../../patient/patient.model.js";

class Dashboard_statisticsService {
  async getAll() {
    const totalAdmittedPatients = await PATIENT_MODEL.countDocuments();
    const currentAdmittedPatients = await PATIENT_MODEL.countDocuments({ "admissionDetails.patientStatus": "Admitted" });
    const totalDischargedPatients = await PATIENT_MODEL.countDocuments({ "admissionDetails.patientStatus": "Discharged" });

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
  const trends = await PATIENT_MODEL.aggregate([
    {
      $match: {
        "admissionDetails.admissionDate": {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
        "admissionDetails.patientStatus": { $in: ["Admitted", "Discharged"] },
      },
    },
    {
      $project: {
        month: { $month: "$admissionDetails.admissionDate" },
        status: "$admissionDetails.patientStatus",
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

  const trendsWithMonthNames = Array(12).fill(0).map((_, index) => {
    const monthData = trends.find((t) => t.month === index + 1) || { admitted: 0, discharged: 0 };
    return {
      month: months[index],
      admitted: monthData.admitted,
      discharged: monthData.discharged,
    };
  });

  return trendsWithMonthNames;
}

async getGenderDistribution() {
    const genderStats = await PATIENT_MODEL.aggregate([
      {
        $group: {
          _id: "$admissionDetails.gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          gender: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const result = genderStats.reduce(
      (acc, curr) => {
        if (curr.gender.toLowerCase() === "male") {
          acc.male += curr.count;
        } else if (curr.gender.toLowerCase() === "female") {
          acc.female += curr.count;
        }
        return acc;
      },
      { male: 0, female: 0 }
    );

    return result;
  }

}

export default new Dashboard_statisticsService();
