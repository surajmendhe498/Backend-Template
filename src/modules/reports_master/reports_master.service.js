// import { PATIENT_MODEL } from '../patient/patient.model.js';

// class Reports_masterService {
//   async getMonthlyReports(filters) {
//     const query = {};

//     if (filters?.month) {
//       const startDate = new Date(`${filters.year || new Date().getFullYear()}-${filters.month}-01`);
//       const endDate = new Date(startDate);
//       endDate.setMonth(endDate.getMonth() + 1);
//       query['admissionDetails.admissionDate'] = { $gte: startDate, $lt: endDate };
//     }

//     if (filters?.year && !filters?.month) {
//       const startDate = new Date(`${filters.year}-01-01`);
//       const endDate = new Date(`${filters.year}-12-31`);
//       query['admissionDetails.admissionDate'] = { $gte: startDate, $lt: endDate };
//     }

//     if (filters?.patientStatus) {
//       query['admissionDetails.patientStatus'] = filters.patientStatus;
//     }

//     if (filters?.gender) {
//       query['admissionDetails.gender'] = filters.gender;
//     }

//     try {
//       const patients = await PATIENT_MODEL.find(query)
//         .populate('admissionDetails.bedName', 'bedName')
//         .populate('admissionDetails.consultingDoctor', 'doctorName')
//         .lean();

//       return patients.map((patient) => this.formatPatient(patient));
//     } catch (error) {
//       console.error('Error fetching monthly reports:', error);
//       throw new Error('Failed to fetch monthly reports.');
//     }
//   }

//    async getReportsByDateRange({ fromDate, toDate, fromTime, toTime }) {
//   const query = {};

//   if (fromDate && toDate) {
//     query['admissionDetails.admissionDate'] = {
//       $gte: new Date(fromDate),
//       $lte: new Date(toDate),
//     };
//   } else if (fromDate) {
//     query['admissionDetails.admissionDate'] = {
//       $gte: new Date(fromDate),
//     };
//   } else if (toDate) {
//     query['admissionDetails.admissionDate'] = {
//       $lte: new Date(toDate),
//     };
//   }

//   if (fromTime && toTime) {
//     query['admissionDetails.timeOfAdmission'] = {
//       $gte: fromTime,
//       $lte: toTime,
//     };
//   }

//   try {
//     const patients = await PATIENT_MODEL.find(query)
//       .populate('admissionDetails.bedName', 'bedName')
//       .populate('admissionDetails.consultingDoctor', 'doctorName')
//       .lean();

//     return patients.map((patient) => this.formatPatient(patient));
//   } catch (error) {
//     console.error('Error fetching date range reports:', error);
//     throw new Error('Failed to fetch date range reports.');
//   }
// }

//   async getConsultantReports({ admissionDate, dischargeDate, mlcType, patientStatus }) {
//     const query = {};

//     if (admissionDate) {
//       query['admissionDetails.admissionDate'] = new Date(admissionDate);
//     }
//     if (dischargeDate) {
//       query['admissionDetails.dischargeDate'] = new Date(dischargeDate);
//     }
//     if (mlcType) {
//       query['admissionDetails.mlc'] = mlcType === 'MLC';
//     }
//     if (patientStatus) {
//       query['admissionDetails.patientStatus'] = patientStatus;
//     }

//     try {
//       const patients = await PATIENT_MODEL.find(query)
//         .populate('admissionDetails.bedName', 'bedName')
//         .populate('admissionDetails.consultingDoctor', 'doctorName')
//         .lean();

//       return patients.map((patient) => this.formatPatient(patient));
//     } catch (error) {
//       console.error('Error fetching consultant reports:', error);
//       throw new Error('Failed to fetch consultant reports.');
//     }
//   }

//   formatPatient(patient) {
//     const admissionDate = patient.admissionDetails.admissionDate;
//     const dischargeDate = patient.admissionDetails.dischargeDate;
//     const timeOfAdmission = patient.admissionDetails.timeOfAdmission;
//     const timeOfDischarge = patient.admissionDetails.timeOfDischarge;
//     const duration = this.calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge);

//     const bed = patient.admissionDetails.bedName;
//     const bedNo = typeof bed === 'string' ? bed : bed?.bedName || 'N/A';

//     return {
//       patientPhoto: patient.admissionDetails.patientPhoto,
//       patientName: patient.admissionDetails.patientName,
//       // doctor: patient.admissionDetails.consultingDoctor,
//       doctor: patient.admissionDetails.consultingDoctor?.doctorName || 'N/A',
//       paymentMode: patient.admissionDetails.paymentMode,
//       bedNo,
//       admissionDate,
//       dischargeDate,
//       duration,
//     };
//   }

//   calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge) {
//     if (!admissionDate || !dischargeDate) return 'N/A';

//     const admission = new Date(`${admissionDate.toISOString().split('T')[0]}T${this.formatTimeToISO(timeOfAdmission)}`);
//     const discharge = new Date(`${dischargeDate.toISOString().split('T')[0]}T${this.formatTimeToISO(timeOfDischarge)}`);
//     const diffMs = discharge - admission;

//     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//     return `${days} Days ${hours} Hours ${minutes} Minutes`;
//   }

//   formatTimeToISO(time) {
//     if (!time) return '00:00:00';

//     const [timePart, modifier] = time.split(' ');
//     let [hours, minutes] = timePart.split(':').map(Number);

//     if (modifier === 'PM' && hours !== 12) hours += 12;
//     if (modifier === 'AM' && hours === 12) hours = 0;

//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
//   }
// }

// export default new Reports_masterService();

import { PATIENT_MODEL } from "../patient/patient.model.js";
import { FINAL_DISCHARGE_MODEL } from "../discharge/final_discharge/final_discharge.model.js";

class Reports_masterService {

async getMonthlyReports(filters) {
  try {
    const year = parseInt(filters.year, 10) || new Date().getFullYear();
    const month = filters.month ? parseInt(filters.month, 10) - 1 : null;

    // Start and end dates (year or year+month)
    let startDate = null;
    let endDate = null;

    if (month !== null) {
      // Filter by specific month of year
      startDate = new Date(year, month, 1, 0, 0, 0);
      endDate = new Date(year, month + 1, 1, 0, 0, 0);
    } else if (filters.year) {
      // Filter by full year
      startDate = new Date(year, 0, 1, 0, 0, 0);  // Jan 1 of that year
      endDate = new Date(year + 1, 0, 1, 0, 0, 0); // Jan 1 of next year
    }

    // Build patient-level query (only gender filter at MongoDB level)
    const query = {};
    if (filters.gender) {
      query["identityDetails.gender"] = filters.gender; // match enum exactly
    }

    const patients = await PATIENT_MODEL.find(query)
      .populate("admissionDetails.bedId", "bedName")
      .populate("admissionDetails.consultingDoctorId", "doctorName")
      .lean();

    const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
    const dischargeMap = new Map();
    finalDischarges.forEach((d) => dischargeMap.set(d.admissionId.toString(), d));

    // Filter admissions by date & patientStatus
    const results = patients.flatMap((patient) => {
      const matchedAdmissions = patient.admissionDetails.filter((admission) => {
        const adDate = new Date(admission.admissionDate);

        // Filter by year/month if provided
        let dateMatch = true;
        if (startDate && endDate) {
          dateMatch = adDate >= startDate && adDate < endDate;
        }

        // Filter by patientStatus (optional)
        let statusMatch = true;
        if (filters.patientStatus) {
          statusMatch = admission.patientStatus === filters.patientStatus;
        }

        return dateMatch && statusMatch;
      });

      return matchedAdmissions.map((admission) =>
        this.formatPatient({ ...patient, admissionDetails: [admission] }, dischargeMap)[0]
      );
    });

    return results;
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    throw new Error("Failed to fetch monthly reports.");
  }
}


  async getReportsByDateRange({ fromDate, toDate, fromTime, toTime }) {
  try {
    const dateQuery = {};

    // Admission date filter
    if (fromDate && toDate) {
      dateQuery.admissionDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else if (fromDate) {
      dateQuery.admissionDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      dateQuery.admissionDate = { $lte: new Date(toDate) };
    }

    // Admission time filter (optional)
    if (fromTime && toTime) {
      dateQuery.admissionTime = { $gte: fromTime, $lte: toTime };
    }

    // Find patients by admission details
    const query = { admissionDetails: { $elemMatch: dateQuery } };

    const patients = await PATIENT_MODEL.find(query)
      .populate("admissionDetails.bedId", "bedName")
      .populate("admissionDetails.consultingDoctorId", "doctorName")
      .lean();

    // Fetch final discharges
    const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
    const dischargeMap = new Map();
    finalDischarges.forEach((d) => {
      dischargeMap.set(d.admissionId.toString(), d);
    });

    // Format and filter results
    const results = patients.flatMap((patient) =>
      this.formatPatient(patient, dischargeMap)
    );

    // Apply dischargeDate range filtering
    const filteredResults = results.filter((r) => {
      if (!r.dischargeDate) return false; // exclude if no discharge
      const discharge = new Date(r.dischargeDate);

      if (fromDate && discharge < new Date(fromDate)) return false;
      if (toDate && discharge > new Date(toDate)) return false;

      return true;
    });

    return filteredResults;
  } catch (error) {
    console.error("Error fetching date range reports:", error);
    throw new Error("Failed to fetch date range reports.");
  }
}

async getConsultantReports({ admissionDate, dischargeDate, mlcType, patientStatus, gender }) {
  try {
    // Preload all discharges
    const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
    const dischargeMap = new Map();
    finalDischarges.forEach((d) => dischargeMap.set(d.admissionId.toString(), d));

    // Build patient-level query (only gender filter goes to DB)
    const query = {};
    if (gender) {
      query["identityDetails.gender"] = gender;
    }

    // Fetch patients
    let patients = await PATIENT_MODEL.find(query)
      .populate("admissionDetails.bedId", "bedName")
      .populate("admissionDetails.consultingDoctorId", "doctorName")
      .lean();

    // Now filter admissionDetails manually
    const filteredPatients = patients.map((p) => {
      const admissions = p.admissionDetails.filter((a) => {
        let matches = true;

        // Admission Date filter (EXACT match to the provided date)
        if (admissionDate) {
          const filterDate = new Date(admissionDate);
          const admissionOnlyDate = new Date(a.admissionDate);
          matches =
            matches &&
            admissionOnlyDate.toISOString().split("T")[0] ===
              filterDate.toISOString().split("T")[0];
        }

        // Discharge Date filter (EXACT match)
        if (dischargeDate) {
          const discharge = dischargeMap.get(a._id.toString());
          if (discharge) {
            const filterDate = new Date(dischargeDate);
            matches =
              matches &&
              discharge.dateOfDischarge.toISOString().split("T")[0] ===
                filterDate.toISOString().split("T")[0];
          } else {
            matches = false;
          }
        }

        // Patient status filter
        if (patientStatus) {
          matches = matches && a.patientStatus === patientStatus;
        }

        // MLC type filter
        if (mlcType !== undefined) {
          matches =
            matches && a.mlcType === (mlcType === "true" || mlcType === true);
        }

        return matches;
      });

      return { ...p, admissionDetails: admissions };
    });

    // Keep only patients who still have admissions
    const finalPatients = filteredPatients.filter(
      (p) => p.admissionDetails.length > 0
    );

    // Flatten and format
    return finalPatients.flatMap((patient) =>
      this.formatPatient(patient, dischargeMap)
    );
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
