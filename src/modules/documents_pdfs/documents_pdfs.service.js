// import { DOCUMENT_PDF_MODEL } from "./documents_pdfs.model.js";
// import imagekit from "../../helpers/imagekit.js";
// import fs from "fs";
// import path from "path";

// class Documents_pdfsService {
// //   async uploadDoc(file) {
// //   try {
// //     const ext = path.extname(file.originalname).toLowerCase();

// //     if (![".pdf", ".doc", ".docx", ".xlsx"].includes(ext)) {
// //       throw new Error("Only PDF, DOC, and DOCX files are allowed");
// //     }

// //     const uploadResponse = await imagekit.upload({
// //       file: fs.readFileSync(file.path),
// //       fileName: file.originalname,
// //       folder: "/documents-PDFs",
// //     });

// //     const doc = new DOCUMENT_PDF_MODEL({
// //       pdfName: file.originalname,
// //       pdfUrl: uploadResponse.url,
// //     });
// //     await doc.save();

// //     fs.unlinkSync(file.path);

// //     const message = "document-pdf uploaded successfully";

// //     return { doc, message };
// //   } catch (err) {
// //     throw new Error("Document upload failed: " + err.message);
// //   }
// // }

// // bulk uploads pdfs
//   async uploadDocs(files) {
//     try {
//       const uploadedDocs = [];

//       for (const file of files) {
//         const ext = path.extname(file.originalname).toLowerCase();

//         if (![".pdf", ".doc", ".docx", ".xlsx"].includes(ext)) {
//           throw new Error("Only PDF, DOC, DOCX, and XLSX files are allowed");
//         }

//         const uploadResponse = await imagekit.upload({
//           file: fs.readFileSync(file.path),
//           fileName: file.originalname,
//           folder: "/documents-PDFs",
//         });

//         const doc = new DOCUMENT_PDF_MODEL({
//           pdfName: file.originalname,
//           pdfUrl: uploadResponse.url,
//         });
//         await doc.save();

//         fs.unlinkSync(file.path);

//         uploadedDocs.push(doc);
//       }

//       const message = `${uploadedDocs.length} document(s) uploaded successfully`;
//       return { docs: uploadedDocs, message };
//     } catch (err) {
//       throw new Error("Document upload failed: " + err.message);
//     }
//   }

//   async getAll() {
//     return DOCUMENT_PDF_MODEL.find();
//   }

//   async getById(id) {
//     return await DOCUMENT_PDF_MODEL.findById(id);
// }

// }

// export default new Documents_pdfsService();

import { DOCUMENT_PDF_MODEL } from "./documents_pdfs.model.js";
import { PATIENT_MODEL } from "../patient/patient.model.js";
import imagekit from "../../helpers/imagekit.js";

class Documents_pdfsService {
  async seedIfEmpty() {
    const count = await DOCUMENT_PDF_MODEL.countDocuments();
    if (count === 0) {
      const defaultDocs = [
  {
    pdfName: "AMBULANCE BOOKING FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/AMBULANCE_BOOKING_FORM_igv-xSCtE.pdf",
    color: ""
  },
  {
    pdfName: "Blood Component Request Form .docx",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Blood_Component_Request_Form__jrCFwE0ze.docx",
    color: ""
  },
  {
    pdfName: "Blood Issue Release slip.docx",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Blood_Issue_Release_slip_myyY7mOSlg.docx",
    color: ""
  },
  {
    pdfName: "CONSENT FOR BLOOD TRANSFUSION.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FOR_BLOOD_TRANSFUSION_QPovE0OZ2z.pdf",
    color: ""
  },
  {
    pdfName: "CONSENT FOR BLOODTRANSFUSIONORREFUSAL.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FOR_BLOODTRANSFUSIONORREFUSAL_W3q9NmQ7Kt.pdf",
    color: ""
  },
  {
    pdfName: "CONSENT FOR HIGH RISK SURGERY.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FOR_HIGH_RISK_SURGERY_Bu5kAgEw7n.pdf",
    color: ""
  },
  {
    pdfName: "CONSENT FORM FOR HIV TEST.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FORM_FOR_HIV_TEST_bykcGn839.pdf",
    color: ""
  },
  {
    pdfName: "CONSENT FORM FOR STRESS TEST.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FORM_FOR_STRESS_TEST_DM1G_oC5yh.pdf",
    color: ""
  },
  {
    pdfName: "CONSENT FORM FOR USING RESTRAINTS.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FORM_FOR_USING_RESTRAINTS_VQWDnQshm.pdf",
    color: ""
  },
  {
    pdfName: "CONSULTANT TRANSFER FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSULTANT_TRANSFER_FORM_mPL2OL3Yb.pdf",
    color: ""
  },
  {
    pdfName: "CROSS REFERENCE NOTES.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CROSS_REFERENCE_NOTES__pOyJVO15.pdf",
    color: ""
  },
  {
    pdfName: "DAILY NOTES.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/DAILY_NOTES_nhTMLpO9-.pdf",
    color: ""
  },
  {
    pdfName: "Daily notes.xlsx",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Daily_notes_7gYgbQsy5.xlsx",
    color: ""
  },
  {
    pdfName: "DISCHARGE SUMMARY (1).pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/DISCHARGE_SUMMARY__1__LgX5FZRpy.pdf",
    color: ""
  },
  {
    pdfName: "EMERGENCY ASSESSMENT & OBSERVATION FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/EMERGENCY_ASSESSMENT___OBSERVATION_FORM__OIm7aRp3.pdf",
    color: ""
  },
  {
    pdfName: "ER NURSING ASSESSMENT FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/ER_NURSING_ASSESSMENT_FORM_EA2_EkwBp.pdf",
    color: ""
  },
  {
    pdfName: "HEMODILYSIS FLOW CHART.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/HEMODILYSIS_FLOW_CHART_QvYrd8nXs.pdf",
    color: ""
  },
  {
    pdfName: "high cost medicine consent.docx",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/high_cost_medicine_consent_joOXfy-CA.docx",
    color: ""
  },
  {
    pdfName: "INCIDENT REPORTING FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/INCIDENT_REPORTING_FORM_quN95J4lRq.pdf",
    color: ""
  },
  {
    pdfName: "INVESTIGATION RESULT CHART.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/INVESTIGATION_RESULT_CHART_Wrr23Xyc5e.pdf",
    color: ""
  },
  {
    pdfName: "INVESTIGATION RESULT CHART (1).pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/INVESTIGATION_RESULT_CHART__1__BqMcePJ3O.pdf",
    color: ""
  },
  {
    pdfName: "IPD CARD FORM 8 PAGES.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/IPD_CARD_FORM_8_PAGES_aS-phCppi.pdf",
    color: ""
  },
  {
    pdfName: "Nursing Assessment on Admission_ok-1.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Nursing_Assessment_on_Admission_ok-1_PPqckSGvO.pdf",
    color: ""
  },
  {
    pdfName: "OPERATION  PROCEDURE BILLING FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/OPERATION__PROCEDURE_BILLING_FORM_pghAQ8Ul9.pdf",
    color: ""
  },
  {
    pdfName: "OT CLEARANCE FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/OT_CLEARANCE_FORM_oNf9SuboZ.pdf",
    color: ""
  },
  {
    pdfName: "PATIENT & FAMILY EDUCATION RECORD.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT___FAMILY_EDUCATION_RECORD_3_fHrw8yP.pdf",
    color: ""
  },
  {
    pdfName: "PATIENT REGISTRATION FORM (INDOOR).pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT_REGISTRATION_FORM__INDOOR__4rBUyt6z3.pdf",
    color: ""
  },
  {
    pdfName: "PATIENT RELATIVE EDUCATION RECORD.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT_RELATIVE_EDUCATION_RECORD_SUxRq1uzV2.pdf",
    color: ""
  },
  {
    pdfName: "PATIENT VALUABLES FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT_VALUABLES_FORM_BRU6OIL6r.pdf",
    color: ""
  },
  {
    pdfName: "RESTRAINT PATIENT CARE AND.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/RESTRAINT_PATIENT_CARE_AND_4jEjRBZqT5.pdf",
    color: ""
  },
  {
    pdfName: "SURGICAL SAFETY CHECKLIST..pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/SURGICAL_SAFETY_CHECKLIST._uOXgWpKjd.pdf",
    color: ""
  },
  {
    pdfName: "TRANSPORTATION CONSENT FORM.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/TRANSPORTATION_CONSENT_FORM_4F7Ua6G5MY.pdf",
    color: ""
  },
  {
    pdfName: "TREATMENT CHART 6 PAGES-1.pdf",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/TREATMENT_CHART_6_PAGES-1_slTXp2b0W.pdf",
    color: ""
  },
  {
    pdfName: "જનરલ એનેસ્થેસીયા.docx",
    pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/જનરલ_એનેસ્થેસીયા_U4pcGfvuPV.docx",
    color: ""
  },
];
    await DOCUMENT_PDF_MODEL.insertMany(defaultDocs);
    console.log("Default PDFs seeded into database.");
    }
  }

  async getAll() {
    await this.seedIfEmpty(); 
    return DOCUMENT_PDF_MODEL.find();
  }

  async getById(id) {
    return await DOCUMENT_PDF_MODEL.findById(id);
  }

  async addPdfToPatient({ patientId, admissionId, pdfName, pdfBuffer }) {
    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) throw new Error("Patient not found");

    const admission = patient.admissionDetails.id(admissionId);
    if (!admission) throw new Error("Admission not found");

    const uploadResponse = await imagekit.upload({
      file: pdfBuffer,            
      fileName: pdfName,          
      folder: "/patient-pdfs"     
    });

    admission.documentPdf.push({
      name: pdfName,
      path: uploadResponse.url    
    });

    await patient.save();

    return {
      patientId,
      admissionId,
      pdfName,
      pdfPath: uploadResponse.url,
      // message: "PDF successfully uploaded to ImageKit and saved to patient"
    };
  }

  async updateColorForPdfs({ pdfIds, color }) {
    if (!pdfIds || pdfIds.length === 0) {
      throw new Error("No PDF IDs provided");
    }

    const result = await DOCUMENT_PDF_MODEL.updateMany(
      { _id: { $in: pdfIds } },
      { $set: { color } }
    );

    return {
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} PDF(s) updated with color "${color}".`
    };
  }
  
}

export default new Documents_pdfsService();
