import { PATIENT_MODEL } from '../patient/patient.model.js';
import { REFERRED_DOCTOR_MODEL } from '../doctor_master/referred_doctor/referred_doctor.model.js';
import { LABMASTER_MODEL } from '../hospital_master/lab_master/lab_master.model.js';
import { FLOORMASTER_MODEL } from '../hospital_master/ward_or_floor_master/ward_or_floor_master.model.js';
import { BEDMASTER_MODEL } from '../hospital_master/bed_master/bed_master.model.js';
import { DOCTOR_MODEL } from '../doctor_master/doctor_master.model.js';
import { ADMISSION_REASON_MODEL } from '../admissionreasons/admissionreasons.model.js';

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
  const clickedBed = await BEDMASTER_MODEL.findById(bedId);
  if (!clickedBed) throw new Error('Bed not found');
  if (clickedBed.status !== 'Active') throw new Error('Bed is not Active');

  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  const admissionIndex = patient.admissionDetails.findIndex(
    (adm) => adm._id.toString() === admissionId
  );
  if (admissionIndex === -1) throw new Error('Admission entry not found');

  // === CASE 1: Vacant bed → Assign ===
  if (clickedBed.bedStatus === 'Vacant') {
    const freshCheck = await BEDMASTER_MODEL.findById(bedId);
    if (!freshCheck || freshCheck.bedStatus !== 'Vacant') {
      throw new Error('Bed is no longer vacant');
    }

    // Free old bed
    if (patient.admissionDetails[admissionIndex].bedId) {
      await BEDMASTER_MODEL.findByIdAndUpdate(
        patient.admissionDetails[admissionIndex].bedId,
        { bedStatus: 'Vacant', patientId: null }
      );
    }

    // Assign new bed
    patient.admissionDetails[admissionIndex].bedId = bedId;
    await BEDMASTER_MODEL.findByIdAndUpdate(bedId, {
      bedStatus: 'Occupied',
      patientId
    });

    await patient.save();
    return { message: 'Bed assigned successfully', patient };
  }

  throw new Error('Invalid bed status');
}

// async exchangePatients(patientAId, admissionAId, patientBId, admissionBId) {
//   const patientA = await PATIENT_MODEL.findById(patientAId);
//   const patientB = await PATIENT_MODEL.findById(patientBId);

//   if (!patientA || !patientB) throw new Error("One or both patients not found");

//   const admissionAIndex = patientA.admissionDetails.findIndex(
//     (adm) => adm._id.toString() === admissionAId
//   );
//   const admissionBIndex = patientB.admissionDetails.findIndex(
//     (adm) => adm._id.toString() === admissionBId
//   );

//   if (admissionAIndex === -1 || admissionBIndex === -1) {
//     throw new Error("One or both admission entries not found");
//   }

//   // Get beds of both patients
//   const bedA = patientA.admissionDetails[admissionAIndex].bedId;
//   const bedB = patientB.admissionDetails[admissionBIndex].bedId;

//   if (!bedA || !bedB) throw new Error("Both patients must be assigned to beds");

//   // Swap beds
//   patientA.admissionDetails[admissionAIndex].bedId = bedB;
//   patientB.admissionDetails[admissionBIndex].bedId = bedA;

//   await patientA.save();
//   await patientB.save();

//   // Update bed master
//   await BEDMASTER_MODEL.findByIdAndUpdate(bedA, { patientId: patientB._id, bedStatus: 'Occupied' });
//   await BEDMASTER_MODEL.findByIdAndUpdate(bedB, { patientId: patientA._id, bedStatus: 'Occupied' });

//   return {
//     message: "Patients exchanged successfully",
//     patientA,
//     patientB
//   };
// }

async exchangePatients(patientAId, admissionAId, patientBId, admissionBId) {
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

  // Get beds of both patients
  const bedAId = patientA.admissionDetails[admissionAIndex].bedId;
  const bedBId = patientB.admissionDetails[admissionBIndex].bedId;

  if (!bedAId || !bedBId) throw new Error("Both patients must be assigned to beds");

  // Fetch bed details to know floors
  const bedA = await BEDMASTER_MODEL.findById(bedAId).populate('floorId', '_id floorName');
  const bedB = await BEDMASTER_MODEL.findById(bedBId).populate('floorId', '_id floorName');

  if (!bedA || !bedB) throw new Error("One or both beds not found");

  // Swap bed + floor
  patientA.admissionDetails[admissionAIndex].bedId = bedB._id;
  patientA.admissionDetails[admissionAIndex].floorId = bedB.floorId;

  patientB.admissionDetails[admissionBIndex].bedId = bedA._id;
  patientB.admissionDetails[admissionBIndex].floorId = bedA.floorId;

  await patientA.save();
  await patientB.save();

  // Update bed statuses (keeping them occupied)
  await BEDMASTER_MODEL.findByIdAndUpdate(bedAId, { bedStatus: 'Occupied' });
  await BEDMASTER_MODEL.findByIdAndUpdate(bedBId, { bedStatus: 'Occupied' });

  return {
    message: "Patients exchanged successfully",
    patientA,
    patientB
  };
}

}

export default new PatientService();
