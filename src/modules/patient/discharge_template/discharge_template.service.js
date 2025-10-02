import { PATIENT_MODEL } from "../patient.model.js";
import twilio from 'twilio';

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

async sendDischargeTemplatesOnWhatsApp({ patientId, admissionId, templateIds = [], target }) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const patient = await PATIENT_MODEL.findById(patientId)
    .populate("admissionDetails.consultingDoctorId", "doctorName contactNo")
    .select("identityDetails patientName admissionDetails");
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
  if (!admission) throw new Error("Admission not found");

  // Filter discharge templates by IDs
  let templates = admission.dischargeTemplates;
  if (templateIds.length) {
    templates = templates.filter(t => templateIds.includes(t._id.toString()));
    if (!templates.length) throw new Error("No discharge templates matched the provided IDs");
  }

  // Get recipient number
  let recipientNumber;
  if (target === "doctor") {
    recipientNumber = admission.consultingDoctorId?.contactNo;
  } else if (target === "patient") {
    recipientNumber = patient.identityDetails.whatsappNo || patient.identityDetails.contactNo;
  }
  if (!recipientNumber) throw new Error("Recipient number not available");

  recipientNumber = `whatsapp:+${recipientNumber.toString().replace(/\D/g, "")}`;

  const results = [];

  for (const template of templates) {
  const templateType = template.type || "Not specified";

  const templateContent = Object.entries(template.template || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const bodyMessage = `Hello, here is the ${templateType} discharge summary for patient ${patient.identityDetails.patientName}:\n\n${templateContent}`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    // to: recipientNumber,
    to: 'whatsapp:+919834747298',
    body: bodyMessage,
  });

  results.push({
    templateId: template._id,
    type: templateType,
    content: templateContent
  });
}


  return {
    success: true,
    message: `Sent ${results.length} discharge template(s) to ${target} successfully`,
    details: results
  };
}

}

export default new Discharge_templateService();
