import { PATIENT_MODEL } from "../patient/patient.model.js";
import { FINAL_DISCHARGE_MODEL } from "../discharge/final_discharge/final_discharge.model.js";

class Reports_masterService {

async getMonthlyReports(filters) {
    try {
      // Step 1: Build patient-level query
      const patientQuery = {};
      if (filters?.gender) patientQuery["identityDetails.gender"] = filters.gender;
      if (filters?.age) patientQuery["identityDetails.age.years"] = Number(filters.age);
      if (filters?.patientReligion) patientQuery["identityDetails.patientReligion"] = filters.patientReligion;

      // Step 2: Fetch patients from DB
      const patients = await PATIENT_MODEL.find(patientQuery)
        .populate("admissionDetails.consultingDoctorId", "doctorName")
        .populate("admissionDetails.referredByDoctorId", "doctorName")
        .populate("admissionDetails.bedId", "bedName")
        .lean();

      // Step 3: Preload all final discharges
      const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
      const dischargeMap = new Map();
      finalDischarges.forEach((d) => dischargeMap.set(d.admissionId.toString(), d));

      // Step 4: Filter admissionDetails per patient based on filters
      const filteredPatients = patients.map((patient) => {
        const filteredAdmissions = patient.admissionDetails.filter((admission) => {
          const adDate = new Date(admission.admissionDate);

          // Month filter
          if (filters?.month && adDate.getMonth() + 1 !== Number(filters.month)) return false;

          // Year filter
          if (filters?.year && adDate.getFullYear() !== Number(filters.year)) return false;

          // PatientStatus filter
          if (filters?.patientStatus && admission.patientStatus !== filters.patientStatus) return false;

          // Reason for Admission filter
          if (filters?.reasonForAdmission &&
              !admission.reasonForAdmission.toLowerCase().includes(filters.reasonForAdmission.toLowerCase()))
            return false;

          // Payment Mode filter
          if (filters?.paymentMode && admission.paymentMode !== filters.paymentMode) return false;

          // Payment Details filter
          if (filters?.paymentDetails &&
              !admission.paymentDetails.toLowerCase().includes(filters.paymentDetails.toLowerCase()))
            return false;

          // Consultant filter
          if (filters?.consultant && admission.consultant !== filters.consultant) return false;

          // Other Consultant filter
          if (filters?.otherConsultant && admission.otherConsultant !== filters.otherConsultant) return false;

          // Referred Doctor filter
          if (filters?.referredDoctor && admission.referredDoctor !== filters.referredDoctor) return false;

          // MLC Type filter
          if (filters?.mlcType !== undefined &&
              admission.mlcType !== (filters.mlcType === "true" || filters.mlcType === true))
            return false;

          // Discharge Summary Type filter
          if (filters?.dischargeSummaryType && admission.dischargeDetails?.summaryType !== filters.dischargeSummaryType) return false;

          // Discharge Reason filter
          if (filters?.dischargeReason &&
              !admission.dischargeDetails?.reason?.toLowerCase().includes(filters.dischargeReason.toLowerCase()))
            return false;

          // Birth/Death filter
          if (filters?.birthDeath && admission.birthDeath !== filters.birthDeath) return false;

          // Floor filter
          if (filters?.floor && admission.floor !== filters.floor) return false;

          return true;
        });

        return { ...patient, admissionDetails: filteredAdmissions };
      });

      // Step 5: Keep only patients with matching admissions
      const validPatients = filteredPatients.filter((p) => p.admissionDetails.length > 0);

      return validPatients;
    } catch (error) {
      console.error("Error fetching monthly reports:", error);
      throw new Error("Failed to fetch monthly reports.");
    }
  }

async getReportsByDateRange({ fromDate, toDate, fromTime, toTime }) {
  try {
    let start = null;
    let end = null;

    if (fromDate) {
      start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
    }
    if (toDate) {
      end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
    }

    const admissionMatch = {};
    if (start && end) {
      admissionMatch.admissionDate = { $gte: start, $lte: end };
    } else if (start) {
      admissionMatch.admissionDate = { $gte: start };
    } else if (end) {
      admissionMatch.admissionDate = { $lte: end };
    }

    if (fromTime && toTime) {
      admissionMatch.admissionTime = { $gte: fromTime, $lte: toTime };
    }

    const patients = await PATIENT_MODEL.find({
      admissionDetails: { $elemMatch: admissionMatch },
    })
      .populate("admissionDetails.bedId", "bedName")
      .populate("admissionDetails.consultingDoctorId", "doctorName")
      .lean();

    
    const finalDischarges = await FINAL_DISCHARGE_MODEL.find().lean();
    const dischargeMap = new Map();
    finalDischarges.forEach((d) => {
      dischargeMap.set(d.admissionId.toString(), d);
    });

    const filteredPatients = patients.map((p) => {
      const filteredAdmissions = p.admissionDetails.filter((a) => {
        const adDate = new Date(a.admissionDate);
        if (start && adDate < start) return false;
        if (end && adDate > end) return false;
        return true;
      });
      return { ...p, admissionDetails: filteredAdmissions };
    });

    const validPatients = filteredPatients.filter(
      (p) => p.admissionDetails.length > 0
    );

    const results = validPatients.flatMap((patient) =>
      this.formatPatient(patient, dischargeMap)
    );

    return results;
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
