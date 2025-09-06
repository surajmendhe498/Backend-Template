 import { BILLING_DISCHARGE_MODEL } from "./billing_discharge.model.js";
 import { PATIENT_MODEL } from "../../patient/patient.model.js";
 
 class Billing_dischargeService {
   
 async getAll() {
    return await BILLING_DISCHARGE_MODEL.find()
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

  //   return await BILLING_DISCHARGE_MODEL.create(data);
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

    patient.admissionDetails[admissionIndex].billingDischarge = true;
    patient.admissionDetails[admissionIndex].billingDischargeDate = data.dateOfDischarge;
    patient.admissionDetails[admissionIndex].billingDischargeTime = data.timeOfDischarge;
    await patient.save();

    return await BILLING_DISCHARGE_MODEL.create(data);
  }
  
  async getById(id) {
    return await BILLING_DISCHARGE_MODEL.findById(id)
      .populate('patientId', 'identityDetails.patientName');
  }
}

export default new Billing_dischargeService();
