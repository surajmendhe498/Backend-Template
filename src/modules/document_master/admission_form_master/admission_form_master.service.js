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


// import { PATIENTADMISSION_MODEL } from './admission_form_master.model.js';

// function toCamelCase(str) {
//   return str
//     .replace(/[^a-zA-Z0-9 ]/g, '')
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
//       index === 0 ? word.toLowerCase() : word.toUpperCase()
//     )
//     .replace(/\s+/g, '');
// }

// class Admission_form_masterService {
//   async seedIfEmpty() {
//     const count = await PATIENTADMISSION_MODEL.countDocuments();
//     if (count === 0) {
//       const fields = [
//         { name: "Salutation", type: "dropdown" },
//         { name: "Religion", type: "dropdown" },
//         { name: "Age & Date Of Birth", type: "nested" },
//         { name: "Weight", type: "number" },
//         { name: "Contact No", type: "text" },
//         { name: "Email", type: "email" },
//         { name: "Patient MLC Type", type: "dropdown" },
//         { name: "Patient Photo", type: "image" },
//         { name: "Birth asphyxia & NICU shifted", type: "checkbox" },
//         { name: "Blood Group", type: "dropdown" },
//         { name: "Term of baby", type: "text" },
//         { name: "Mode of Delivery", type: "dropdown" },
//         { name: "Baby Illness", type: "text" },
//         { name: "Referred by Doctor", type: "text" },
//         { name: "Provisional Diagnosis", type: "text" },
//         { name: "Final Diagnosis", type: "text" },
//         { name: "Operations", type: "text" },
//         { name: "Laboratory Selection", type: "dropdown" },
//         { name: "Patient Address", type: "textarea" },
//         { name: "Patient from Corporation", type: "checkbox" },
//         { name: "Relative Details (Attendant)", type: "text" },
//         { name: "Aadhar details", type: "nested" },
//         { name: "Pan Card details", type: "nested" },
//         { name: "Covid Report", type: "file" },
//         { name: "Vaccination Details", type: "text" },
//         { name: "Signatures", type: "signature" },
//         { name: "Patient Height", type: "number" },
//         { name: "Other Consultants", type: "text" },
//         { name: "Patient Allergic / Under Precaution", type: "text" },
//         { name: "Clinical Discharge", type: "checkbox" },
//         { name: "Billing Discharge", type: "checkbox" },
//         { name: "WhatsApp Number", type: "text" },
//         { name: "Applicable Class", type: "dropdown" },
//         { name: "Payment Remark", type: "textarea" },
//         { name: "MLC No", type: "text" },
//         { name: "Employer Company Name", type: "text" },
//         { name: "TID Number", type: "text" },
//         { name: "Referred by Doctor Select Box", type: "dropdown" },
//         { name: "Pharmacy Discharge", type: "checkbox" },
//         { name: "Health Card Details", type: "nested" },
//         { name: "Payment Mode Options", type: "dropdown" },
//         { name: "Maintain MRD File Status", type: "checkbox" },
//         { name: "Patient Guardian Details", type: "text" },
//         { name: "Consultant Unit", type: "dropdown" },
//         { name: "Bed Department", type: "dropdown" },
//         { name: "Patient Type (New/Old)", type: "dropdown" },
//         { name: "Husband Name", type: "text" },
//         { name: "Food Preference", type: "dropdown" },
//         { name: "Birth Time", type: "time" },
//         { name: "Mother Age", type: "number" },
//         { name: "Complaints", type: "textarea" },
//         { name: "Past/Family History", type: "textarea" },
//         { name: "Remark", type: "textarea" },
//         { name: "Add Diet Module", type: "checkbox" },
//         { name: "Use Clinical Score Calculator", type: "checkbox" },
//         { name: "Lab Discharge", type: "checkbox" },
//         { name: "CPT", type: "text" },
//         { name: "Referral from Doctor", type: "text" },
//         { name: "Emergency No", type: "text" },
//         { name: "Declare as Critical patient", type: "checkbox" }
//       ];

//       const data = fields.map(({ name, type }) => ({
//         fieldName: name,
//         fieldKey: toCamelCase(name),
//         typeOfField: type,
//         showInPatientSticker: false,
//         showInPageFloatingView: false,
//         showInAdmissionCard: false,
//         showInDischargeCard: false,
//         isMandatory: false,
//         status: false
//       }));

//       await PATIENTADMISSION_MODEL.insertMany(data);
//     }
//   }

//   async getAll() {
//     return await PATIENTADMISSION_MODEL.find().sort({ fieldName: 1 });
//   }

//   async updateField(id, updateData) {
//     return await PATIENTADMISSION_MODEL.findByIdAndUpdate(id, updateData, { new: true });
//   }

//   async getById(id) {
//     return await PATIENTADMISSION_MODEL.findById(id);
//   }
// }

// export default new Admission_form_masterService();
