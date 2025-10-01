import { PATIENT_MODEL } from '../patient/patient.model.js';
import { REFERRED_DOCTOR_MODEL } from '../doctor_master/referred_doctor/referred_doctor.model.js';
import { LABMASTER_MODEL } from '../hospital_master/lab_master/lab_master.model.js';
import { FLOORMASTER_MODEL } from '../hospital_master/ward_or_floor_master/ward_or_floor_master.model.js';
import { BEDMASTER_MODEL } from '../hospital_master/bed_master/bed_master.model.js';
import { DOCTOR_MODEL } from '../doctor_master/doctor_master.model.js';
import { ADMISSION_REASON_MODEL } from '../admissionreasons/admissionreasons.model.js';
import { EXCHANGE_MODEL } from './transfer_patient/exchange_patient.model.js';
import { ASSIGN_MODEL } from './transfer_patient/assign_patient.model.js';
import { CANCELLED_ADMISSION_MODEL } from './cancelledAdmission.model.js';
import { SCHEDULE_MODEL } from '../schedule/schedule.model.js';

class PatientService {
  async getAll() {
    return await PATIENT_MODEL.find({})
    .populate('admissionDetails.referredByDoctorId', 'doctorName')
    .populate('admissionDetails.laboratorySelectionId', 'labName')
    .populate('admissionDetails.floorId', 'floorName')  
    .populate('admissionDetails.bedId', 'bedName')        
    .populate('admissionDetails.consultingDoctorId', 'doctorName')
    .populate('admissionDetails.admissionReasonId', 'admissionReason');
  }

  async create(data) {
  const admission = data.admissionDetails[0];

  if (admission.referredByDoctorId) {
    const referredDoctorExists = await REFERRED_DOCTOR_MODEL.findById(admission.referredByDoctorId);
    if (!referredDoctorExists) {
      throw new Error('Referred Doctor with the given ID does not exist');
    }
  }

  if (admission.laboratorySelectionId) {
    const labExists = await LABMASTER_MODEL.findById(admission.laboratorySelectionId);
    if (!labExists) {
      throw new Error('Lab with the given ID does not exist');
    }
  }

  if (admission.floorId) {
    const floorExists = await FLOORMASTER_MODEL.findById(admission.floorId);
    if (!floorExists) {
      throw new Error('Floor with the given ID does not exist');
    }
  }

  if (admission.bedId) {
    const bedExists = await BEDMASTER_MODEL.findById(admission.bedId);
    if (!bedExists) {
      throw new Error('Bed with the given ID does not exist');
    }
    if (bedExists.bedStatus === 'Vacant') {
      await BEDMASTER_MODEL.findByIdAndUpdate(admission.bedId, {
        bedStatus: 'Occupied',
      });
    }
  }

  if (admission.consultingDoctorId) {
    const consultingDoctorExists = await DOCTOR_MODEL.findById(admission.consultingDoctorId);
    if (!consultingDoctorExists) {
      throw new Error('Consulting Doctor with the given ID does not exist');
    }
  }

  if (admission.admissionReasonId) {
    const admissionReasonExists = await ADMISSION_REASON_MODEL.findById(admission.admissionReasonId);
    if (!admissionReasonExists) {
      throw new Error('Admission Reasons with the given ID does not exist');
    }
  }

  return await PATIENT_MODEL.create(data);
}

   async getById(id) {
    return await PATIENT_MODEL.findById(id)
      .populate('admissionDetails.referredByDoctorId', 'doctorName')
      .populate('admissionDetails.laboratorySelectionId', 'labName')
      .populate('admissionDetails.floorId', 'floorName')  
      .populate('admissionDetails.bedId', 'bedName')        
      .populate('admissionDetails.consultingDoctorId', 'doctorName')
      .populate('admissionDetails.admissionReasonId', 'admissionReason')
  }

  async addAdmissionToExistingPatient(patientId, admissionData) {
  const patient = await PATIENT_MODEL.findById(patientId);

  if (!Array.isArray(patient.admissionDetails)) {
    patient.admissionDetails = [patient.admissionDetails];
  }

  patient.admissionDetails.push(admissionData);
  return await patient.save();
}


 async findPatientByUHID(uhidNo) {
    return await PATIENT_MODEL.findOne({ 'identityDetails.uhidNo': uhidNo });
  }

  async delete(id){
    return await PATIENT_MODEL.findByIdAndDelete(id);
  }


  async checkReferredDoctorExists(id) {
  return await REFERRED_DOCTOR_MODEL.findById(id);
}

async checkLabExists(id) {
  return await LABMASTER_MODEL.findById(id);
}

async checkFloorExists(id) {
  return await FLOORMASTER_MODEL.findById(id);
}

async checkBedExists(id) {
  return await BEDMASTER_MODEL.findById(id);
}

async checkConsultingDoctorExists(id) {
  return await DOCTOR_MODEL.findById(id);
}

async checkAdmissionReasonExists(id) {
  return await ADMISSION_REASON_MODEL.findById(id);
}

async assignBed(patientId, admissionId, bedId) {
  const clickedBed = await BEDMASTER_MODEL.findById(bedId).populate('floorId');
  if (!clickedBed) throw new Error('Bed not found');
  if (clickedBed.status !== 'Active') throw new Error('Bed is not Active');

  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  const admissionIndex = patient.admissionDetails.findIndex(
    (adm) => adm._id.toString() === admissionId
  );
  if (admissionIndex === -1) throw new Error('Admission entry not found');

  let fromData = null;

  // === Free old bed if exists ===
  if (patient.admissionDetails[admissionIndex].bedId) {
    const oldBed = await BEDMASTER_MODEL.findById(
      patient.admissionDetails[admissionIndex].bedId
    ).populate("floorId");

    if (oldBed) {
      fromData = { floor: oldBed.floorId.floorName, bed: oldBed.bedName };

      await BEDMASTER_MODEL.findByIdAndUpdate(
        oldBed._id,
        { bedStatus: "Vacant", patientId: null }
      );
    }
  }

  // === Assign new bed & floor ===
  patient.admissionDetails[admissionIndex].bedId = bedId;
  patient.admissionDetails[admissionIndex].floorId = clickedBed.floorId._id;

  await BEDMASTER_MODEL.findByIdAndUpdate(bedId, {
    bedStatus: "Occupied",
    patientId
  });

  await patient.save();

  await ASSIGN_MODEL.create({
    patient: patientId,
    admissionId,
    from: fromData,
    to: { floor: clickedBed.floorId.floorName, bed: clickedBed.bedName },
    assignDate: new Date(),
    assignTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  });

  return {
    message: "Bed & Floor assigned successfully",
    patient,
    newBed: { bedId: bedId, bedName: clickedBed.bedName },
    newFloor: { floorId: clickedBed.floorId._id, floorName: clickedBed.floorId.floorName }
  };
}

async exchangePatients(patientAId, admissionAId, patientBId, admissionBId, exchangeDate, exchangeTime) {
  const patientA = await PATIENT_MODEL.findById(patientAId);
  const patientB = await PATIENT_MODEL.findById(patientBId);

  if (!patientA || !patientB) throw new Error("One or both patients not found");

  const admissionAIndex = patientA.admissionDetails.findIndex(
    (adm) => adm._id.toString() === admissionAId
  );
  const admissionBIndex = patientB.admissionDetails.findIndex(
    (adm) => adm._id.toString() === admissionBId
  );

  if (admissionAIndex === -1 || admissionBIndex === -1) {
    throw new Error("One or both admission entries not found");
  }

  const bedAId = patientA.admissionDetails[admissionAIndex].bedId;
  const bedBId = patientB.admissionDetails[admissionBIndex].bedId;

  if (!bedAId || !bedBId) throw new Error("Both patients must be assigned to beds");

  const bedA = await BEDMASTER_MODEL.findById(bedAId).populate("floorId", "_id floorName");
  const bedB = await BEDMASTER_MODEL.findById(bedBId).populate("floorId", "_id floorName");

  if (!bedA || !bedB) throw new Error("One or both beds not found");

  // --- Store old states ---
  const fromA = { floor: bedA.floorId.floorName, bed: bedA.bedName };
  const fromB = { floor: bedB.floorId.floorName, bed: bedB.bedName };

  // --- Swap ---
  patientA.admissionDetails[admissionAIndex].bedId = bedB._id;
  patientA.admissionDetails[admissionAIndex].floorId = bedB.floorId;

  patientB.admissionDetails[admissionBIndex].bedId = bedA._id;
  patientB.admissionDetails[admissionBIndex].floorId = bedA.floorId;

  await patientA.save();
  await patientB.save();

  await BEDMASTER_MODEL.findByIdAndUpdate(bedAId, { bedStatus: "Occupied" });
  await BEDMASTER_MODEL.findByIdAndUpdate(bedBId, { bedStatus: "Occupied" });

  // --- Store Exchange History ---
  await EXCHANGE_MODEL.create({
    patientA: patientA._id,
    admissionAId,
    patientB: patientB._id,
    admissionBId,
    fromA,
    fromB,
    toA: { floor: bedB.floorId.floorName, bed: bedB.bedName },
    toB: { floor: bedA.floorId.floorName, bed: bedA.bedName },
    exchangeDate,
    exchangeTime,
  });

  return {
    message: "Patients exchanged successfully",
    patientA,
    patientB,
  };
}

async getIPDPatients() {
  return await PATIENT_MODEL.find({
    'admissionDetails.registrationType': 'IPD'
  })
  .populate('admissionDetails.referredByDoctorId', 'doctorName')
  .populate('admissionDetails.laboratorySelectionId', 'labName')
  .populate('admissionDetails.floorId', 'floorName')  
  .populate('admissionDetails.bedId', 'bedName')        
  .populate('admissionDetails.consultingDoctorId', 'doctorName')
  .populate('admissionDetails.admissionReasonId', 'admissionReason');
}
 
async getAdmissionReportCounts(patientId, admissionId) {
    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const admission = patient.admissionDetails.id(admissionId); 
    if (!admission) {
      throw new Error("Admission not found");
    }

    const labReportsCount = admission.labReports?.length || 0;
    const docsCount = admission.docs?.length || 0;
    const radiologyReportsCount = admission.radiologyReports?.length || 0;
    const audioRecordingsCount = admission.audioRecordings?.length || 0;
    const videoRecordingsCount = admission.videoRecordings?.length || 0;

    return {
      patientName: patient.identityDetails.patientName,
      patientId,
      admissionId,
      docsCount,
      labReportsCount,
      radiologyReportsCount,
      audioRecordingsCount,
      videoRecordingsCount
    };
  }

async getIPDAdmissionsByPatientId(patientId) {
  const patient = await PATIENT_MODEL.findById(patientId, {
    admissionDetails: 1,
    identityDetails: 1
  })
  .populate('admissionDetails.referredByDoctorId', 'doctorName')
  .populate('admissionDetails.laboratorySelectionId', 'labName')
  .populate('admissionDetails.floorId', 'floorName')
  .populate('admissionDetails.bedId', 'bedName')
  .populate('admissionDetails.consultingDoctorId', 'doctorName')
  .populate('admissionDetails.admissionReasonId', 'admissionReason');

  if (!patient) {
    throw new Error('Patient not found');
  }

  // Filter only IPD admissions
  const ipdAdmissions = patient.admissionDetails.filter(
    (admission) => admission.registrationType === 'IPD'
  );

  return {
    patientId: patient._id,
    identityDetails: patient.identityDetails,
    ipdAdmissions
  };
}

async getPatientCountByDepartment() {
  const result = await PATIENT_MODEL.aggregate([
  { $unwind: "$admissionDetails" },
  { $lookup: {
      from: "bedmasters", 
      localField: "admissionDetails.bedId",
      foreignField: "_id",
      as: "bed"
  }},
  { $unwind: "$bed" },
  { $lookup: {
      from: "departments",
      localField: "bed.departmentId",
      foreignField: "_id",
      as: "department"
  }},
  { $unwind: "$department" },
  {
    $group: {
      _id: "$department._id",
      departmentName: { $first: "$department.name" },
      patientCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      departmentId: "$_id",
      departmentName: 1,
      patientCount: 1
    }
  }
]);


  return result;
}

// async cancelAdmission(patientId, admissionId, reason) {
//   const patient = await PATIENT_MODEL.findById(patientId);
//   if (!patient) throw new Error('Patient not found');

//   const admissionIndex = patient.admissionDetails.findIndex(adm => adm._id.toString() === admissionId);
//   if (admissionIndex === -1) throw new Error('Admission not found');

//   const [cancelledAdmission] = patient.admissionDetails.splice(admissionIndex, 1);

//   // Free the bed if assigned
//   if (cancelledAdmission.bedId) {
//     await BEDMASTER_MODEL.findByIdAndUpdate(cancelledAdmission.bedId, { bedStatus: 'Vacant' });
//   }

//   await patient.save();

//   const cancelledRecord = await CANCELLED_ADMISSION_MODEL.create({
//     patientId,
//     admissionId: cancelledAdmission._id,
//     reason,
//   });

//   return cancelledRecord;
// }

// async cancelAdmission(patientId, admissionId, reason) {
//   const patient = await PATIENT_MODEL.findById(patientId);
//   if (!patient) throw new Error('Patient not found');

//   const admissionIndex = patient.admissionDetails.findIndex(adm => adm._id.toString() === admissionId);
//   if (admissionIndex === -1) throw new Error('Admission not found');

//   const [cancelledAdmission] = patient.admissionDetails.splice(admissionIndex, 1);

//   // Free the bed if assigned
//   if (cancelledAdmission.bedId) {
//     await BEDMASTER_MODEL.findByIdAndUpdate(cancelledAdmission.bedId, { bedStatus: 'Vacant' });
//   }

//   await patient.save();

//   // Store in CancelledAdmissions including patient identity and admission snapshot
//   const cancelledRecord = await CANCELLED_ADMISSION_MODEL.create({
//     patientId,
//     admissionId: cancelledAdmission._id,
//     reason,
//     patientIdentity: patient.identityDetails,  // new field to store identity
//     admissionDetails: cancelledAdmission      // new field to store admission snapshot
//   });

//   return cancelledRecord;
// }

async cancelAdmission(patientId, admissionId, reason) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  const admissionIndex = patient.admissionDetails.findIndex(adm => adm._id.toString() === admissionId);
  if (admissionIndex === -1) throw new Error('Admission not found');

  const [cancelledAdmission] = patient.admissionDetails.splice(admissionIndex, 1);

  // Free the bed if assigned
  if (cancelledAdmission.bedId) {
    await BEDMASTER_MODEL.findByIdAndUpdate(cancelledAdmission.bedId, { bedStatus: 'Vacant' });
  }

  // Delete OT schedules related to this patient + admission
  await SCHEDULE_MODEL.deleteMany({
    patientId,
    admissionId: cancelledAdmission._id
  });

  await patient.save();

  const cancelledRecord = await CANCELLED_ADMISSION_MODEL.create({
    patientId,
    admissionId: cancelledAdmission._id,
    reason,
    patientIdentity: patient.identityDetails,
    admissionDetails: cancelledAdmission
  });

  return cancelledRecord;
}

  async getCancelledAdmissions() {
    return await CANCELLED_ADMISSION_MODEL.find()
      .populate('patientId', 'identityDetails');
  }

}

export default new PatientService();
