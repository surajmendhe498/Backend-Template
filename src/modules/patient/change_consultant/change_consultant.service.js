// import { CONSULTANT_CHANGE_MODEL } from './change_consultant.model.js';
// import { PATIENT_MODEL } from '../patient.model.js';
// import { DOCTOR_MODEL } from '../../doctor_master/doctor_master.model.js';

// class Change_consultantService {
//   async changeConsultant(patientId, { consultingDoctor, changeDate, changeTime }) {
//     const doctor = await DOCTOR_MODEL.findById(consultingDoctor);
//     if (!doctor) {
//       throw new Error('Consulting doctor not found');
//     }

//     const patient = await PATIENT_MODEL.findOneAndUpdate(
//       { _id: patientId },
//       { 'admissionDetails.consultingDoctor': doctor._id },
//       { new: true }
//     );

//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     const changeEntry = await CONSULTANT_CHANGE_MODEL.create({
//       patientId,
//       consultingDoctorName: doctor.doctorName,
//       changeDate,
//       changeTime,
//     });

//     const fullPatient = await PATIENT_MODEL.findById(patientId)
//       .populate('admissionDetails.reasonForAdmission', 'admissionReason')
//       .populate('admissionDetails.floorDetails', 'floorName')
//       .populate('admissionDetails.bedName', 'bedName')
//       .populate('admissionDetails.consultingDoctor', 'doctorName')
//       .populate('admissionDetails.referredByDoctor', 'doctorName');

//     return {
//       ...fullPatient.toObject(),
//       changeDate: changeEntry.changeDate,
//       changeTime: changeEntry.changeTime
//     };
//   }

//   async getAll() {
//     return await CONSULTANT_CHANGE_MODEL.find().sort({ createdAt: -1 });
//   }

//   async getByPatientId(patientId) {
//   return await CONSULTANT_CHANGE_MODEL.find({ patientId })
//     .sort({ createdAt: -1 })
// }

// }

// export default new Change_consultantService();





// import { CONSULTANT_CHANGE_MODEL } from './change_consultant.model.js';
// import { PATIENT_MODEL } from '../patient.model.js';
// import { DOCTOR_MODEL } from '../../doctor_master/doctor_master.model.js';

// class Change_consultantService {
//   async changeConsultant(patientId, { admissionId, consultingDoctor, changeDate, changeTime }) {
//     const doctor = await DOCTOR_MODEL.findById(consultingDoctor);
//     if (!doctor) {
//       throw new Error('Consulting doctor not found');
//     }

//     const patient = await PATIENT_MODEL.findById(patientId);
//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     const admissionEntry = patient.admissionDetails.find(
//       (admission) => admission._id.toString() === admissionId
//     );

//     if (!admissionEntry) {
//       throw new Error('Admission detail not found for given admissionId');
//     }

//     // Update consulting doctor
//     admissionEntry.consultingDoctor = doctor._id;
//     await patient.save();

//     // Log the change
//     const changeEntry = await CONSULTANT_CHANGE_MODEL.create({
//       patientId,
//       admissionId,
//       consultingDoctorName: doctor.doctorName,
//       changeDate,
//       changeTime,
//     });

//     const populatedPatient = await PATIENT_MODEL.findById(patientId)
//       .populate('admissionDetails.consultingDoctor', 'doctorName')
//       .lean();

//     const updatedAdmission = populatedPatient.admissionDetails.find(
//       (admission) => admission._id.toString() === admissionId
//     );

//     return {
//       _id: populatedPatient._id,
//       identityDetails: populatedPatient.identityDetails,
//       admissionDetails: updatedAdmission ? [updatedAdmission] : [],
//       changeDate: changeEntry.changeDate,
//       changeTime: changeEntry.changeTime
//     };
//   }

//   async getAll() {
//     return await CONSULTANT_CHANGE_MODEL.find()
//       .populate('patientId', 'identityDetails.patientName') // Only patientName
//       .sort({ createdAt: -1 })
//       .lean();
//   }

//   async getByPatientId(patientId) {
//     return await CONSULTANT_CHANGE_MODEL.find({ patientId })
//       .sort({ createdAt: -1 })
//       .lean();
//   }
// }

// export default new Change_consultantService();


import { CONSULTANT_CHANGE_MODEL } from './change_consultant.model.js';
import { PATIENT_MODEL } from '../patient.model.js';
import { DOCTOR_MODEL } from '../../doctor_master/doctor_master.model.js';

class Change_consultantService {
  async changeConsultant(patientId, { admissionId, consultingDoctor, changeDate, changeTime }) {

    const doctor = await DOCTOR_MODEL.findById(consultingDoctor);
    if (!doctor) {
      throw new Error('Consulting doctor not found');
    }

    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const admissionEntry = patient.admissionDetails.find(
      (admission) => admission._id.toString() === admissionId
    );

    if (!admissionEntry) {
      throw new Error('Admission detail not found for given admissionId');
    }

    admissionEntry.consultingDoctorId = doctor._id;
    await patient.save();

    const changeEntry = await CONSULTANT_CHANGE_MODEL.create({
      patientId,
      admissionId,
      consultingDoctorName: doctor.doctorName,
      changeDate,
      changeTime,
    });

    const populatedAdmission = {
      ...admissionEntry.toObject(),
      consultingDoctor: {
        _id: doctor._id,
        doctorName: doctor.doctorName,
      }
    };

    return {
      _id: patient._id,
      identityDetails: patient.identityDetails,
      admissionDetails: [populatedAdmission],
      changeDate: changeEntry.changeDate,
      changeTime: changeEntry.changeTime
    };
  }

  async getAll() {
  return await CONSULTANT_CHANGE_MODEL.find()
    .populate('patientId', 'identityDetails.patientName') 
    .select('patientId admissionId consultingDoctorName changeDate changeTime createdAt updatedAt') 
    .sort({ createdAt: -1 })
    .lean();
}

async getByPatientId(patientId) {
  return await CONSULTANT_CHANGE_MODEL.find({ patientId })
    .select('patientId admissionId consultingDoctorName changeDate changeTime createdAt updatedAt') 
    .sort({ createdAt: -1 })
    .lean();
}

async getByPatientAndAdmissionId(patientId, admissionId) {
  return await CONSULTANT_CHANGE_MODEL.find({ patientId, admissionId })
    .select('patientId admissionId consultingDoctorName changeDate changeTime createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();
}

}

export default new Change_consultantService();
