// import { PATIENT_MODEL } from "../patient/patient.model.js";
// import { FINAL_DISCHARGE_MODEL } from "../discharge/final_discharge/final_discharge.model.js";

// class Reports_masterService {

// async getMonthlyReports(filters) {
//   try {
//     const year = parseInt(filters.year, 10) || new Date().getFullYear();
//     const month = filters.month ? parseInt(filters.month, 10) - 1 : null;

//     let startDate = null;
//     let endDate = null;

//     if (month !== null) {
//       startDate = new Date(year, month, 1, 0, 0, 0);
//       endDate = new Date(year, month + 1, 1, 0, 0, 0);
//     } else if (filters.year) {
//       startDate = new Date(year, 0, 1, 0, 0, 0);  
//       endDate = new Date(year + 1, 0, 1, 0, 0, 0); 
//     }

//     const query = {};
//     if (filters.gender) {
//       query["identityDetails.gender"] = filters.gender; 
//     }

//     const patients = await PATIENT_MODEL.find(query)
//       .populate("admissionDetails.bedId", "bedName")
//       .populate("admissionDetails.consultingDoctorId", "doctorName")
//       .lean();

//     const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
//     const dischargeMap = new Map();
//     finalDischarges.forEach((d) => dischargeMap.set(d.admissionId.toString(), d));

//     // Filter admissions by date & patientStatus
//     const results = patients.flatMap((patient) => {
//       const matchedAdmissions = patient.admissionDetails.filter((admission) => {
//         const adDate = new Date(admission.admissionDate);

//         // Filter by year/month if provided
//         let dateMatch = true;
//         if (startDate && endDate) {
//           dateMatch = adDate >= startDate && adDate < endDate;
//         }

//         // Filter by patientStatus (optional)
//         let statusMatch = true;
//         if (filters.patientStatus) {
//           statusMatch = admission.patientStatus === filters.patientStatus;
//         }

//         return dateMatch && statusMatch;
//       });

//       return matchedAdmissions.map((admission) =>
//         this.formatPatient({ ...patient, admissionDetails: [admission] }, dischargeMap)[0]
//       );
//     });

//     return results;
//   } catch (error) {
//     console.error("Error fetching monthly reports:", error);
//     throw new Error("Failed to fetch monthly reports.");
//   }
// }

// async getReportsByDateRange({ fromDate, toDate, fromTime, toTime }) {
//   try {
//     let start = null;
//     let end = null;

//     if (fromDate) {
//       start = new Date(fromDate);
//       start.setHours(0, 0, 0, 0);
//     }
//     if (toDate) {
//       end = new Date(toDate);
//       end.setHours(23, 59, 59, 999);
//     }

//     const admissionMatch = {};
//     if (start && end) {
//       admissionMatch.admissionDate = { $gte: start, $lte: end };
//     } else if (start) {
//       admissionMatch.admissionDate = { $gte: start };
//     } else if (end) {
//       admissionMatch.admissionDate = { $lte: end };
//     }

//     if (fromTime && toTime) {
//       admissionMatch.admissionTime = { $gte: fromTime, $lte: toTime };
//     }

//     const patients = await PATIENT_MODEL.find({
//       admissionDetails: { $elemMatch: admissionMatch },
//     })
//       .populate("admissionDetails.bedId", "bedName")
//       .populate("admissionDetails.consultingDoctorId", "doctorName")
//       .lean();

    
//     const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
//     const dischargeMap = new Map();
//     finalDischarges.forEach((d) => {
//       dischargeMap.set(d.admissionId.toString(), d);
//     });

//     const filteredPatients = patients.map((p) => {
//       const filteredAdmissions = p.admissionDetails.filter((a) => {
//         const adDate = new Date(a.admissionDate);
//         if (start && adDate < start) return false;
//         if (end && adDate > end) return false;
//         return true;
//       });
//       return { ...p, admissionDetails: filteredAdmissions };
//     });

//     const validPatients = filteredPatients.filter(
//       (p) => p.admissionDetails.length > 0
//     );

//     const results = validPatients.flatMap((patient) =>
//       this.formatPatient(patient, dischargeMap)
//     );

//     return results;
//   } catch (error) {
//     console.error("Error fetching date range reports:", error);
//     throw new Error("Failed to fetch date range reports.");
//   }
// }

// async getConsultantReports({ admissionDate, dischargeDate, mlcType, patientStatus, gender }) {
//   try {
//     // Preload all discharges
//     const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
//     const dischargeMap = new Map();
//     finalDischarges.forEach((d) => dischargeMap.set(d.admissionId.toString(), d));

//     // Build patient-level query (only gender filter goes to DB)
//     const query = {};
//     if (gender) {
//       query["identityDetails.gender"] = gender;
//     }

//     // Fetch patients
//     let patients = await PATIENT_MODEL.find(query)
//       .populate("admissionDetails.bedId", "bedName")
//       .populate("admissionDetails.consultingDoctorId", "doctorName")
//       .lean();

//     // Now filter admissionDetails manually
//     const filteredPatients = patients.map((p) => {
//       const admissions = p.admissionDetails.filter((a) => {
//         let matches = true;

//         // Admission Date filter (EXACT match to the provided date)
//         if (admissionDate) {
//           const filterDate = new Date(admissionDate);
//           const admissionOnlyDate = new Date(a.admissionDate);
//           matches =
//             matches &&
//             admissionOnlyDate.toISOString().split("T")[0] ===
//               filterDate.toISOString().split("T")[0];
//         }

//         // Discharge Date filter (EXACT match)
//         if (dischargeDate) {
//           const discharge = dischargeMap.get(a._id.toString());
//           if (discharge) {
//             const filterDate = new Date(dischargeDate);
//             matches =
//               matches &&
//               discharge.dateOfDischarge.toISOString().split("T")[0] ===
//                 filterDate.toISOString().split("T")[0];
//           } else {
//             matches = false;
//           }
//         }

//         // Patient status filter
//         if (patientStatus) {
//           matches = matches && a.patientStatus === patientStatus;
//         }

//         // MLC type filter
//         if (mlcType !== undefined) {
//           matches =
//             matches && a.mlcType === (mlcType === "true" || mlcType === true);
//         }

//         return matches;
//       });

//       return { ...p, admissionDetails: admissions };
//     });

//     // Keep only patients who still have admissions
//     const finalPatients = filteredPatients.filter(
//       (p) => p.admissionDetails.length > 0
//     );

//     // Flatten and format
//     return finalPatients.flatMap((patient) =>
//       this.formatPatient(patient, dischargeMap)
//     );
//   } catch (error) {
//     console.error("Error fetching consultant reports:", error);
//     throw new Error("Failed to fetch consultant reports.");
//   }
// }

//   formatPatient(patient, dischargeMap) {
//     return patient.admissionDetails.map((admission) => {
//       const admissionDate = admission.admissionDate;
//       const admissionTime = admission.admissionTime;

//       // check if discharged
//       const discharge =
//         dischargeMap.get(admission._id?.toString()) || null;

//       const dischargeDate = discharge?.dateOfDischarge || null;
//       const dischargeTime = discharge?.timeOfDischarge || null;

//       const duration = this.calculateDuration(
//         admissionDate,
//         dischargeDate,
//         admissionTime,
//         dischargeTime
//       );

//       const bedNo = admission.bedId?.bedName || "N/A";

//       return {
//         patientPhoto: admission.patientPhoto,
//         patientName: patient.identityDetails.patientName,
//         doctor: admission.consultingDoctorId?.doctorName || "N/A",
//         paymentMode: admission.paymentMode,
//         bedNo,
//         admissionDate,
//         dischargeDate,
//         duration,
//       };
//     });
//   }

//   calculateDuration(
//     admissionDate,
//     dischargeDate,
//     timeOfAdmission,
//     timeOfDischarge
//   ) {
//     if (!admissionDate || !dischargeDate) return "N/A";

//     const admission = new Date(
//       `${admissionDate.toISOString().split("T")[0]}T${this.formatTimeToISO(
//         timeOfAdmission
//       )}`
//     );
//     const discharge = new Date(
//       `${dischargeDate.toISOString().split("T")[0]}T${this.formatTimeToISO(
//         timeOfDischarge
//       )}`
//     );
//     const diffMs = discharge - admission;

//     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//     );
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//     return `${days} Days ${hours} Hours ${minutes} Minutes`;
//   }

//   formatTimeToISO(time) {
//     if (!time) return "00:00:00";
//     const [timePart, modifier] = time.split(" ");
//     let [hours, minutes] = timePart.split(":").map(Number);

//     if (modifier === "PM" && hours !== 12) hours += 12;
//     if (modifier === "AM" && hours === 12) hours = 0;

//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}:00`;
//   }
// }

// export default new Reports_masterService();


import { PATIENT_MODEL } from "../patient/patient.model.js";
import { FINAL_DISCHARGE_MODEL } from "../discharge/final_discharge/final_discharge.model.js";

class Reports_masterService {

async getMonthlyReports(filters) {
  try {
    let query = {};

    // Month filter (just check if any admission exists; detailed filter applied later)
    if (filters?.month) {
      query["admissionDetails.admissionDate"] = { $exists: true };
    }

    // Year filter (just check if any admission exists; detailed filter applied later)
    if (filters?.year) {
      query["admissionDetails.admissionDate"] = query["admissionDetails.admissionDate"] || {};
      query["admissionDetails.admissionDate"]["$exists"] = true;
    }

    // Gender
    if (filters?.gender) {
      query["identityDetails.gender"] = filters.gender;
    }

    // Age
    if (filters?.age) {
      query["identityDetails.age.years"] = Number(filters.age);
    }

    // Payment Mode
    if (filters?.paymentMode) {
      query["admissionDetails.paymentMode"] = filters.paymentMode;
    }

    // Payment Details
    if (filters?.paymentDetails) {
      query["admissionDetails.paymentDetails"] = { $regex: filters.paymentDetails, $options: "i" };
    }

    // Religion
    if (filters?.religion) {
      query["identityDetails.religion"] = filters.religion;
    }

    // Consultant
    if (filters?.consultant) {
      query["admissionDetails.consultant"] = filters.consultant;
    }

    // Other Consultant
    if (filters?.otherConsultant) {
      query["admissionDetails.otherConsultant"] = filters.otherConsultant;
    }

    // MLC Type
    if (filters?.mlcType !== undefined) {
      query["admissionDetails.mlcType"] = filters.mlcType === "true" || filters.mlcType === true;
    }

    // Discharge Summary Type
    if (filters?.dischargeSummaryType) {
      query["dischargeDetails.summaryType"] = filters.dischargeSummaryType;
    }

    // Discharge Reason
    if (filters?.dischargeReason) {
      query["dischargeDetails.reason"] = { $regex: filters.dischargeReason, $options: "i" };
    }

    // Birth/Death
    if (filters?.birthDeath) {
      query["admissionDetails.birthDeath"] = filters.birthDeath;
    }

    // Fetch patients
    let reports = await PATIENT_MODEL.find(query)
      .populate("admissionDetails.consultingDoctorId", "doctorName")
      .populate("admissionDetails.referredByDoctorId", "doctorName")
      .populate("admissionDetails.bedId", "bedName")
      .populate("admissionDetails.admissionReasonId", "admissionReason")
      .populate("admissionDetails.floorId", "floorName")
      .lean();

    // Month filter applied manually
    if (filters?.month) {
      const monthNum = Number(filters.month);
      reports = reports.filter((p) =>
        p.admissionDetails.some((admission) => {
          const adDate = new Date(admission.admissionDate);
          return adDate.getMonth() + 1 === monthNum;
        })
      );
    }

    // Year filter applied manually
    if (filters?.year) {
      const yearNum = Number(filters.year);
      reports = reports.filter((p) =>
        p.admissionDetails.some((admission) => {
          const adDate = new Date(admission.admissionDate);
          return adDate.getFullYear() === yearNum;
        })
      );
    }

    // Reason for Admission filter
    if (filters?.reasonForAdmission) {
      const searchText = filters.reasonForAdmission.toLowerCase();
      reports = reports.filter((p) =>
        p.admissionDetails.some(
          (admission) =>
            admission.admissionReasonId &&
            admission.admissionReasonId.admissionReason &&
            admission.admissionReasonId.admissionReason.toLowerCase().includes(searchText)
        )
      );
    }

    // Referred Doctor filter
    if (filters?.referredDoctor) {
      const searchText = filters.referredDoctor.toLowerCase();
      reports = reports.filter((p) =>
        p.admissionDetails.some(
          (admission) =>
            admission.referredByDoctorId &&
            admission.referredByDoctorId.doctorName.toLowerCase().includes(searchText)
        )
      );
    }

    // Floor filter
    if (filters?.floorId) {
      const searchText = filters.floorId.toLowerCase();
      reports = reports.filter((p) =>
        p.admissionDetails.some(
          (admission) =>
            admission.floorId &&
            admission.floorId.floorName &&
            admission.floorId.floorName.toLowerCase().includes(searchText)
        )
      );
    }

    // Patient Status filter (inside admissionDetails)
    if (filters?.patientStatus) {
      const statusText = filters.patientStatus.toLowerCase();
      reports = reports
        .map((p) => {
          const filteredAdmissions = p.admissionDetails.filter(
            (admission) =>
              admission.patientStatus &&
              admission.patientStatus.toLowerCase() === statusText
          );
          return { ...p, admissionDetails: filteredAdmissions };
        })
        .filter((p) => p.admissionDetails.length > 0); // remove patients with no matching admissions
    }

    return reports;
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    throw new Error("Failed to fetch monthly reports.");
  }
}


// async getReportsByDateRange({ fromDate, toDate, fromTime, toTime }) {
//   try {
//     let start = null;
//     let end = null;

//     if (fromDate) {
//       start = new Date(fromDate);
//       start.setHours(0, 0, 0, 0);
//     }
//     if (toDate) {
//       end = new Date(toDate);
//       end.setHours(23, 59, 59, 999);
//     }

//     const admissionMatch = {};
//     if (start && end) {
//       admissionMatch.admissionDate = { $gte: start, $lte: end };
//     } else if (start) {
//       admissionMatch.admissionDate = { $gte: start };
//     } else if (end) {
//       admissionMatch.admissionDate = { $lte: end };
//     }

//     if (fromTime && toTime) {
//       admissionMatch.admissionTime = { $gte: fromTime, $lte: toTime };
//     }

//     const patients = await PATIENT_MODEL.find({
//       admissionDetails: { $elemMatch: admissionMatch },
//     })
//       .populate("admissionDetails.bedId", "bedName")
//       .populate("admissionDetails.consultingDoctorId", "doctorName")
//       .lean();

    
//     const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
//     const dischargeMap = new Map();
//     finalDischarges.forEach((d) => {
//       dischargeMap.set(d.admissionId.toString(), d);
//     });

//     const filteredPatients = patients.map((p) => {
//       const filteredAdmissions = p.admissionDetails.filter((a) => {
//         const adDate = new Date(a.admissionDate);
//         if (start && adDate < start) return false;
//         if (end && adDate > end) return false;
//         return true;
//       });
//       return { ...p, admissionDetails: filteredAdmissions };
//     });

//     const validPatients = filteredPatients.filter(
//       (p) => p.admissionDetails.length > 0
//     );

//     const results = validPatients.flatMap((patient) =>
//       this.formatPatient(patient, dischargeMap)
//     );

//     return results;
//   } catch (error) {
//     console.error("Error fetching date range reports:", error);
//     throw new Error("Failed to fetch date range reports.");
//   }
// }

async getReportsByDateRange(filters) {
    try {
      const {
        fromDate, toDate, fromTime, toTime,
        mlcType, patientStatus, gender, age,
        reasonForAdmission, paymentMode, paymentDetails,
        corporation, vaccination, vaccineType, doses, consultant, birthDeath
      } = filters;

      let query = {};

      // Filter by identityDetails
      if (gender) query["identityDetails.gender"] = gender;
      if (age) query["identityDetails.age.years"] = Number(age);

      // Filter by admissionDetails using $elemMatch
      const admissionMatch = {};

  if (fromDate && toDate) {
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(toDate);
  end.setHours(23, 59, 59, 999);

  admissionMatch.admissionDate = { $gte: start, $lte: end };
}
    if (fromTime && toTime) {
      const startTime = fromTime.toString().padStart(5, "0"); 
      const endTime = toTime.toString().padStart(5, "0");

      admissionMatch.admissionTime = { $gte: startTime, $lte: endTime };
    }

      if (mlcType !== undefined) admissionMatch.mlcType = mlcType === 'true' || mlcType === true;
      if (patientStatus) admissionMatch.patientStatus = patientStatus;
      if (reasonForAdmission) 
  admissionMatch.admissionReasonId = reasonForAdmission; // must be an ObjectId string

      if (paymentMode) admissionMatch.paymentMode = paymentMode;
      if (paymentDetails) admissionMatch.paymentDetails = { $regex: paymentDetails, $options: 'i' };
      if (corporation) admissionMatch.corporation = { $regex: corporation, $options: 'i' };
      if (vaccination) admissionMatch.vaccinationDetails = { $regex: vaccination, $options: 'i' };
      if (vaccineType) admissionMatch.vaccineType = { $regex: vaccineType, $options: 'i' };
      if (doses) admissionMatch.doses = Number(doses);
      if (consultant) admissionMatch.consultantUnit = { $regex: consultant, $options: 'i' };
      if (birthDeath) admissionMatch.patientDetail = birthDeath;

      query.admissionDetails = { $elemMatch: admissionMatch };

      const patients = await PATIENT_MODEL.find(query)
        .populate("admissionDetails.consultingDoctorId", "doctorName")
        .populate("admissionDetails.referredByDoctorId", "doctorName")
        .populate("admissionDetails.bedId", "bedName")
        .populate("admissionDetails.admissionReasonId", "admissionReason")
        .populate("admissionDetails.floorId", "floorName")
        .lean();

      return patients;
    } catch (error) {
      console.error("Error fetching date range reports:", error);
      throw new Error("Failed to fetch date range reports.");
    }
  }

async getConsultantReports(filters) {
  try {
    const {
      admissionDate,
      dischargeDate,   // exact date
      mlcType,
      patientStatus,
      gender,
      age,
      reasonForAdmission,
      paymentMode,
      paymentDetails,
      corporation,
      vaccination,
      vaccineType,
      doses,
      consultant,
      otherConsultant,
      dischargeSummaryType,
      dischargeReason,
      floorId,
      birthDeath
    } = filters;

    const query = {};
    if (gender) query["identityDetails.gender"] = gender;
    if (age) query["identityDetails.age.years"] = Number(age);

    const admissionMatch = {};

    // Admission Date Filter
    if (admissionDate) {
      const start = new Date(admissionDate + "T00:00:00.000Z");
      const end = new Date(admissionDate + "T23:59:59.999Z");
      admissionMatch.admissionDate = { $gte: start, $lte: end };
    }

    if (mlcType !== undefined) admissionMatch.mlcType = mlcType === "true" || mlcType === true;
    if (patientStatus) admissionMatch.patientStatus = patientStatus;
    if (reasonForAdmission) admissionMatch.admissionReasonId = reasonForAdmission;
    if (paymentMode) admissionMatch.paymentMode = paymentMode;
    if (paymentDetails) admissionMatch.paymentDetails = { $regex: paymentDetails, $options: "i" };
    if (corporation) admissionMatch.corporation = { $regex: corporation, $options: "i" };
    if (vaccination) admissionMatch.vaccinationDetails = { $regex: vaccination, $options: "i" };
    if (vaccineType) admissionMatch.vaccineType = { $regex: vaccineType, $options: "i" };
    if (doses) admissionMatch.doses = Number(doses);
    if (consultant) admissionMatch.consultantUnit = { $regex: consultant, $options: "i" };
    if (otherConsultant) admissionMatch.otherConsultant = { $regex: otherConsultant, $options: "i" };
    if (dischargeSummaryType) admissionMatch.dischargeDetails = { summaryType: dischargeSummaryType };
    if (dischargeReason) admissionMatch.reasonForDischarge = dischargeReason;
    if (floorId) admissionMatch.floorId = floorId;
    if (birthDeath) admissionMatch.patientDetail = birthDeath;

    // Filter admissionDetails directly in query
    if (dischargeDate) {
      const start = new Date(dischargeDate + "T00:00:00.000Z");
      const end = new Date(dischargeDate + "T23:59:59.999Z");
      admissionMatch.finalDischargeDate = { $gte: start, $lte: end };
    }

    query.admissionDetails = { $elemMatch: admissionMatch };

    // Fetch patients
    const patients = await PATIENT_MODEL.find(query)
      .populate("admissionDetails.consultingDoctorId", "doctorName")
      .populate("admissionDetails.referredByDoctorId", "doctorName")
      .populate("admissionDetails.bedId", "bedName")
      .populate("admissionDetails.admissionReasonId", "admissionReason")
      .populate("admissionDetails.floorId", "floorName")
      .lean();

    return {
      success: true,
      message: "Consultant reports fetched successfully",
      data: patients
    };

  } catch (error) {
    console.error("Error fetching consultant reports:", error);
    throw new Error("Failed to fetch consultant reports.");
  }
}


  formatPatient(patient, dischargeMap) {
    return patient.admissionDetails.map((admission) => {
      const admissionDate = admission.admissionDate;
      const admissionTime = admission.admissionTime;

      // check if discharged
      const discharge =
        dischargeMap.get(admission._id?.toString()) || null;

      const dischargeDate = discharge?.dateOfDischarge || null;
      const dischargeTime = discharge?.timeOfDischarge || null;

      const duration = this.calculateDuration(
        admissionDate,
        dischargeDate,
        admissionTime,
        dischargeTime
      );

      const bedNo = admission.bedId?.bedName || "N/A";

      return {
        patientPhoto: admission.patientPhoto,
        patientName: patient.identityDetails.patientName,
        doctor: admission.consultingDoctorId?.doctorName || "N/A",
        paymentMode: admission.paymentMode,
        bedNo,
        admissionDate,
        dischargeDate,
        duration,
      };
    });
  }

  calculateDuration(
    admissionDate,
    dischargeDate,
    timeOfAdmission,
    timeOfDischarge
  ) {
    if (!admissionDate || !dischargeDate) return "N/A";

    const admission = new Date(
      `${admissionDate.toISOString().split("T")[0]}T${this.formatTimeToISO(
        timeOfAdmission
      )}`
    );
    const discharge = new Date(
      `${dischargeDate.toISOString().split("T")[0]}T${this.formatTimeToISO(
        timeOfDischarge
      )}`
    );
    const diffMs = discharge - admission;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} Days ${hours} Hours ${minutes} Minutes`;
  }

  formatTimeToISO(time) {
    if (!time) return "00:00:00";
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  }
}

export default new Reports_masterService();
