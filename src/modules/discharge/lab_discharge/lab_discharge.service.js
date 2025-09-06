import { LAB_DISCHARGE_MODEL } from "./lab_discharge.model.js";
import { PATIENT_MODEL } from "../../patient/patient.model.js";

class Lab_dischargeService {
   
  async getAll() {
    return await LAB_DISCHARGE_MODEL.find()
      .populate('patientId', 'identityDetails.patientName');
  }

  // async create(data) {
  //   const { patientId, admissionId } = data;

  //   const patient = await PATIENT_MODEL.findById(patientId);
  //   if (!patient) {
  //     throw new Error("Patient not found");
  //   }

  //   const admissionExists = patient.admissionDetails.some(
  //     (admission) => admission._id.toString() === admissionId
  //   );

  //   if (!admissionExists) {
  //     throw new Error("Admission ID does not match this patient");
  //   }

  //   return await LAB_DISCHARGE_MODEL.create(data);
  // }

  async create(data) {
    const { patientId, admissionId } = data;

    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const admissionIndex = patient.admissionDetails.findIndex(
      (admission) => admission._id.toString() === admissionId
    );

    if (admissionIndex === -1) {
      throw new Error("Admission ID does not match this patient");
    }

    patient.admissionDetails[admissionIndex].labDischarge = true;
    await patient.save();

    return await LAB_DISCHARGE_MODEL.create(data);
  }

  async getById(id) {
    return await LAB_DISCHARGE_MODEL.findById(id)
      .populate('patientId', 'identityDetails.patientName');
  }
}

export default new Lab_dischargeService();
