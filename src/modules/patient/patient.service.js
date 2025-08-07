// import { PATIENT_MODEL } from '../patient/patient.model.js';
// import { REFERRED_DOCTOR_MODEL } from '../doctor_master/referred_doctor/referred_doctor.model.js';
// import { LABMASTER_MODEL } from '../hospital_master/lab_master/lab_master.model.js';
// import { FLOORMASTER_MODEL } from '../hospital_master/ward_or_floor_master/ward_or_floor_master.model.js';
// import { BEDMASTER_MODEL } from '../hospital_master/bed_master/bed_master.model.js';
// import { DOCTOR_MODEL } from '../doctor_master/doctor_master.model.js';

// class PatientService {
//   async getAll() {
//     return await PATIENT_MODEL.find({})
//     .populate('admissionDetails.referredByDoctorId', 'doctorName')
//     .populate('admissionDetails.laboratorySelectionId', 'labName')
//     .populate('admissionDetails.floorId', 'floorName')  
//     .populate('admissionDetails.bedId', 'bedName')        
//     .populate('admissionDetails.consultingDoctorId', 'doctorName');
//   }

//   async create(data) {
//   const admission = data.admissionDetails[0];

//   if (admission.referredByDoctorId) {
//     const referredDoctorExists = await REFERRED_DOCTOR_MODEL.findById(admission.referredByDoctorId);
//     if (!referredDoctorExists) {
//       throw new Error('Referred Doctor with the given ID does not exist');
//     }
//   }

//   if (admission.laboratorySelectionId) {
//     const labExists = await LABMASTER_MODEL.findById(admission.laboratorySelectionId);
//     if (!labExists) {
//       throw new Error('Lab with the given ID does not exist');
//     }
//   }

//   if (admission.floorId) {
//     const floorExists = await FLOORMASTER_MODEL.findById(admission.floorId);
//     if (!floorExists) {
//       throw new Error('Floor with the given ID does not exist');
//     }
//   }

//   if (admission.bedId) {
//     const bedExists = await BEDMASTER_MODEL.findById(admission.bedId);
//     if (!bedExists) {
//       throw new Error('Bed with the given ID does not exist');
//     }
//   }

//   if (admission.consultingDoctorId) {
//     const consultingDoctorExists = await DOCTOR_MODEL.findById(admission.consultingDoctorId);
//     if (!consultingDoctorExists) {
//       throw new Error('Consulting Doctor with the given ID does not exist');
//     }
//   }

//   return await PATIENT_MODEL.create(data);
// }



//    async getById(id) {
//     return await PATIENT_MODEL.findById(id)
//       .populate('admissionDetails.referredByDoctorId', 'doctorName')
//       .populate('admissionDetails.laboratorySelectionId', 'labName')
//       .populate('admissionDetails.floorId', 'floorName')  
//       .populate('admissionDetails.bedId', 'bedName')        
//       .populate('admissionDetails.consultingDoctorId', 'doctorName');
//   }

//   async addAdmissionToExistingPatient(patientId, admissionData) {
//   const patient = await PATIENT_MODEL.findById(patientId);

//   if (!Array.isArray(patient.admissionDetails)) {
//     patient.admissionDetails = [patient.admissionDetails];
//   }

//   patient.admissionDetails.push(admissionData);
//   return await patient.save();
// }


//  async findPatientByUHID(uhidNo) {
//     return await PATIENT_MODEL.findOne({ 'identityDetails.uhidNo': uhidNo });
//   }

//   async delete(id){
//     return await PATIENT_MODEL.findByIdAndDelete(id);
//   }


//   async checkReferredDoctorExists(id) {
//   return await REFERRED_DOCTOR_MODEL.findById(id);
// }

// async checkLabExists(id) {
//   return await LABMASTER_MODEL.findById(id);
// }

// async checkFloorExists(id) {
//   return await FLOORMASTER_MODEL.findById(id);
// }

// async checkBedExists(id) {
//   return await BEDMASTER_MODEL.findById(id);
// }

// async checkConsultingDoctorExists(id) {
//   return await DOCTOR_MODEL.findById(id);
// }


// }

// export default new PatientService();





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


}

export default new PatientService();
