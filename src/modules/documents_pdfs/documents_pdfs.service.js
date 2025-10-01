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
import mongoose from "mongoose";

class Documents_pdfsService {
  async seedIfEmpty() {
    const count = await DOCUMENT_PDF_MODEL.countDocuments();
  if (count === 0) {
    let defaultDocs = [
      {
        pdfName: "AMBULANCE BOOKING FORM.pdf",
        files: [
          {
            name: "AMBULANCE BOOKING FORM - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/AMBULANCE_BOOKING_FORM_igv-xSCtE.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      // {
      //   pdfName: "Blood Component Request Form .docx",
      //   files: [
      //     {
      //       name: "Blood Component Request Form - English",
      //       language: "english",
      //       pdfUrl:
      //         "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Blood_Component_Request_Form__jrCFwE0ze.docx",
      //     },
      //     { name: "", language: "hindi", pdfUrl: "" },
      //     { name: "", language: "gujarati", pdfUrl: "" },
      //   ],
      //   color: "",
      // },
      // {
      //   pdfName: "Blood Issue Release slip.docx",
      //   files: [
      //     {
      //       name: "Blood Issue Release slip - English",
      //       language: "english",
      //       pdfUrl:
      //         "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Blood_Issue_Release_slip_myyY7mOSlg.docx",
      //     },
      //     { name: "", language: "hindi", pdfUrl: "" },
      //     { name: "", language: "gujarati", pdfUrl: "" },
      //   ],
      //   color: "",
      // },
      {
        pdfName: "CONSENT FOR BLOOD TRANSFUSION.pdf",
        files: [
          {
            name: "CONSENT FOR BLOOD TRANSFUSION - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FOR_BLOOD_TRANSFUSION_QPovE0OZ2z.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CONSENT FOR BLOODTRANSFUSIONORREFUSAL.pdf",
        files: [
          {
            name: "CONSENT FOR BLOODTRANSFUSIONORREFUSAL - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FOR_BLOODTRANSFUSIONORREFUSAL_W3q9NmQ7Kt.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CONSENT FOR HIGH RISK SURGERY.pdf",
        files: [
          {
            name: "CONSENT FOR HIGH RISK SURGERY - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FOR_HIGH_RISK_SURGERY_Bu5kAgEw7n.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CONSENT FORM FOR HIV TEST.pdf",
        files: [
          {
            name: "CONSENT FORM FOR HIV TEST - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FORM_FOR_HIV_TEST_bykcGn839.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CONSENT FORM FOR STRESS TEST.pdf",
        files: [
          {
            name: "CONSENT FORM FOR STRESS TEST - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FORM_FOR_STRESS_TEST_DM1G_oC5yh.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CONSENT FORM FOR USING RESTRAINTS.pdf",
        files: [
          {
            name: "CONSENT FORM FOR USING RESTRAINTS - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSENT_FORM_FOR_USING_RESTRAINTS_VQWDnQshm.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CONSULTANT TRANSFER FORM.pdf",
        files: [
          {
            name: "CONSULTANT TRANSFER FORM - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CONSULTANT_TRANSFER_FORM_mPL2OL3Yb.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "CROSS REFERENCE NOTES.pdf",
        files: [
          {
            name: "CROSS REFERENCE NOTES - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/CROSS_REFERENCE_NOTES__pOyJVO15.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "DAILY NOTES.pdf",
        files: [
          {
            name: "DAILY NOTES - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/DAILY_NOTES_nhTMLpO9-.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      // {
      //   pdfName: "Daily notes.xlsx",
      //   files: [
      //     {
      //       name: "Daily notes - English",
      //       language: "english",
      //       pdfUrl:
      //         "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Daily_notes_7gYgbQsy5.xlsx",
      //     },
      //     { name: "", language: "hindi", pdfUrl: "" },
      //     { name: "", language: "gujarati", pdfUrl: "" },
      //   ],
      //   color: "",
      // },
      {
        pdfName: "DISCHARGE SUMMARY (1).pdf",
        files: [
          {
            name: "DISCHARGE SUMMARY (1) - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/DISCHARGE_SUMMARY__1__LgX5FZRpy.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "EMERGENCY ASSESSMENT & OBSERVATION FORM.pdf",
        files: [
          {
            name: "EMERGENCY ASSESSMENT & OBSERVATION FORM - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/EMERGENCY_ASSESSMENT___OBSERVATION_FORM__OIm7aRp3.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "ER NURSING ASSESSMENT FORM.pdf",
        files: [
          {
            name: "ER NURSING ASSESSMENT FORM - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/ER_NURSING_ASSESSMENT_FORM_EA2_EkwBp.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "HEMODILYSIS FLOW CHART.pdf",
        files: [
          {
            name: "HEMODILYSIS FLOW CHART - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/HEMODILYSIS_FLOW_CHART_QvYrd8nXs.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      // {
      //   pdfName: "high cost medicine consent.docx",
      //   files: [
      //     {
      //       name: "high cost medicine consent - English",
      //       language: "english",
      //       pdfUrl:
      //         "https://ik.imagekit.io/wukb4sljv/documents-PDFs/high_cost_medicine_consent_joOXfy-CA.docx",
      //     },
      //     { name: "", language: "hindi", pdfUrl: "" },
      //     { name: "", language: "gujarati", pdfUrl: "" },
      //   ],
      //   color: "",
      // },
      {
        pdfName: "INCIDENT REPORTING FORM.pdf",
        files: [
          {
            name: "INCIDENT REPORTING FORM - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/INCIDENT_REPORTING_FORM_quN95J4lRq.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
      {
        pdfName: "INVESTIGATION RESULT CHART.pdf",
        files: [
          {
            name: "INVESTIGATION RESULT CHART - English",
            language: "english",
            pdfUrl:
              "https://ik.imagekit.io/wukb4sljv/documents-PDFs/INVESTIGATION_RESULT_CHART_Wrr23Xyc5e.pdf",
          },
          { name: "", language: "hindi", pdfUrl: "" },
          { name: "", language: "gujarati", pdfUrl: "" },
        ],
        color: "",
      },
    
      {
  pdfName: "INVESTIGATION RESULT CHART (1).pdf",
  files: [
    { name: "INVESTIGATION RESULT CHART (1) - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/INVESTIGATION_RESULT_CHART__1__BqMcePJ3O.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "IPD CARD FORM 8 PAGES.pdf",
  files: [
    { name: "IPD CARD FORM 8 PAGES - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/IPD_CARD_FORM_8_PAGES_aS-phCppi.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "Nursing Assessment on Admission_ok-1.pdf",
  files: [
    { name: "Nursing Assessment on Admission_ok-1 - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/Nursing_Assessment_on_Admission_ok-1_PPqckSGvO.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "OPERATION  PROCEDURE BILLING FORM.pdf",
  files: [
    { name: "OPERATION PROCEDURE BILLING FORM - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/OPERATION__PROCEDURE_BILLING_FORM_pghAQ8Ul9.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "OT CLEARANCE FORM.pdf",
  files: [
    { name: "OT CLEARANCE FORM - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/OT_CLEARANCE_FORM_oNf9SuboZ.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "PATIENT & FAMILY EDUCATION RECORD.pdf",
  files: [
    { name: "PATIENT & FAMILY EDUCATION RECORD - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT___FAMILY_EDUCATION_RECORD_3_fHrw8yP.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "PATIENT REGISTRATION FORM (INDOOR).pdf",
  files: [
    { name: "PATIENT REGISTRATION FORM (INDOOR) - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT_REGISTRATION_FORM__INDOOR__4rBUyt6z3.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "PATIENT RELATIVE EDUCATION RECORD.pdf",
  files: [
    { name: "PATIENT RELATIVE EDUCATION RECORD - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT_RELATIVE_EDUCATION_RECORD_SUxRq1uzV2.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "PATIENT VALUABLES FORM.pdf",
  files: [
    { name: "PATIENT VALUABLES FORM - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/PATIENT_VALUABLES_FORM_BRU6OIL6r.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "RESTRAINT PATIENT CARE AND.pdf",
  files: [
    { name: "RESTRAINT PATIENT CARE AND - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/RESTRAINT_PATIENT_CARE_AND_4jEjRBZqT5.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "SURGICAL SAFETY CHECKLIST..pdf",
  files: [
    { name: "SURGICAL SAFETY CHECKLIST - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/SURGICAL_SAFETY_CHECKLIST._uOXgWpKjd.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "TRANSPORTATION CONSENT FORM.pdf",
  files: [
    { name: "TRANSPORTATION CONSENT FORM - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/TRANSPORTATION_CONSENT_FORM_4F7Ua6G5MY.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
{
  pdfName: "TREATMENT CHART 6 PAGES-1.pdf",
  files: [
    { name: "TREATMENT CHART 6 PAGES-1 - English", language: "english", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/TREATMENT_CHART_6_PAGES-1_slTXp2b0W.pdf" },
    { name: "", language: "hindi", pdfUrl: "" },
    { name: "", language: "gujarati", pdfUrl: "" },
  ],
  color: "",
},
// {
//   pdfName: "જનરલ એનેસ્થેસીયા.docx",
//   files: [
//     { name: "", language: "english", pdfUrl: "" },
//     { name: "", language: "hindi", pdfUrl: "" },
//     { name: "જનરલ એનેસ્થેસીયા - Gujarati", language: "gujarati", pdfUrl: "https://ik.imagekit.io/wukb4sljv/documents-PDFs/જનરલ_એનેસ્થેસીયા_U4pcGfvuPV.docx" },
//   ],
//   color: "",
//   }
    ];

    defaultDocs = defaultDocs.map(doc => ({
      pdfName: doc.pdfName,
      files: doc.files.filter(f => f.pdfUrl), // only keep if pdfUrl is not empty
    }));

    await DOCUMENT_PDF_MODEL.insertMany(defaultDocs);
    console.log("Seeded all multi-language PDFs (English only, Hindi/Gujarati empty).");
  }
  }

  async getAll() {
    await this.seedIfEmpty(); 
    return DOCUMENT_PDF_MODEL.find();
  }

  async getById(id) {
    return await DOCUMENT_PDF_MODEL.findById(id);
  }

  async addLanguageVersion(pdfId, language, file, name) {
  const pdf = await DOCUMENT_PDF_MODEL.findById(pdfId);
  if (!pdf) throw new Error("PDF not found");

  if (!file) throw new Error("No file provided for upload");

  const uploadResponse = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder: "/patient-pdfs",
  });

  const pdfUrl = uploadResponse.url;

  // Check if language already exists
  const existing = pdf.files.find(f => f.language === language);
  if (existing) {
    existing.pdfUrl = pdfUrl;
    existing.name = name || existing.name || ""; // update name if provided
  } else {
    pdf.files.push({
      language,
      pdfUrl,
      name: name || `${pdf.pdfName} - ${language}`, // default fallback
    });
  }

  return pdf.save();
}

async addPdfToPatient({ patientId, admissionId, mainPdfId, pdfBuffer, pdfName, user }) {
  if (!mainPdfId) throw new Error("mainPdfId is required");
  if (!pdfName) throw new Error("pdfName is required");
  if (!pdfBuffer) throw new Error("PDF file buffer is required");

  const mainPdf = await DOCUMENT_PDF_MODEL.findById(mainPdfId);
  if (!mainPdf) throw new Error("mainPdfId does not exist");

  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  const uploadResponse = await imagekit.upload({
    file: pdfBuffer,
    fileName: pdfName,
    folder: "/patient-pdfs"
  });

  const fileData = {
    name: pdfName,
    path: uploadResponse.url,
    deleted: false,
    uploadedAt: new Date(),
    uploadedBy: {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`
    }
  };

  const existingGroup = admission.documentPdf.find(
    doc => doc.mainPdfId?.toString() === mainPdfId
  );

  if (existingGroup) {
    existingGroup.files.push(fileData);
  } else {
    admission.documentPdf.push({
      mainPdfId,
      files: [fileData]
    });
  }

  await patient.save();

  return {
    patientId,
    admissionId,
    mainPdfId,
    pdfName,
    pdfPath: uploadResponse.url,
    uploadedBy: fileData.uploadedBy,
    uploadedAt: fileData.uploadedAt
  };
}

  async getPdfsByPatient({ patientId, admissionId }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  return admission.documentPdf || [];
}

// patient
async updatePdfDocument({ patientId, admissionId, pdfId, fileName, pdfBuffer }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  let updatedFile = null;

  for (const group of admission.documentPdf) {
    const file = group.files.id(pdfId);
    if (file) {
      if (fileName) file.name = fileName;

      if (pdfBuffer) {
        const uploadResponse = await imagekit.upload({
          file: pdfBuffer,
          fileName: fileName || file.name,
          folder: "/patient-pdfs",
        });
        file.path = uploadResponse.url;
      }

      updatedFile = file;
      break;
    }
  }

  if (!updatedFile) throw new Error("PDF file not found");

  await patient.save();
  return updatedFile;
}

// patient
async deletePdfDocument({ patientId, admissionId, pdfId }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  const group = admission.documentPdf.find(doc => doc._id.toString() === pdfId);
  if (group) {
    admission.documentPdf = admission.documentPdf.filter(doc => doc._id.toString() !== pdfId);
    await patient.save();
    return { message: "PDF group deleted successfully", pdfId };
  }

  let fileDeleted = false;
  admission.documentPdf.forEach(group => {
    const fileIndex = group.files.findIndex(file => file._id.toString() === pdfId);
    if (fileIndex !== -1) {
      group.files.splice(fileIndex, 1);
      fileDeleted = true;
    }
  });

  if (!fileDeleted) throw new Error("PDF file not found");

  admission.documentPdf = admission.documentPdf.filter(group => group.files.length > 0);

  await patient.save();
  return { message: "PDF file deleted successfully", pdfId };
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

async softDeletePdfDocument({ patientId, admissionId, pdfId }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  let found = false;

  for (const group of admission.documentPdf) {
    const file = group.files.find(f => f._id.toString() === pdfId);
    if (file) {
      if (file.deleted) throw new Error("PDF already soft-deleted");
      file.deleted = true;
      found = true;
      break;
    }
  }

  if (!found) throw new Error("PDF document not found");

  await patient.save();

  return { pdfId, message: "PDF soft-deleted successfully" };
}

async getSoftDeletedPdfs({ patientId, admissionId }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  const softDeleted = admission.documentPdf
    .map(group => {
      const deletedFiles = group.files.filter(f => f.deleted);
      if (deletedFiles.length > 0) {
        return {
          mainPdfId: group.mainPdfId,
          files: deletedFiles
        };
      }
      return null;
    })
    .filter(g => g !== null);

  return softDeleted;
}

async restorePdfDocument({ patientId, admissionId, pdfId }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  let restored = false;

  for (const group of admission.documentPdf) {
    const file = group.files.id(pdfId);
    if (file) {
      if (!file.deleted) throw new Error("PDF is not soft-deleted");
      file.deleted = false;
      restored = true;
      break;
    }
  }

  if (!restored) throw new Error("PDF file not found");

  await patient.save();
  return { pdfId, message: "PDF restored successfully" };
}
  
}

export default new Documents_pdfsService();