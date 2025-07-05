import { DashboardStatistics } from "./dashboard_statistics.model.js";
import { PATIENT_MODEL } from "../../patient/patient.model.js";
import { startOfDay, endOfDay } from 'date-fns';

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

  // Get patient admitted by time
  async getPatientAdmittedByTime(date) {
  const selectedDate = new Date(date);
  const start = startOfDay(selectedDate);
  const end = endOfDay(selectedDate);

  const patients = await PATIENT_MODEL.find({
    "admissionDetails.admissionDate": { $gte: start, $lte: end },
    // "admissionDetails.patientStatus": "Admitted" 
  });

  const hourlyCount = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    count: 0,
  }));

  for (const patient of patients) {
    const timeStr = patient.admissionDetails?.timeOfAdmission; 
    if (!timeStr) continue;

    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const hourLabel = `${hours.toString().padStart(2, '0')}:00`;

    const slot = hourlyCount.find((h) => h.hour === hourLabel);
    if (slot) slot.count += 1;
  }

  return hourlyCount;
}
}

export default new Dashboard_statisticsService();
