import { PATIENT_MODEL } from '../patient/patient.model.js';
import { REFERRED_DOCTOR_MODEL } from '../doctor_master/referred_doctor/referred_doctor.model.js';

class PatientService {
  async getAll() {
    return await PATIENT_MODEL.find().populate('admissionDetails.referredByDoctor', 'doctorName');;
  }

  async create(patientData) {
    if (patientData.admissionDetails.referredByDoctor) {
      const doctorExists = await REFERRED_DOCTOR_MODEL.findById(patientData.admissionDetails.referredByDoctor);

      if (!doctorExists) {
        throw new Error('Referred doctor does not exists');
      }
    }
    const patient = new PATIENT_MODEL(patientData);
    const savedPatient = await patient.save();

    return await PATIENT_MODEL.findById(savedPatient._id).populate('admissionDetails.referredByDoctor', 'doctorName');
  }

  async delete(id) {
    return await PATIENT_MODEL.findByIdAndDelete(id);
  }
  
  async getById(id) {
  return await PATIENT_MODEL.findById(id)
    .populate('admissionDetails.referredByDoctor', 'doctorName');
}

async update(id, updateData) {
  if (updateData.admissionDetails?.referredByDoctor) {
    const doctorExists = await REFERRED_DOCTOR_MODEL.findById(updateData.admissionDetails.referredByDoctor);
    if (!doctorExists) {
      throw new Error('Referred doctor does not exist');
    }
  }

  const updatedPatient = await PATIENT_MODEL.findByIdAndUpdate(
    id,
    updateData,
    { new: true } 
  ).populate('admissionDetails.referredByDoctor', 'doctorName');

  return updatedPatient;
}

}

export default new PatientService();





// import { PATIENT_MODEL } from '../patient/patient.model.js';
// import { REFERRED_DOCTOR_MODEL } from '../doctor_master/referred_doctor/referred_doctor.model.js';
// import { FLOORMASTER_MODEL } from '../hospital_master/word_or_floor_master/word_or_floor_master.model.js';
// import { BEDMASTER_MODEL } from '../hospital_master/bed_master/bed_master.model.js';


// class PatientService {
//   async getAll() {
//     return await PATIENT_MODEL.find({})
//       .populate('admissionDetails.referredByDoctor', 'doctorName')
//       .populate('admissionDetails.floorDetails', 'floorNumber')
//       .populate('admissionDetails.bedName', 'bedName')
//       .populate('admissionDetails.applicableClass', 'applicableClass');
//   }

//   async getById(id) {
//     return await PATIENT_MODEL.findById(id)
//       .populate('admissionDetails.referredByDoctor', 'doctorName')
//       .populate('admissionDetails.floorDetails', 'floorName floorNumber')
//       .populate('admissionDetails.bedName', 'bedName')
//       .populate('admissionDetails.applicableClass', 'applicableClass');
//   }

//   async create(patientData) {
//   const admission = patientData.admissionDetails; // ✅ FIXED LINE

//   // Validate referredByDoctor
//   if (admission.referredByDoctor) {
//     const doctorExists = await REFERRED_DOCTOR_MODEL.findById(admission.referredByDoctor);
//     if (!doctorExists) {
//       throw new Error('Referred doctor does not exist');
//     }
//   }

//   // Validate floorDetails
//   if (admission.floorDetails) {
//     const floorExists = await FLOORMASTER_MODEL.findById(admission.floorDetails);
//     if (!floorExists) {
//       throw new Error('Floor does not exist');
//     }
//   }

//   // Validate bedName
//   if (admission.bedName) {
//     const bedExists = await BEDMASTER_MODEL.findById(admission.bedName);
//     if (!bedExists) {
//       throw new Error('Bed does not exist');
//     }
//   }

//   // Validate applicableClass
//   if (admission.applicableClass) {
//     const classExists = await BEDMASTER_MODEL.findById(admission.applicableClass);
//     if (!classExists) {
//       throw new Error('Applicable class does not exist');
//     }
//   }

//   const patient = new PATIENT_MODEL(patientData);
//   const savedPatient = await patient.save();

//   return await PATIENT_MODEL.findById(savedPatient._id)
//     .populate('admissionDetails.referredByDoctor', 'doctorName')
//     .populate('admissionDetails.floorDetails', 'floorNumber')
//     .populate('admissionDetails.bedName', 'bedName')
//     .populate('admissionDetails.applicableClass', 'applicableClass');
// }

//   async update(patientId, patientData) {
//     const updatedPatient = await PATIENT_MODEL.findByIdAndUpdate(patientId, patientData, { new: true });
//     return await PATIENT_MODEL.findById(updatedPatient._id)
//       .populate('admissionDetails.referredByDoctor', 'doctorName')
//       .populate('admissionDetails.floorDetails', 'floorName floorNumber')
//       .populate('admissionDetails.bedName', 'bedName')
//       .populate('admissionDetails.applicableClass', 'applicableClass');
//   }

//   async delete(id) {
//     return await PATIENT_MODEL.findByIdAndDelete(id);
//   }
// }

// export default new PatientService();