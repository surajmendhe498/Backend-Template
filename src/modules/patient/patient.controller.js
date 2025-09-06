// import PatientService from './patient.service.js';
// import { statusCode } from '../../utils/constants/statusCode.js';

// export default class PatientController {
//   constructor() {
//     this.patientService = PatientService;
//   }

//   getAll = async (req, res, next) => {
//     try {
//       const patients = await this.patientService.getAll();
//       if (patients.length === 0) {
//         return res.status(statusCode.NOT_FOUND).json({ message: 'Patients not found' });
//       }
//       res.success('Fetched all patients successfully', patients, statusCode.OK);
//     } catch (err) {
//       next(err);
//     }
//   };

// create = async (req, res, next) => {
//   try {
//     const { body, files } = req;

//     if (!body.identityDetails?.uhidNo) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         message: 'UHID is required to identify existing patient.'
//       });
//     }

//     const identityDetails = { ...body.identityDetails };
//     const admissionDetails = { ...body.admissionDetails };

//     admissionDetails.signatureDetails = admissionDetails.signatureDetails || {};
//     identityDetails.aadharDetails = identityDetails.aadharDetails || {};
//     identityDetails.panCardDetails = identityDetails.panCardDetails || {};
//     identityDetails.healthCardDetails = identityDetails.healthCardDetails || {};

//     if (files) {
//       for (const key in files) {
//         const filePath = files[key][0].path;

//         if (key === 'admissionDetails[patientPhoto]') {
//           admissionDetails.patientPhoto = filePath;
//         } else if (key.startsWith('admissionDetails[signatureDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           admissionDetails.signatureDetails[fieldName] = filePath;
//         } else if (key.startsWith('identityDetails[aadharDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           identityDetails.aadharDetails[fieldName] = filePath;
//         } else if (key.startsWith('identityDetails[panCardDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           identityDetails.panCardDetails[fieldName] = filePath;
//         } else if (key.startsWith('identityDetails[healthCardDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           identityDetails.healthCardDetails[fieldName] = filePath;
//         }
//       }
//     }

//     const existingPatient = await this.patientService.findPatientByUHID(identityDetails.uhidNo);

//     let responsePatient;

//     if (existingPatient) {
//       const existingIdentityDetails = existingPatient.identityDetails.toObject();

//       function deepMerge(target, source) {
//         for (const key in source) {
//           if (
//             source[key] &&
//             typeof source[key] === 'object' &&
//             !Array.isArray(source[key])
//           ) {
//             target[key] = deepMerge(target[key] || {}, source[key]);
//           } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
//             target[key] = source[key];
//           }
//         }
//         return target;
//       }

//       existingPatient.identityDetails = deepMerge(existingIdentityDetails, identityDetails);
//       existingPatient.admissionDetails.push(admissionDetails);

//       responsePatient = await existingPatient.save();
//     } else {
//       const data = {
//         identityDetails,
//         admissionDetails: [admissionDetails],
//       };
//       responsePatient = await this.patientService.create(data);
//     }

//     res.success('Patient admission handled successfully', responsePatient, statusCode.CREATED);
//   } catch (err) {
//     next(err);
//   }
// };

// getById = async (req, res, next) => {
//     try {
//       const patient = await this.patientService.getById(req.params.id);
//       if (!patient) {
//         return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found' });
//       }
//       res.success('Patient fetched successfully', patient, statusCode.OK);
//     } catch (err) {
//       next(err);
//     }
//   };

// delete = async (req, res, next) => {
//     try {
//       const { id } = req.params;

//       const deletedPatient = await this.patientService.delete(id);

//       if (!deletedPatient) {
//         return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found.' });
//       }

//       res.success('Patient deleted successfully', statusCode.OK);
//     } catch (err) {
//       next(err);
//     }
//   };  

// update = async (req, res, next) => {
//   try {
//     const { id } = req.params;  
//     const { body, files } = req;

//     const patient = await this.patientService.getById(id);
//     if (!patient) {
//       return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found' });
//     }

//     // --- UHID Uniqueness Check ---
//     if (body.identityDetails?.uhidNo) {
//       const existingPatientWithUHID = await this.patientService.findPatientByUHID(body.identityDetails.uhidNo);
//       if (existingPatientWithUHID && existingPatientWithUHID._id.toString() !== id) {
//         return res.status(statusCode.CONFLICT).json({ message: 'UHID is already taken by another patient' });
//       }
//     }

//     // --- Existence Checks for AdmissionDetails References ---
//     const admissionDetails = body.admissionDetails;

//     if (admissionDetails) {
//       // Check Referred Doctor Exists
//       if (admissionDetails.referredByDoctorId) {
//         const referredDoctorExists = await this.patientService.checkReferredDoctorExists(admissionDetails.referredByDoctorId);
//         if (!referredDoctorExists) {
//           return res.status(statusCode.NOT_FOUND).json({ message: 'Referred Doctor with the given ID does not exist' });
//         }
//       }

//       // Check Lab Exists
//       if (admissionDetails.laboratorySelectionId) {
//         const labExists = await this.patientService.checkLabExists(admissionDetails.laboratorySelectionId);
//         if (!labExists) {
//           return res.status(statusCode.NOT_FOUND).json({ message: 'Lab with the given ID does not exist' });
//         }
//       }

//       // Check Floor Exists
//       if (admissionDetails.floorId) {
//         const floorExists = await this.patientService.checkFloorExists(admissionDetails.floorId);
//         if (!floorExists) {
//           return res.status(statusCode.NOT_FOUND).json({ message: 'Floor with the given ID does not exist' });
//         }
//       }

//       // Check Bed Exists
//       if (admissionDetails.bedId) {
//         const bedExists = await this.patientService.checkBedExists(admissionDetails.bedId);
//         if (!bedExists) {
//           return res.status(statusCode.NOT_FOUND).json({ message: 'Bed with the given ID does not exist' });
//         }
//       }

//       // Check Consulting Doctor Exists
//       if (admissionDetails.consultingDoctorId) {
//         const consultingDoctorExists = await this.patientService.checkConsultingDoctorExists(admissionDetails.consultingDoctorId);
//         if (!consultingDoctorExists) {
//           return res.status(statusCode.NOT_FOUND).json({ message: 'Consulting Doctor with the given ID does not exist' });
//         }
//       }

//       // Check Admission Reason Exists
//       if (admissionDetails.admissionReasonId) {
//         const admissionReasonExists = await this.patientService.checkAdmissionReasonExists(admissionDetails.admissionReasonId);
//         if (!admissionReasonExists) {
//           return res.status(statusCode.NOT_FOUND).json({ message: 'Admission Reason with the given ID does not exist' });
//         }
//       }
//     }

//     // --- Utility Function: Deep Merge ---
//     function deepMerge(target, source) {
//       for (const key in source) {
//         if (
//           source[key] &&
//           typeof source[key] === 'object' &&
//           !Array.isArray(source[key])
//         ) {
//           target[key] = deepMerge(target[key] || {}, source[key]);
//         } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
//           target[key] = source[key];
//         }
//       }
//       return target;
//     }

//     // --- Update Identity Details ---
//     if (body.identityDetails) {
//       patient.identityDetails = deepMerge(patient.identityDetails.toObject(), body.identityDetails);
//     }

//     // --- Update Specific AdmissionDetails by _id ---
//     if (admissionDetails && body.admissionId) {
//       const admissionId = body.admissionId;

//       const admissionIndex = patient.admissionDetails.findIndex(
//         (admission) => admission._id.toString() === admissionId
//       );

//       if (admissionIndex === -1) {
//         return res.status(statusCode.NOT_FOUND).json({ message: 'Admission entry not found' });
//       }

//       patient.admissionDetails[admissionIndex] = deepMerge(
//         patient.admissionDetails[admissionIndex].toObject(),
//         admissionDetails
//       );
//     }

//     // --- Handle File Uploads ---
//     if (files) {
//       for (const key in files) {
//         const filePath = files[key][0].path;

//         if (key === 'admissionDetails[patientPhoto]') {
//           const admissionId = body.admissionId;
//           const admissionIndex = patient.admissionDetails.findIndex(
//             (admission) => admission._id.toString() === admissionId
//           );
//           if (admissionIndex !== -1) {
//             patient.admissionDetails[admissionIndex].patientPhoto = filePath;
//           }
//         } else if (key.startsWith('admissionDetails[signatureDetails]')) {
//           const admissionId = body.admissionId;
//           const admissionIndex = patient.admissionDetails.findIndex(
//             (admission) => admission._id.toString() === admissionId
//           );
//           if (admissionIndex !== -1) {
//             const fieldName = key.split('[').pop().replace(']', '');
//             patient.admissionDetails[admissionIndex].signatureDetails[fieldName] = filePath;
//           }
//         } else if (key.startsWith('identityDetails[aadharDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           patient.identityDetails.aadharDetails[fieldName] = filePath;
//         } else if (key.startsWith('identityDetails[panCardDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           patient.identityDetails.panCardDetails[fieldName] = filePath;
//         } else if (key.startsWith('identityDetails[healthCardDetails]')) {
//           const fieldName = key.split('[').pop().replace(']', '');
//           patient.identityDetails.healthCardDetails[fieldName] = filePath;
//         }
//       }
//     }

//     const updatedPatient = await patient.save();

//     const populatedPatient = await this.patientService.getById(updatedPatient._id);

//     res.success('Patient updated successfully', populatedPatient, statusCode.OK);
//   } catch (err) {
//     next(err);
//   }
// };


// assignBed = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, bedId } = req.body;

//     if (!patientId || !admissionId || !bedId) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         message: 'patientId, admissionId, and bedId are required'
//       });
//     }

//     const result = await this.patientService.assignBed(
//       patientId,
//       admissionId,
//       bedId
//     );

//     res.success(result.message, result, statusCode.OK);
//   } catch (err) {
//     next(err);
//   }
// };

// exchangePatients = async (req, res, next) => {
//   try {
//     const { patientAId, admissionAId, patientBId, admissionBId } = req.body;

//     const result = await this.patientService.exchangePatients(
//       patientAId,
//       admissionAId,
//       patientBId,
//       admissionBId
//     );

//     res.success('Patients exchanged successfully', result);
//   } catch (err) {
//     next(err);
//   }
// };

// }

import PatientService from './patient.service.js';
import { statusCode } from '../../utils/constants/statusCode.js';
import { BEDMASTER_MODEL } from '../hospital_master/bed_master/bed_master.model.js';

export default class PatientController {
  constructor() {
    this.patientService = PatientService;
  }

  getAll = async (req, res, next) => {
    try {
      const patients = await this.patientService.getAll();
      if (patients.length === 0) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patients not found' });
      }
      res.success('Fetched all patients successfully', patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

create = async (req, res, next) => {
  try {
    const { body, files } = req;

    if (!body.identityDetails?.uhidNo) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: 'UHID is required to identify existing patient.'
      });
    }

    const identityDetails = { ...body.identityDetails };
    const admissionDetails = { ...body.admissionDetails };

    admissionDetails.signatureDetails = admissionDetails.signatureDetails || {};
    identityDetails.aadharDetails = identityDetails.aadharDetails || {};
    identityDetails.panCardDetails = identityDetails.panCardDetails || {};
    identityDetails.healthCardDetails = identityDetails.healthCardDetails || {};

    if (files) {
      for (const key in files) {
        const filePath = files[key][0].path;

        if (key === 'admissionDetails[patientPhoto]') {
          admissionDetails.patientPhoto = filePath;
        } else if (key.startsWith('admissionDetails[signatureDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          admissionDetails.signatureDetails[fieldName] = filePath;
        } else if (key.startsWith('identityDetails[aadharDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          identityDetails.aadharDetails[fieldName] = filePath;
        } else if (key.startsWith('identityDetails[panCardDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          identityDetails.panCardDetails[fieldName] = filePath;
        } else if (key.startsWith('identityDetails[healthCardDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          identityDetails.healthCardDetails[fieldName] = filePath;
        }
      }
    }

    const existingPatient = await this.patientService.findPatientByUHID(identityDetails.uhidNo);

    let responsePatient;

    if (existingPatient) {
      const existingIdentityDetails = existingPatient.identityDetails.toObject();

      function deepMerge(target, source) {
        for (const key in source) {
          if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key])
          ) {
            target[key] = deepMerge(target[key] || {}, source[key]);
          } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
            target[key] = source[key];
          }
        }
        return target;
      }

      existingPatient.identityDetails = deepMerge(existingIdentityDetails, identityDetails);

      if (admissionDetails.bedId) {
      const bed = await BEDMASTER_MODEL.findById(admissionDetails.bedId);
      if (bed && bed.bedStatus === 'Vacant') {
        await BEDMASTER_MODEL.findByIdAndUpdate(admissionDetails.bedId, { bedStatus: 'Occupied' });
      }
    }
      existingPatient.admissionDetails.push(admissionDetails);
      responsePatient = await existingPatient.save();
    } else {
      const data = {
        identityDetails,
        admissionDetails: [admissionDetails],
      };
      responsePatient = await this.patientService.create(data);
    }

    res.success('Patient admission handled successfully', responsePatient, statusCode.CREATED);
  } catch (err) {
    next(err);
  }
};

getById = async (req, res, next) => {
    try {
      const patient = await this.patientService.getById(req.params.id);
      if (!patient) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found' });
      }
      res.success('Patient fetched successfully', patient, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

delete = async (req, res, next) => {
    try {
      const { id } = req.params;

      const deletedPatient = await this.patientService.delete(id);

      if (!deletedPatient) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found.' });
      }

      res.success('Patient deleted successfully', statusCode.OK);
    } catch (err) {
      next(err);
    }
  };  

update = async (req, res, next) => {
  try {
    const { id } = req.params;  
    const { body, files } = req;

    const patient = await this.patientService.getById(id);
    if (!patient) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found' });
    }

    // --- UHID Uniqueness Check ---
    if (body.identityDetails?.uhidNo) {
      const existingPatientWithUHID = await this.patientService.findPatientByUHID(body.identityDetails.uhidNo);
      if (existingPatientWithUHID && existingPatientWithUHID._id.toString() !== id) {
        return res.status(statusCode.CONFLICT).json({ message: 'UHID is already taken by another patient' });
      }
    }

    // --- Existence Checks for AdmissionDetails References ---
    const admissionDetails = body.admissionDetails;

    if (admissionDetails) {
      // Check Referred Doctor Exists
      if (admissionDetails.referredByDoctorId) {
        const referredDoctorExists = await this.patientService.checkReferredDoctorExists(admissionDetails.referredByDoctorId);
        if (!referredDoctorExists) {
          return res.status(statusCode.NOT_FOUND).json({ message: 'Referred Doctor with the given ID does not exist' });
        }
      }

      // Check Lab Exists
      if (admissionDetails.laboratorySelectionId) {
        const labExists = await this.patientService.checkLabExists(admissionDetails.laboratorySelectionId);
        if (!labExists) {
          return res.status(statusCode.NOT_FOUND).json({ message: 'Lab with the given ID does not exist' });
        }
      }

      // Check Floor Exists
      if (admissionDetails.floorId) {
        const floorExists = await this.patientService.checkFloorExists(admissionDetails.floorId);
        if (!floorExists) {
          return res.status(statusCode.NOT_FOUND).json({ message: 'Floor with the given ID does not exist' });
        }
      }

      // Check Bed Exists
      if (admissionDetails.bedId) {
        const bedExists = await this.patientService.checkBedExists(admissionDetails.bedId);
        if (!bedExists) {
          return res.status(statusCode.NOT_FOUND).json({ message: 'Bed with the given ID does not exist' });
        }
      }

      // Check Consulting Doctor Exists
      if (admissionDetails.consultingDoctorId) {
        const consultingDoctorExists = await this.patientService.checkConsultingDoctorExists(admissionDetails.consultingDoctorId);
        if (!consultingDoctorExists) {
          return res.status(statusCode.NOT_FOUND).json({ message: 'Consulting Doctor with the given ID does not exist' });
        }
      }

      // Check Admission Reason Exists
      if (admissionDetails.admissionReasonId) {
        const admissionReasonExists = await this.patientService.checkAdmissionReasonExists(admissionDetails.admissionReasonId);
        if (!admissionReasonExists) {
          return res.status(statusCode.NOT_FOUND).json({ message: 'Admission Reason with the given ID does not exist' });
        }
      }
    }

    // --- Utility Function: Deep Merge ---
    function deepMerge(target, source) {
      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key])
        ) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
          target[key] = source[key];
        }
      }
      return target;
    }

    // --- Update Identity Details ---
    if (body.identityDetails) {
      patient.identityDetails = deepMerge(patient.identityDetails.toObject(), body.identityDetails);
    }

    // --- Update Specific AdmissionDetails by _id ---
    if (admissionDetails && body.admissionId) {
      const admissionId = body.admissionId;

      const admissionIndex = patient.admissionDetails.findIndex(
        (admission) => admission._id.toString() === admissionId
      );

      if (admissionIndex === -1) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Admission entry not found' });
      }

      patient.admissionDetails[admissionIndex] = deepMerge(
        patient.admissionDetails[admissionIndex].toObject(),
        admissionDetails
      );
    }

    // --- Handle File Uploads ---
    if (files) {
      for (const key in files) {
        const filePath = files[key][0].path;

        if (key === 'admissionDetails[patientPhoto]') {
          const admissionId = body.admissionId;
          const admissionIndex = patient.admissionDetails.findIndex(
            (admission) => admission._id.toString() === admissionId
          );
          if (admissionIndex !== -1) {
            patient.admissionDetails[admissionIndex].patientPhoto = filePath;
          }
        } else if (key.startsWith('admissionDetails[signatureDetails]')) {
          const admissionId = body.admissionId;
          const admissionIndex = patient.admissionDetails.findIndex(
            (admission) => admission._id.toString() === admissionId
          );
          if (admissionIndex !== -1) {
            const fieldName = key.split('[').pop().replace(']', '');
            patient.admissionDetails[admissionIndex].signatureDetails[fieldName] = filePath;
          }
        } else if (key.startsWith('identityDetails[aadharDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          patient.identityDetails.aadharDetails[fieldName] = filePath;
        } else if (key.startsWith('identityDetails[panCardDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          patient.identityDetails.panCardDetails[fieldName] = filePath;
        } else if (key.startsWith('identityDetails[healthCardDetails]')) {
          const fieldName = key.split('[').pop().replace(']', '');
          patient.identityDetails.healthCardDetails[fieldName] = filePath;
        }
      }
    }

    const updatedPatient = await patient.save();

    const populatedPatient = await this.patientService.getById(updatedPatient._id);

    res.success('Patient updated successfully', populatedPatient, statusCode.OK);
  } catch (err) {
    next(err);
  }
};


assignBed = async (req, res, next) => {
  try {
    const { patientId, admissionId, bedId } = req.body;

    if (!patientId || !admissionId || !bedId) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: 'patientId, admissionId, and bedId are required'
      });
    }

    const result = await this.patientService.assignBed(
      patientId,
      admissionId,
      bedId
    );

    res.success(result.message, result, statusCode.OK);
  } catch (err) {
    next(err);
  }
};

exchangePatients = async (req, res, next) => {
  try {
    const { patientAId, admissionAId, patientBId, admissionBId, exchangeDate, exchangeTime } = req.body;

    const result = await this.patientService.exchangePatients(
      patientAId,
      admissionAId,
      patientBId,
      admissionBId,
      exchangeDate,
      exchangeTime
    );

    res.success('Patients exchanged successfully', result);
  } catch (err) {
    next(err);
  }
};

}
