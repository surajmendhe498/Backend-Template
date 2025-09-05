import { PATIENT_MODEL } from "../patient.model.js";

class Discharge_templateService {
   
async addDischargeTemplate(patientId, admissionId, templateData) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) {
    const error = new Error("Admission not found for this patient");
    error.statusCode = 404;
    throw error;
  }

  admission.dischargeTemplates.push({ template: templateData });
  await patient.save();

  const newTemplate =
    admission.dischargeTemplates[admission.dischargeTemplates.length - 1];

  return newTemplate;
}

async getAllTemplates(patientId, admissionId) {
    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) {
      const error = new Error("Patient not found");
      error.statusCode = 404;
      throw error;
    }

    const admission = patient.admissionDetails.id(admissionId);
    if (!admission) {
      const error = new Error("Admission not found for this patient");
      error.statusCode = 404;
      throw error;
    }

    return admission.dischargeTemplates;
  }

}

export default new Discharge_templateService();
