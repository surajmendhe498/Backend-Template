import { FINAL_DISCHARGE_MODEL } from "./final_discharge.model.js";
import { PATIENT_MODEL } from "../../patient/patient.model.js";

class Final_dischargeService {
   

  async getAll() {
    return await FINAL_DISCHARGE_MODEL.find()
      .populate('patientId', 'identityDetails.patientName');
  }

  async create(data) {
    const { patientId, admissionId } = data;

    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const admission = patient.admissionDetails.id(admissionId);
    if (!admission) {
      throw new Error("Admission ID does not match this patient");
    }

    admission.patientStatus = "Discharged";
    await patient.save();

    return await FINAL_DISCHARGE_MODEL.create(data);
  }

  async getById(id) {
    return await FINAL_DISCHARGE_MODEL.findById(id)
      .populate('patientId', 'identityDetails.patientName');
  }

}

export default new Final_dischargeService();
