import { DashboardStatistics } from "./dashboard_statistics.model.js";
import { PATIENT_MODEL } from "../../patient/patient.model.js";
import {DOCTOR_MODEL} from "../../doctor_master/doctor_master.model.js";
import {REFERRED_DOCTOR_MODEL} from "../../doctor_master/referred_doctor/referred_doctor.model.js";
import {NURSE_MODEL} from "../../nursing_master/nursing_master.model.js";
import { FINAL_DISCHARGE_MODEL } from "../../discharge/final_discharge/final_discharge.model.js";

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

// async getTrends(type = "monthly", year) {
//     const getTruncUnit = (t) => {
//       switch (t) {
//         case "daily": return "day";
//         case "weekly": return "week";
//         case "monthly": return "month";
//         case "yearly": return "year";
//         default: return "month";
//       }
//     };

//     const truncUnit = getTruncUnit(type);

//     // === Admissions ===
//     const admissionsPipeline = [
//       { $unwind: "$admissionDetails" },
//       {
//         $match: { "admissionDetails.admissionDate": { $exists: true, $ne: null } },
//       },
//       {
//         $addFields: {
//           admissionDate: {
//             $cond: [
//               { $eq: [{ $type: "$admissionDetails.admissionDate" }, "string"] },
//               { $toDate: "$admissionDetails.admissionDate" },
//               "$admissionDetails.admissionDate",
//             ],
//           },
//         },
//       },
//       ...(year ? [{
//         $match: {
//           $expr: { $eq: [{ $year: "$admissionDate" }, year] },
//         },
//       }] : []),
//       {
//         $group: {
//           _id: { $dateTrunc: { date: "$admissionDate", unit: truncUnit } },
//           admitted: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id": 1 } },
//     ];

//     // === Discharges ===
//     const dischargesPipeline = [
//       { $match: { dateOfDischarge: { $exists: true, $ne: null } } },
//       {
//         $addFields: {
//           dischargeDate: {
//             $cond: [
//               { $eq: [{ $type: "$dateOfDischarge" }, "string"] },
//               { $toDate: "$dateOfDischarge" },
//               "$dateOfDischarge",
//             ],
//           },
//         },
//       },
//       ...(year ? [{
//         $match: {
//           $expr: { $eq: [{ $year: "$dischargeDate" }, year] },
//         },
//       }] : []),
//       {
//         $group: {
//           _id: { $dateTrunc: { date: "$dischargeDate", unit: truncUnit } },
//           discharged: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id": 1 } },
//     ];

//     const [admissions, discharges] = await Promise.all([
//       PATIENT_MODEL.aggregate(admissionsPipeline),
//       FINAL_DISCHARGE_MODEL.aggregate(dischargesPipeline),
//     ]);

//     const trendsMap = new Map();
//     admissions.forEach((a) => {
//       trendsMap.set(a._id.toISOString(), {
//         date: a._id,
//         admitted: a.admitted,
//         discharged: 0,
//       });
//     });
//     discharges.forEach((d) => {
//       const key = d._id.toISOString();
//       if (trendsMap.has(key)) {
//         trendsMap.get(key).discharged = d.discharged;
//       } else {
//         trendsMap.set(key, {
//           date: d._id,
//           admitted: 0,
//           discharged: d.discharged,
//         });
//       }
//     });


  //   const rawTrends = Array.from(trendsMap.values()).sort((a, b) => a.date - b.date);

  //   // === Format output based on type ===
  //   const formattedTrends = rawTrends.map((t) => {
  //     const dateObj = new Date(t.date);
  //     if (type === "yearly") {
  //       return {
  //         year: dateObj.getUTCFullYear(),
  //         admitted: t.admitted,
  //         discharged: t.discharged,
  //       };
  //     } else if (type === "monthly") {
  //       return {
  //         month: dateObj.toLocaleString("en-US", { month: "long", year: "numeric" }),
  //         admitted: t.admitted,
  //         discharged: t.discharged,
  //       };
  //     } else if (type === "weekly") {
  //       const weekStart = dateObj.toISOString().split("T")[0];
  //       return {
  //         weekStart,
  //         admitted: t.admitted,
  //         discharged: t.discharged,
  //       };
  //     } else { // daily
  //       const day = dateObj.toISOString().split("T")[0];
  //       return {
  //         day,
  //         admitted: t.admitted,
  //         discharged: t.discharged,
  //       };
  //     }
  //   });

  //   return formattedTrends;
  // }
  async getTrends(type = "monthly", year) {
  const getTruncUnit = (t) => {
    switch (t) {
      case "daily": return "day";
      case "weekly": return "week";
      case "monthly": return "month";
      case "yearly": return "year";
      default: return "month";
    }
  };

  const truncUnit = getTruncUnit(type);

  // === Admissions ===
  const admissionsPipeline = [
    { $unwind: "$admissionDetails" },
    { $match: { "admissionDetails.admissionDate": { $exists: true, $ne: null } } },
    {
      $addFields: {
        admissionDate: {
          $cond: [
            { $eq: [{ $type: "$admissionDetails.admissionDate" }, "string"] },
            { $toDate: "$admissionDetails.admissionDate" },
            "$admissionDetails.admissionDate",
          ],
        },
      },
    },
    ...(year ? [{
      $match: { $expr: { $eq: [{ $year: "$admissionDate" }, year] } },
    }] : []),
    {
      $group: {
        _id: { $dateTrunc: { date: "$admissionDate", unit: truncUnit } },
        admitted: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ];

  // === Discharges ===
  const dischargesPipeline = [
    { $match: { dateOfDischarge: { $exists: true, $ne: null } } },
    {
      $addFields: {
        dischargeDate: {
          $cond: [
            { $eq: [{ $type: "$dateOfDischarge" }, "string"] },
            { $toDate: "$dateOfDischarge" },
            "$dateOfDischarge",
          ],
        },
      },
    },
    ...(year ? [{
      $match: { $expr: { $eq: [{ $year: "$dischargeDate" }, year] } },
    }] : []),
    {
      $group: {
        _id: { $dateTrunc: { date: "$dischargeDate", unit: truncUnit } },
        discharged: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ];

  const [admissions, discharges] = await Promise.all([
    PATIENT_MODEL.aggregate(admissionsPipeline),
    FINAL_DISCHARGE_MODEL.aggregate(dischargesPipeline),
  ]);

  const trendsMap = new Map();
  admissions.forEach((a) => {
    trendsMap.set(a._id.toISOString(), {
      date: a._id,
      admitted: a.admitted,
      discharged: 0,
    });
  });
  discharges.forEach((d) => {
    const key = d._id.toISOString();
    if (trendsMap.has(key)) {
      trendsMap.get(key).discharged = d.discharged;
    } else {
      trendsMap.set(key, {
        date: d._id,
        admitted: 0,
        discharged: d.discharged,
      });
    }
  });

  const rawTrends = Array.from(trendsMap.values()).sort((a, b) => a.date - b.date);

  // === Helper to get ISO Week Number ===
  const getISOWeek = (date) => {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  };

  // === Format Output ===
  const formattedTrends = rawTrends.map((t) => {
    const dateObj = new Date(t.date);

    if (type === "yearly") {
      return {
        year: dateObj.getUTCFullYear(),
        admitted: t.admitted,
        discharged: t.discharged,
      };
    }

    if (type === "monthly") {
      return {
        month: dateObj.toLocaleString("en-US", { month: "long", year: "numeric" }),
        admitted: t.admitted,
        discharged: t.discharged,
      };
    }

    if (type === "weekly") {
      const week = getISOWeek(dateObj);
      return {
        [`Week-${week}-${dateObj.getUTCFullYear()}`]: {
          admitted: t.admitted,
          discharged: t.discharged,
        },
      };
    }

    // === Daily ===
    return {
      day: dateObj.toISOString().split("T")[0],
      admitted: t.admitted,
      discharged: t.discharged,
    };
  });

  return {
    success: true,
    message: "Trends data fetched successfully",
    data: formattedTrends,
  };
}


async getGenderDistribution() {
  const genderStats = await PATIENT_MODEL.aggregate([
    {
      $group: {
        _id: "$identityDetails.gender", 
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
      const gender = typeof curr.gender === 'string' ? curr.gender.toLowerCase() : '';
      if (gender === "male") acc.male += curr.count;
      else if (gender === "female") acc.female += curr.count;
      else if (gender === "other") acc.other += curr.count;
      return acc;
    },
    { male: 0, female: 0, other: 0 }
  );

  return result;
}

// async getPatientAdmittedByTime(type = 'monthly') {
//   const admissions = await PATIENT_MODEL.aggregate([
//     { $unwind: "$admissionDetails" },
//     {
//       $group: {
//         _id: {
//           month: { $month: "$admissionDetails.admissionDate" },
//           year: { $year: "$admissionDetails.admissionDate" },
//           hour: "$admissionDetails.admissionTime"
//         },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { "_id.year": 1, "_id.month": 1, "_id.hour": 1 } }
//   ]);

//   const result = {};
//   admissions.forEach(adm => {
//     const monthYear = `${adm._id.month}-${adm._id.year}`; 
//     if (!result[monthYear]) result[monthYear] = [];

//     if (adm.count > 0) {
//       result[monthYear].push({
//         time: adm._id.hour,
//         count: adm.count
//       });
//     }
//   });

//   return {
//     success: true,
//     message: `Patient admitted by time (${type}) fetched successfully`,
//     type,
//     data: result
//   };
// }
async getPatientAdmittedByTime(type = 'monthly') {
  let groupId = {};
  if (type === 'daily') {
    groupId = {
      day: { $dayOfMonth: "$admissionDetails.admissionDate" },
      month: { $month: "$admissionDetails.admissionDate" },
      year: { $year: "$admissionDetails.admissionDate" },
      hour: "$admissionDetails.admissionTime"
    };
  } else if (type === 'monthly') {
    groupId = {
      month: { $month: "$admissionDetails.admissionDate" },
      year: { $year: "$admissionDetails.admissionDate" },
      hour: "$admissionDetails.admissionTime"
    };
  } else if (type === 'yearly') {
    groupId = {
      year: { $year: "$admissionDetails.admissionDate" },
      hour: "$admissionDetails.admissionTime"
    };
  }

  const admissions = await PATIENT_MODEL.aggregate([
    { $unwind: "$admissionDetails" },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
  ]);

  const result = {};

  admissions.forEach(adm => {
    let key = "";
    let entry = {};

    if (type === 'daily') {
      key = `${adm._id.day}-${adm._id.month}-${adm._id.year}`;
      entry = { time: adm._id.hour, count: adm.count };
      if (!result[key]) result[key] = [];
      if (adm.count > 0) result[key].push(entry);
    } else if (type === 'monthly') {
      key = `${adm._id.month}-${adm._id.year}`;
      entry = { time: adm._id.hour, count: adm.count };
      if (!result[key]) result[key] = [];
      if (adm.count > 0) result[key].push(entry);
    } else if (type === 'yearly') {
      key = `${adm._id.year}`;
      entry = { time: adm._id.hour, count: adm.count };
      if (!result[key]) result[key] = [];
      if (adm.count > 0) result[key].push(entry);
    }
  });

  return {
    success: true,
    message: `Patient admitted by time (${type}) fetched successfully`,
    type,
    data: result
  };
}

async getTotalHospitalStaff() {
    const [doctors, referredDoctors, nurses] = await Promise.all([
      DOCTOR_MODEL.countDocuments(),
      REFERRED_DOCTOR_MODEL.countDocuments(),
      NURSE_MODEL.countDocuments()
    ]);

    const totalHospitalStaff = doctors + referredDoctors + nurses;

    return {
      doctors,
      referredDoctors,
      nurses,
      totalHospitalStaff,
    };
  }

async getIpdDocumentStats(type = "monthly", year) {
    let groupFormat;
    switch (type) {
      case "yearly":
        groupFormat = "%Y";
        break;
      case "monthly":
        groupFormat = "%Y-%m";
        break;
      case "weekly":
        groupFormat = "%G-%V";
        break;
      case "daily":
      default:
        groupFormat = "%Y-%m-%d";
    }

    const matchStage = {
      "admissionDetails.registrationType": "IPD",
    };

    // Add year filter if provided
    if (year) {
      matchStage["admissionDetails.admissionDate"] = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    const pipeline = [
      { $unwind: "$admissionDetails" },
      { $match: matchStage }, 
      {
        $unwind: {
          path: "$admissionDetails.documentPdf",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: {
            period: {
              $dateToString: {
                format: groupFormat,
                date: "$admissionDetails.admissionDate",
              },
            },
          },
          totalDocs: { $sum: 1 },
        },
      },
      { $sort: { "_id.period": 1 } },
    ];

    const rawData = await PATIENT_MODEL.aggregate(pipeline);

    return rawData.map((item) => {
      if (type === "yearly") {
        return { year: item._id.period, totalDocs: item.totalDocs };
      } else if (type === "monthly") {
        const [yr, mo] = item._id.period.split("-");
        return { month: `${yr}-${mo}`, totalDocs: item.totalDocs };
      } else if (type === "weekly") {
        return { week: item._id.period, totalDocs: item.totalDocs };
      } else {
        return { date: item._id.period, totalDocs: item.totalDocs };
      }
    });
  }
 
}  



export default new Dashboard_statisticsService();
