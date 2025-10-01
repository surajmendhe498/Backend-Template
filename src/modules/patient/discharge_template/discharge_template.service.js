import { PATIENT_MODEL } from "../patient.model.js";

class Discharge_templateService {

  async addDischargeTemplate(patientId, admissionId, templateData, type) {
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

    admission.dischargeTemplates.push({ template: templateData, type });
    await patient.save();

    const newTemplate =
      admission.dischargeTemplates[admission.dischargeTemplates.length - 1];

    return newTemplate;
  }

  async getAllTemplates(patientId, admissionId, type = null) {
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

    if (type) {
      return admission.dischargeTemplates.filter(t => t.type === type);
    }

    return admission.dischargeTemplates;
  }

  async editTemplate(patientId, admissionId, templateId, templateData, type) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw Object.assign(new Error("Patient not found"), { statusCode: 404 });

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw Object.assign(new Error("Admission not found for this patient"), { statusCode: 404 });

  const template = admission.dischargeTemplates.id(templateId);
  if (!template) throw Object.assign(new Error("Template not found"), { statusCode: 404 });

  template.template = templateData;

  if (type) {
    if (!["provisional", "final"].includes(type)) {
      throw Object.assign(new Error("Invalid template type"), { statusCode: 400 });
    }
    template.type = type;
  }

  await patient.save();
  return template;
}

  async deleteTemplate(patientId, admissionId, templateId) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw Object.assign(new Error("Patient not found"), { statusCode: 404 });

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw Object.assign(new Error("Admission not found for this patient"), { statusCode: 404 });

  const originalLength = admission.dischargeTemplates.length;
  admission.dischargeTemplates = admission.dischargeTemplates.filter(
    (t) => t._id.toString() !== templateId
  );

  if (admission.dischargeTemplates.length === originalLength) {
    throw Object.assign(new Error("Template not found"), { statusCode: 404 });
  }

  await patient.save();

  return { deleted: true };
}

}

export default new Discharge_templateService();
