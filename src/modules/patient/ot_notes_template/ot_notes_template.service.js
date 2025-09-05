import { PATIENT_MODEL } from "../patient.model.js";

class Ot_notes_templateService {
   
   async addTemplate(patientId, admissionId, templateData) {
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

    admission.otNotesTemplates.push({ template: templateData });
    await patient.save();

    return admission.otNotesTemplates[admission.otNotesTemplates.length - 1]; 
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

    return admission.otNotesTemplates;
  }
}

export default new Ot_notes_templateService();
