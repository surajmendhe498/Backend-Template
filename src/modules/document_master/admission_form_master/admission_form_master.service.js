import { PATIENTADMISSION_MODEL } from './admission_form_master.model.js';

class Admission_form_masterService {
  async seedIfEmpty() {
    const count = await PATIENTADMISSION_MODEL.countDocuments();
    if (count === 0) {
      const fields = [
        "Salutation", "Religion", "Age & Date Of Birth", "Weight", "Contact No", "Email",
        "Patient MLC Type", "Patient Photo", "Birth asphyxia & NICU shifted", "Blood Group", 
        "Term of baby", "Mode of Delivery", "Baby Illness", "Referred by Doctor", 
        "Provisional Diagnosis", "Final Diagnosis", "Operations", "Laboratory Selection", 
        "Patient Address", "Patient from Corporation", "Relative Details (Attendant)", 
        "Aadhar details", "Pan Card details", "Covid Report", "Vaccination Details", 
        "Signatures", "Patient Height", "Other Consultants", "Patient Allergic / Under Precaution", 
        "Clinical Discharge", "Billing Discharge", "WhatsApp Number", "Applicable Class", 
        "Payment Remark", "MLC No", "Employer Company Name", "TID Number", 
        "Referred by Doctor Select Box", "Pharmacy Discharge", "Health Card Details", 
        "Payment Mode Options", "Maintain MRD File Status", "Patient Guardian Details", 
        "Consultant Unit", "Bed Department", "Patient Type (New/Old)", "Husband Name", 
        "Food Preference", "Birth Time", "Mother Age", "Complaints", "Past/Family History", 
        "Remark", "Add Diet Module", "Use Clinical Score Calculator", "Lab Discharge", 
        "CPT", "Referral from Doctor", "Emergency No", "Declare as Critical patient"
      ];
      const data = fields.map(field => ({
        fieldName: field,
        showInPatientSticker: false,
        showInPageFloatingView: false,
        showInAdmissionCard: false,
        showInDischargeCard: false,
        isMandatory: false,
        status: false
      }));

      await PATIENTADMISSION_MODEL.insertMany(data);
    }
  }

  async getAll() {
    return await PATIENTADMISSION_MODEL.find().sort({ fieldName: 1 });
  }

  async updateField(id, updateData) {
  return await PATIENTADMISSION_MODEL.findByIdAndUpdate(id, updateData, { new: true });
}

async getById(id) {
  return await PATIENTADMISSION_MODEL.findById(id);
}

}

export default new Admission_form_masterService();
