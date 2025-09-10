import { FILERECORDING_MODEL } from './files_recordings.model.js';
import { PATIENT_MODEL } from '../patient/patient.model.js';
import imagekit from '../../helpers/imagekit.js';
import fs from 'fs';
import path from 'path';
import { FOLDER_MODEL } from '../folders/folders.model.js';
import axios from 'axios';
import twilio from "twilio";

class Files_recordingsService {
  async uploadFiles({ patientId, admissionId, files, user }) {
    const patientExists = await PATIENT_MODEL.findById(patientId);
    if (!patientExists) throw new Error("Invalid Patient ID: Patient not found");

    const admissionExists = patientExists.admissionDetails.find(
      a => a._id.toString() === admissionId
    );
    if (!admissionExists) throw new Error("Invalid Admission ID: Admission not found for the given patient.");

    const uploadedBy = user?.firstName || user?.username || "Unknown User";
    const uploadedAt = new Date();

    const uploadToImageKit = async (file) => {
      const fileBuffer = fs.readFileSync(file.path);
      const extension = path.extname(file.originalname).toLowerCase();
      const baseName = path.basename(file.originalname, extension);
      const safeFileName = baseName + extension;

      const uploadResult = await imagekit.upload({
        file: fileBuffer,
        fileName: safeFileName,
        folder: `/${file.fieldname}`,
      });

      return uploadResult.url;
    };

    const mapFiles = async (fileArray) => {
      return Promise.all(
        (fileArray || []).map(async (f) => ({
          name: f.originalname,
          path: await uploadToImageKit(f),
          uploadedBy,
          uploadedAt
        }))
      );
    };

    const docs = await mapFiles((files && files.docs) || []);
    const labReports = await mapFiles((files && files.labReports) || []);
    const radiologyReports = await mapFiles((files && files.radiologyReports) || []);

    const data = {
      patientId,
      admissionId,
      docs,
      labReports,
      radiologyReports
    };

    const newRecord = await FILERECORDING_MODEL.create(data);

    // Update patient admissionDetails
    await PATIENT_MODEL.updateOne(
      { _id: patientId, "admissionDetails._id": admissionId },
      {
        $push: {
          "admissionDetails.$.docs": { $each: docs },
          "admissionDetails.$.labReports": { $each: labReports },
          "admissionDetails.$.radiologyReports": { $each: radiologyReports }
        }
      }
    );

    if (files) {
      Object.values(files)
        .flat()
        .forEach((f) => {
          if (f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
    }

    return newRecord;
  }

  async getAll() {
    return await FILERECORDING_MODEL.find().populate('patientId');
  }

  async getByPatientId(patientId, admissionId = null) {
    const patient = await PATIENT_MODEL.findById(patientId)
      .select('identityDetails.patientName admissionDetails._id admissionDetails.docs admissionDetails.labReports admissionDetails.radiologyReports');

    if (!patient) return [];

    if (admissionId) {
      const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
      if (!admission) return [];

      return {
        admissionId: admission._id,
        docs: admission.docs,
        labReports: admission.labReports,
        radiologyReports: admission.radiologyReports,
        patientName: patient.identityDetails?.patientName
      };
    }

    return patient.admissionDetails.map(admission => ({
      admissionId: admission._id,
      docs: admission.docs,
      labReports: admission.labReports,
      radiologyReports: admission.radiologyReports,
      patientName: patient.identityDetails?.patientName
    }));
  }

async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, fileName, user }) {
  const fileFields = ['docs', 'labReports', 'radiologyReports'];
  if (!fileFields.includes(fieldType)) throw new Error(`Invalid fieldType`);

  const admission = await PATIENT_MODEL.findOne(
    { _id: patientId, "admissionDetails._id": admissionId }
  );
  if (!admission) throw new Error("Admission not found");

  const admissionDetail = admission.admissionDetails.id(admissionId);
  const fileArray = admissionDetail[fieldType];
  const fileObj = fileArray.id(fileId);

  if (!fileObj) throw new Error(`No file with id ${fileId} found in ${fieldType}`);

  const currentUser = user?.firstName || user?.username || "Unknown User";
  const now = new Date();

  // Case 1: New file upload
  if (file) {
    const fileBuffer = fs.readFileSync(file.path);
    const uploadResult = await imagekit.upload({
      file: fileBuffer,
      fileName: file.originalname,
      folder: `/${fieldType}`
    });

    fileObj.path = uploadResult.url;
    fileObj.name = fileName || file.originalname;
    fileObj.uploadedBy = currentUser;

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }

  // Case 2: Only fileName update
  if (!file && fileName) {
    fileObj.name = fileName;
    fileObj.uploadedBy = currentUser; 
  }

  fileObj.updatedAt = now;

  await admission.save();

  return {
    message: `${fieldType} updated successfully`,
    updatedFile: {
      name: fileObj.name,
      path: fileObj.path,
      uploadedBy: fileObj.uploadedBy,
      updatedAt: fileObj.updatedAt
    }
  };
}

async deleteSingleFile({ patientId, admissionId, fileId, fieldType }) {
  const validFields = ['docs', 'labReports', 'radiologyReports'];
  if (!validFields.includes(fieldType)) {
    throw new Error(`Invalid fieldType. Must be one of: ${validFields.join(', ')}`);
  }

  const admission = await PATIENT_MODEL.findOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { "admissionDetails.$": 1 }
  );
  if (!admission) throw new Error("Admission not found");

  const fieldArray = admission.admissionDetails[0][fieldType];
  const fileExists = fieldArray.some(f => f._id.toString() === fileId);

  if (!fileExists) {
    throw new Error(`No file with id ${fileId} found in ${fieldType}`);
  }

  await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { $pull: { [`admissionDetails.$.${fieldType}`]: { _id: fileId } } }
  );

  return { message: `${fieldType} file deleted successfully`, fileId };
} 

async getDocs(patientId, admissionId) {
  const patient = await PATIENT_MODEL.findById(patientId).select(
    'identityDetails.patientName admissionDetails._id admissionDetails.docs'
  );

  if (!patient) return [];

  const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
  if (!admission) return [];

  return {
    patientName: patient.identityDetails?.patientName,
    admissionId: admission._id,
    docs: admission.docs
  };
}

async getLabReports(patientId, admissionId) {
  const patient = await PATIENT_MODEL.findById(patientId).select(
    'identityDetails.patientName admissionDetails._id admissionDetails.labReports'
  );

  if (!patient) return [];

  const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
  if (!admission) return [];

  return {
    patientName: patient.identityDetails?.patientName,
    admissionId: admission._id,
    labReports: admission.labReports
  };
}

async getRadiologyReports(patientId, admissionId) {
  const patient = await PATIENT_MODEL.findById(patientId).select(
    'identityDetails.patientName admissionDetails._id admissionDetails.radiologyReports'
  );

  if (!patient) return [];

  const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
  if (!admission) return [];

  return {
    patientName: patient.identityDetails?.patientName,
    admissionId: admission._id,
    radiologyReports: admission.radiologyReports
  };
}

async deleteMultipleFiles({ patientId, admissionId, fileIds, fieldType }) {
  const validFields = ['docs', 'labReports', 'radiologyReports'];
  if (!validFields.includes(fieldType)) {
    throw new Error(`Invalid fieldType. Must be one of: ${validFields.join(', ')}`);
  }

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    throw new Error("fileIds must be a non-empty array");
  }

  const admission = await PATIENT_MODEL.findOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { "admissionDetails.$": 1 }
  );

  if (!admission) throw new Error("Admission not found");

  const fieldArray = admission.admissionDetails[0][fieldType];
  const existingIds = fieldArray.map(f => f._id.toString());
  const notFoundIds = fileIds.filter(id => !existingIds.includes(id));

  if (notFoundIds.length === fileIds.length) {
    throw new Error(`No matching files found in ${fieldType}`);
  }

  await PATIENT_MODEL.updateOne(
  { _id: patientId, "admissionDetails._id": admissionId },
  { $pull: { [`admissionDetails.$.${fieldType}`]: { _id: { $in: fileIds } } } }
);

const deletedIds = fileIds.filter(id => !notFoundIds.includes(id));

return { 
  message: `${fieldType} files deleted successfully`, 
  deletedIds,
  notFoundIds 
};
}

async moveFileToFolder({ patientId, admissionId, fileId, folderId, fileType }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  const folder = await FOLDER_MODEL.findById(folderId);
  if (!folder) throw new Error("Folder not found");

  const fieldMap = {
    videoRecordings: "videoRecordings",
    audioRecordings: "audioRecordings",
    labReports: "labReports",
    radiologyReports: "radiologyReports",
    docs: "docs",
  };

  const patientField = fieldMap[fileType];
  if (!patientField) throw new Error("Invalid file type");

  const filesArray = admission[patientField];
  if (!Array.isArray(filesArray)) {
    throw new Error(`Field '${patientField}' not found in admission details`);
  }

  const fileIndex = filesArray.findIndex((f) => f._id.toString() === fileId);
  if (fileIndex === -1) throw new Error("File not found in patient records");

  const [file] = filesArray.splice(fileIndex, 1);

  const movedFile = {
    fileId: file._id,
    name: file.name,
    path: file.path,
    uploadedAt: file.uploadedAt || new Date(),
  };

  folder.files.push(movedFile);

  await patient.save();
  await folder.save();

  return movedFile;
}


// async sendReportOnWhatsApp({ patientId, admissionId, reportType, target }) {
//     const patient = await PATIENT_MODEL.findById(patientId)
//       .populate("admissionDetails.consultingDoctorId", "doctorName contactNo")
//       .select("identityDetails patientName admissionDetails");

//     if (!patient) throw new Error("Patient not found");

//     const admission = patient.admissionDetails.find(
//       (a) => a._id.toString() === admissionId
//     );
//     if (!admission) throw new Error("Admission not found for patient");

//     // Report select (docs, labReports, radiologyReports)
//     let reports = [];
//     if (reportType === "docs") reports = admission.docs;
//     else if (reportType === "labReports") reports = admission.labReports;
//     else if (reportType === "radiologyReports") reports = admission.radiologyReports;

//     if (!reports || reports.length === 0) {
//       throw new Error(`No ${reportType} found for this admission`);
//     }

//     // Decide recipient
//     let recipientNumber;
//     if (target === "doctor") {
//       recipientNumber = admission.consultingDoctorId?.contactNo;
//     } else if (target === "patient") {
//       recipientNumber = patient.identityDetails.whatsappNo || patient.identityDetails.contactNo;
//     }

//     if (!recipientNumber) throw new Error("Recipient number not available");

//     // WhatsApp Cloud API call
//     const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
//     const token = process.env.WHATSAPP_ACCESS_TOKEN;

//     for (const report of reports) {
//       await axios.post(
//         url,
//         {
//           messaging_product: "whatsapp",
//           to: recipientNumber,
//           type: "document",
//           document: {
//             link: report.path, // report ka URL (ImageKit ka URL already hai)
//             filename: report.name,
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     return { success: true, message: `Reports sent to ${target} successfully` };
//   }
  
// twilio
//   async sendReportOnWhatsApp({ patientId, admissionId, reportType, target }) {
//     const client = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );

//   // Fetch patient & admission
//   const patient = await PATIENT_MODEL.findById(patientId)
//     .populate("admissionDetails.consultingDoctorId", "doctorName contactNo")
//     .select("identityDetails patientName admissionDetails");

//   if (!patient) throw new Error("Patient not found");

//   const admission = patient.admissionDetails.find(
//     (a) => a._id.toString() === admissionId
//   );
//   if (!admission) throw new Error("Admission not found for patient");

//   // Pick reports
//   let reports = [];
//   if (reportType === "docs") reports = admission.docs;
//   else if (reportType === "labReports") reports = admission.labReports;
//   else if (reportType === "radiologyReports") reports = admission.radiologyReports;

//   if (!reports || reports.length === 0) {
//     throw new Error(`No ${reportType} found for this admission`);
//   }

//   // Recipient number
//   let recipientNumber;
//   if (target === "doctor") {
//     recipientNumber = admission.consultingDoctorId?.contactNo;
//   } else if (target === "patient") {
//     recipientNumber =
//       patient.identityDetails.whatsappNo || patient.identityDetails.contactNo;
//   }

//   if (!recipientNumber) throw new Error("Recipient number not available");

//   // Format recipient in Twilio WhatsApp format
//   recipientNumber = `whatsapp:+${recipientNumber.toString().replace(/\D/g, "")}`;

//   // Send each report
//   for (const report of reports) {
//     if (!report.path.startsWith("https://")) {
//       console.warn(`⚠️ Report URL must be public HTTPS: ${report.path}`);
//       continue; // skip invalid URL
//     }

//     try {
//       const message = await client.messages.create({
//         from: process.env.TWILIO_WHATSAPP_NUMBER, // e.g., whatsapp:+14155238886
//         to: 'whatsapp:+919834747298',
//         body: `Hello, here is your ${reportType} report for patient ${patient.identityDetails.patientName}.`,
//         mediaUrl: [report.path], // PDF/image must be public HTTPS
//       });

//       console.log(`✅ Twilio WhatsApp sent (SID: ${message.sid}) to ${recipientNumber}`);
//     } catch (err) {
//       console.error("❌ Twilio API error:", err.message);
//       throw new Error(`Twilio WhatsApp failed: ${err.message}`);
//     }
//   }

//   return {
//     success: true,
//     message: `Reports sent to ${target} via Twilio WhatsApp successfully`,
//   };
// }
// async sendReportOnWhatsApp({ patientId, admissionId, reportType, target }) {
//   const client = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );

//   const patient = await PATIENT_MODEL.findById(patientId)
//     .populate("admissionDetails.consultingDoctorId", "doctorName contactNo")
//     .select("identityDetails patientName admissionDetails");

//   if (!patient) throw new Error("Patient not found");

//   const admission = patient.admissionDetails.find(
//     (a) => a._id.toString() === admissionId
//   );
//   if (!admission) throw new Error("Admission not found for patient");

//   let reports = [];
//   if (reportType === "docs") reports = admission.docs;
//   else if (reportType === "labReports") reports = admission.labReports;
//   else if (reportType === "radiologyReports") reports = admission.radiologyReports;

//   if (!reports.length) throw new Error(`No ${reportType} found for this admission`);

//   // Dynamic recipient
//   let recipientNumber;
//   if (target === "doctor") recipientNumber = admission.consultingDoctorId?.contactNo;
//   else if (target === "patient") recipientNumber = patient.identityDetails.whatsappNo || patient.identityDetails.contactNo;

//   if (!recipientNumber) throw new Error("Recipient number not available");

//   recipientNumber = `whatsapp:+${recipientNumber.toString().replace(/\D/g, "")}`;

//   // Send reports
//   for (const report of reports) {
//     if (!report.path.startsWith("https://")) {
//       console.warn(`⚠️ Report URL must be public HTTPS: ${report.path}`);
//       continue;
//     }

//     try {
//       const message = await client.messages.create({
//         from: process.env.TWILIO_WHATSAPP_NUMBER, // sandbox number
//         to: 'whatsapp:+919834747298',
//         body: `Hello, here is your ${reportType} report for patient ${patient.identityDetails.patientName}.`,
//         mediaUrl: [report.path],
//       });

//       console.log(`✅ Twilio WhatsApp sent (SID: ${message.sid}) to ${recipientNumber}`);
//     } catch (err) {
//       console.error("❌ Twilio API error:", err.message);
//       throw new Error(`Twilio WhatsApp failed: ${err.message}`);
//     }
//   }

//   return {
//     success: true,
//     message: `Reports sent to ${target} via Twilio WhatsApp successfully`,
//   };
// }

async sendReportOnWhatsApp({ patientId, admissionId, reportType, target }) {
  const patient = await PATIENT_MODEL.findById(patientId)
    .populate("admissionDetails.consultingDoctorId", "doctorName contactNo")
    .select("identityDetails patientName admissionDetails");

  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.find(
    (a) => a._id.toString() === admissionId
  );
  if (!admission) throw new Error("Admission not found for patient");

  // Pick reports
  let reports = [];
  if (reportType === "docs") reports = admission.docs;
  else if (reportType === "labReports") reports = admission.labReports;
  else if (reportType === "radiologyReports") reports = admission.radiologyReports;

  if (!reports || reports.length === 0) {
    throw new Error(`No ${reportType} found for this admission`);
  }

  // Decide recipient
  let recipientNumber;
  if (target === "doctor") {
    recipientNumber = admission.consultingDoctorId?.contactNo;
  } else if (target === "patient") {
    recipientNumber =
      patient.identityDetails.whatsappNo || patient.identityDetails.contactNo;
  }

  if (!recipientNumber) throw new Error("Recipient number not available");

  // ✅ Convert to international format (without +, only digits)
  recipientNumber = recipientNumber.toString().replace(/\D/g, "");

  // WhatsApp Cloud API call
  const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  try {
    for (const report of reports) {
      const res = await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          to: recipientNumber, // ✅ must be international format e.g., 919876543210
          type: "document",
          document: {
            link: report.path, // ✅ must be public HTTPS
            filename: report.name || "report.pdf",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ WhatsApp API response:", res.data);
    }

    return { success: true, message: `Reports sent to ${target} successfully` };
  } catch (err) {
    console.error("❌ WhatsApp API error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.error?.message || err.message,
    };
  }
}

}

export default new Files_recordingsService();
