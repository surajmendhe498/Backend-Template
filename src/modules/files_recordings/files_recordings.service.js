import { FILERECORDING_MODEL } from './files_recordings.model.js';
import { PATIENT_MODEL } from '../patient/patient.model.js';
import cloudinary from '../../helpers/cloudinary.js';
import imagekit from '../../helpers/imagekit.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from 'ffprobe-static';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

class Files_recordingsService {

// async uploadFiles({ patientId, admissionId, files, labels, user, notes }) {

//   const patientExists = await PATIENT_MODEL.findById(patientId);
//   if (!patientExists) throw new Error("Invalid Patient ID: Patient not found");

//   const admissionExists = patientExists.admissionDetails.find(
//     a => a._id.toString() === admissionId
//   );
//   if (!admissionExists) throw new Error("Invalid Admission ID: Admission not found for the given patient.");

//   const uploadedBy = user?.firstName || user?.username || "Unknown User";
//   const uploadedAt = new Date();

//   // Function to get duration in seconds
//   const getDuration = (filePath) => {
//     return new Promise((resolve) => {
//       const fullPath = path.resolve(filePath);
//       if (!fs.existsSync(fullPath)) return resolve(null);

//       ffmpeg.ffprobe(fullPath, (err, metadata) => {
//         if (err) {
//           console.log("ffprobe error:", err.message, "for file:", fullPath);
//           return resolve(null);
//         }
//         const durationInSeconds = metadata?.format?.duration
//           ? Math.round(metadata.format.duration)
//           : null;
//         resolve(durationInSeconds);
//       });
//     });
//   };

//   // Upload file to ImageKit
//   const uploadToImageKit = async (file) => {
//     const fileBuffer = fs.readFileSync(file.path);
//     const uploadResult = await imagekit.upload({
//       file: fileBuffer,
//       fileName: file.originalname,
//       folder: `/${file.fieldname}`
//     });
//     return uploadResult.url;
//   };

//   // Map generic files (docs, labReports, radiologyReports)
//   const mapFiles = async (fileArray) => {
//     return Promise.all((fileArray || []).map(async f => ({
//       name: f.originalname,
//       path: await uploadToImageKit(f),
//       uploadedBy,
//       uploadedAt
//     })));
//   };

//   const docs = await mapFiles((files && files.docs) || []);
//   const labReports = await mapFiles((files && files.labReports) || []);
//   const radiologyReports = await mapFiles((files && files.radiologyReports) || []);

//   // Map audio/video files with duration
//   const mapMediaFiles = async (fileArray, labelKey) => {
//     return Promise.all((fileArray || []).map(async f => {
//       const duration = await getDuration(f.path);
//       const url = await uploadToImageKit(f);

//       return {
//         name: f.originalname,
//         path: url,
//         label: labels?.[labelKey] || null,
//         uploadedBy,
//         uploadedAt,
//         duration
//       };
//     }));
//   };

//   const audioRecordings = await mapMediaFiles((files && files.audioRecordings) || [], 'audioLabel');
//   const videoRecordings = await mapMediaFiles((files && files.videoRecordings) || [], 'videoLabel');

//   // Prepare notes
//   const data = {
//     patientId,
//     admissionId,
//     docs,
//     labReports,
//     radiologyReports,
//     audioRecordings,
//     videoRecordings,
//     clinicalNotes: notes?.clinicalNotes
//       ? [{ note: notes.clinicalNotes, addedBy: uploadedBy, addedAt: uploadedAt }]
//       : [],
//     nursingNotes: notes?.nursingNotes
//       ? [{ note: notes.nursingNotes, addedBy: uploadedBy, addedAt: uploadedAt }]
//       : [],
//     surgicalNotes: notes?.surgicalNotes
//       ? [{ note: notes.surgicalNotes, addedBy: uploadedBy, addedAt: uploadedAt }]
//       : [],
//     symptoms: notes?.symptoms
//       ? [{ note: notes.symptoms, addedBy: uploadedBy, addedAt: uploadedAt }]
//       : [],
//     pastHistory: notes?.pastHistory
//       ? [{ note: notes.pastHistory, addedBy: uploadedBy, addedAt: uploadedAt }]
//       : [],
//     vitalData: notes?.vitalData
//       ? [{ note: notes.vitalData, addedBy: uploadedBy, addedAt: uploadedAt }]
//       : []
//   };

//   // Create record in filesRecording collection
//   const newRecord = await FILERECORDING_MODEL.create(data);

//   // Update patient admissionDetails
//   await PATIENT_MODEL.updateOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     {
//       $push: {
//         "admissionDetails.$.docs": { $each: docs },
//         "admissionDetails.$.labReports": { $each: labReports },
//         "admissionDetails.$.radiologyReports": { $each: radiologyReports },
//         "admissionDetails.$.audioRecordings": { $each: audioRecordings },
//         "admissionDetails.$.videoRecordings": { $each: videoRecordings },
//         "admissionDetails.$.clinicalNotes": { $each: data.clinicalNotes },
//         "admissionDetails.$.nursingNotes": { $each: data.nursingNotes },
//         "admissionDetails.$.surgicalNotes": { $each: data.surgicalNotes },
//         "admissionDetails.$.symptoms": { $each: data.symptoms },
//         "admissionDetails.$.pastHistory": { $each: data.pastHistory },
//         "admissionDetails.$.vitalData": { $each: data.vitalData }
//       }
//     }
//   );

//   // Cleanup temporary local files
//   if (files) {
//     Object.values(files).flat().forEach(f => {
//       if (f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
//     });
//   }

//   return newRecord;
// }

async uploadFiles({ patientId, admissionId, files, labels, user }) {
  const patientExists = await PATIENT_MODEL.findById(patientId);
  if (!patientExists) throw new Error("Invalid Patient ID: Patient not found");

  const admissionExists = patientExists.admissionDetails.find(
    a => a._id.toString() === admissionId
  );
  if (!admissionExists) throw new Error("Invalid Admission ID: Admission not found for the given patient.");

  const uploadedBy = user?.firstName || user?.username || "Unknown User";
  const uploadedAt = new Date();

  // Function to get duration in seconds
  const getDuration = (filePath) => {
    return new Promise((resolve) => {
      const fullPath = path.resolve(filePath);
      if (!fs.existsSync(fullPath)) return resolve(null);

      ffmpeg.ffprobe(fullPath, (err, metadata) => {
        if (err) {
          console.log("ffprobe error:", err.message, "for file:", fullPath);
          return resolve(null);
        }
        const durationInSeconds = metadata?.format?.duration
          ? Math.round(metadata.format.duration)
          : null;
        resolve(durationInSeconds);
      });
    });
  };

  // Upload file to ImageKit
  const uploadToImageKit = async (file) => {
    const fileBuffer = fs.readFileSync(file.path);
    const uploadResult = await imagekit.upload({
      file: fileBuffer,
      fileName: file.originalname,
      folder: `/${file.fieldname}`
    });
    return uploadResult.url;
  };

  // Map generic files (docs, labReports, radiologyReports)
  const mapFiles = async (fileArray) => {
    return Promise.all((fileArray || []).map(async f => ({
      name: f.originalname,
      path: await uploadToImageKit(f),
      uploadedBy,
      uploadedAt
    })));
  };

  const docs = await mapFiles((files && files.docs) || []);
  const labReports = await mapFiles((files && files.labReports) || []);
  const radiologyReports = await mapFiles((files && files.radiologyReports) || []);

  // Map audio/video files with duration
  const mapMediaFiles = async (fileArray, labelKey) => {
    return Promise.all((fileArray || []).map(async f => {
      const duration = await getDuration(f.path);
      const url = await uploadToImageKit(f);

      return {
        name: f.originalname,
        path: url,
        label: labels?.[labelKey] || null,
        uploadedBy,
        uploadedAt,
        duration
      };
    }));
  };

  const audioRecordings = await mapMediaFiles((files && files.audioRecordings) || [], 'audioLabel');
  const videoRecordings = await mapMediaFiles((files && files.videoRecordings) || [], 'videoLabel');

  // Prepare only file-related data
  const data = {
    patientId,
    admissionId,
    docs,
    labReports,
    radiologyReports,
    audioRecordings,
    videoRecordings
  };

  // Create record in filesRecording collection
  const newRecord = await FILERECORDING_MODEL.create(data);

  // Update patient admissionDetails (only file-related fields)
  await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    {
      $push: {
        "admissionDetails.$.docs": { $each: docs },
        "admissionDetails.$.labReports": { $each: labReports },
        "admissionDetails.$.radiologyReports": { $each: radiologyReports },
        "admissionDetails.$.audioRecordings": { $each: audioRecordings },
        "admissionDetails.$.videoRecordings": { $each: videoRecordings }
      }
    }
  );

  // Cleanup temporary local files
  if (files) {
    Object.values(files).flat().forEach(f => {
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
      .select('identityDetails.patientName admissionDetails._id admissionDetails.docs admissionDetails.labReports admissionDetails.radiologyReports admissionDetails.audioRecordings admissionDetails.videoRecordings');

    if (!patient) return [];

    if (admissionId) {
      const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
      if (!admission) return [];

      return {
        admissionId: admission._id,
        docs: admission.docs,
        labReports: admission.labReports,
        radiologyReports: admission.radiologyReports,
        audioRecordings: admission.audioRecordings,
        videoRecordings: admission.videoRecordings,
        patientName: patient.identityDetails?.patientName
      };
    }

    return patient.admissionDetails.map(admission => ({
      admissionId: admission._id,
      docs: admission.docs,
      labReports: admission.labReports,
      radiologyReports: admission.radiologyReports,
      audioRecordings: admission.audioRecordings,
      videoRecordings: admission.videoRecordings,
      patientName: patient.identityDetails?.patientName
    }));
  }

// async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, label, user }) {
//   const fileFields = ['docs', 'labReports', 'radiologyReports', 'audioRecordings', 'videoRecordings'];
//   if (!fileFields.includes(fieldType)) throw new Error(`Invalid fieldType`);

//   const admission = await PATIENT_MODEL.findOne(
//     { _id: patientId, "admissionDetails._id": admissionId }
//   );

//   if (!admission) throw new Error("Admission not found");

//   const admissionDetail = admission.admissionDetails.id(admissionId);
//   const fileArray = admissionDetail[fieldType];
//   const fileObj = fileArray.id(fileId);

//   if (!fileObj) throw new Error(`No file with id ${fileId} found in ${fieldType}`);

//   const currentUser = user?.firstName || user?.username || "Unknown User";
//   const now = new Date();

//   // 🔹 Upload file if provided
//   if (file) {
//     const fileBuffer = fs.readFileSync(file.path);
//     const uploadResult = await imagekit.upload({
//       file: fileBuffer,
//       fileName: file.originalname,
//       folder: `/${fieldType}`
//     });

//     fileObj.name = file.originalname;
//     fileObj.path = uploadResult.url;

//     if (['audioRecordings', 'videoRecordings'].includes(fieldType)) {
//       const duration = await new Promise(resolve => {
//         ffmpeg.ffprobe(file.path, (err, metadata) => {
//           if (err) return resolve(null);
//           resolve(metadata?.format?.duration ? Math.round(metadata.format.duration) : null);
//         });
//       });
//       fileObj.duration = duration;
//     }

//     // Update uploadedBy only when a new file is uploaded
//     fileObj.uploadedBy = currentUser;

//     if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
//   }

//   // 🔹 Update label only for audio/video
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
//     fileObj.label = label;
//   }

//   // 🔹 Always update updatedAt
//   fileObj.updatedAt = now;

//   // 🔹 Save the document
//   await admission.save();

//   // 🔹 Prepare response
//   const response = {
//     name: fileObj.name,
//     path: fileObj.path,
//     uploadedBy: fileObj.uploadedBy,
//     updatedAt: fileObj.updatedAt
//   };

//   // Include label and duration only for audio/video
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType)) {
//     response.label = fileObj.label;
//     response.duration = fileObj.duration;
//   }

//   return {
//     message: `${fieldType} updated successfully`,
//     updatedFile: response
//   };
// }

// async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, label, fileName, user }) { 
//   const fileFields = ['docs', 'labReports', 'radiologyReports', 'audioRecordings', 'videoRecordings'];
//   if (!fileFields.includes(fieldType)) throw new Error(`Invalid fieldType`);

//   const admission = await PATIENT_MODEL.findOne(
//     { _id: patientId, "admissionDetails._id": admissionId }
//   );

//   if (!admission) throw new Error("Admission not found");

//   const admissionDetail = admission.admissionDetails.id(admissionId);
//   const fileArray = admissionDetail[fieldType];
//   const fileObj = fileArray.id(fileId);

//   if (!fileObj) throw new Error(`No file with id ${fileId} found in ${fieldType}`);

//   const currentUser = user?.firstName || user?.username || "Unknown User";
//   const now = new Date();

//   // 1️⃣ Upload new file if provided
//   if (file) {
//     const fileBuffer = fs.readFileSync(file.path);
//     const uploadResult = await imagekit.upload({
//       file: fileBuffer,
//       fileName: file.originalname,
//       folder: `/${fieldType}`
//     });

//     fileObj.name = file.originalname;
//     fileObj.path = uploadResult.url;

//     if (['audioRecordings', 'videoRecordings'].includes(fieldType)) {
//       const duration = await new Promise(resolve => {
//         ffmpeg.ffprobe(file.path, (err, metadata) => {
//           if (err) return resolve(null);
//           resolve(metadata?.format?.duration ? Math.round(metadata.format.duration) : null);
//         });
//       });
//       fileObj.duration = duration;
//     }

//     fileObj.uploadedBy = currentUser;

//     if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
//   }

//   // 2️⃣ Update label (only for audio/video)
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
//     fileObj.label = label;
//   }

//   // 3️⃣ Update file name (for all types)
//   if (fileName && !file) {
//     fileObj.name = fileName;
//   }

//   // Always update updatedAt
//   fileObj.updatedAt = now;

//   await admission.save();

//   const response = {
//     name: fileObj.name,
//     path: fileObj.path,
//     uploadedBy: fileObj.uploadedBy,
//     updatedAt: fileObj.updatedAt
//   };

//   if (['audioRecordings', 'videoRecordings'].includes(fieldType)) {
//     response.label = fileObj.label;
//     response.duration = fileObj.duration;
//   }

//   return {
//     message: `${fieldType} updated successfully`,
//     updatedFile: response
//   };
// }

async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, label, fileName, user }) {
  const fileFields = ['docs', 'labReports', 'radiologyReports', 'audioRecordings', 'videoRecordings'];
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

  // 1️⃣ Upload new file if provided
  if (file) {
    const fileBuffer = fs.readFileSync(file.path);
    const uploadResult = await imagekit.upload({
      file: fileBuffer,
      fileName: file.originalname,
      folder: `/${fieldType}`
    });

    fileObj.path = uploadResult.url;

    // File name priority: passed fileName > uploaded file originalname
    fileObj.name = fileName || file.originalname;

    if (['audioRecordings', 'videoRecordings'].includes(fieldType)) {
      const duration = await new Promise(resolve => {
        ffmpeg.ffprobe(file.path, (err, metadata) => {
          if (err) return resolve(null);
          resolve(metadata?.format?.duration ? Math.round(metadata.format.duration) : null);
        });
      });
      fileObj.duration = duration;
    }

    fileObj.uploadedBy = currentUser;

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }

  // 2️⃣ Update label (only for audio/video)
  if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
    fileObj.label = label;
  }

  // 3️⃣ Update file name (when only fileName passed, no file)
  if (!file && fileName) {
    fileObj.name = fileName;
  }

  // Always update updatedAt
  fileObj.updatedAt = now;

  await admission.save();

  const response = {
    name: fileObj.name,
    path: fileObj.path,
    uploadedBy: fileObj.uploadedBy,
    updatedAt: fileObj.updatedAt
  };

  if (['audioRecordings', 'videoRecordings'].includes(fieldType)) {
    response.label = fileObj.label;
    response.duration = fileObj.duration;
  }

  return {
    message: `${fieldType} updated successfully`,
    updatedFile: response
  };
}



async deleteSingleFile({ patientId, admissionId, fileId, fieldType }) {
  const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
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

async getAudioRecordings(patientId, admissionId) {
  const patient = await PATIENT_MODEL.findById(patientId).select(
    'identityDetails.patientName admissionDetails._id admissionDetails.audioRecordings'
  );

  if (!patient) return [];

  const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
  if (!admission) return [];

  return {
    patientName: patient.identityDetails?.patientName,
    admissionId: admission._id,
    audioRecordings: admission.audioRecordings
  };
}

async getVideoRecordings(patientId, admissionId) {
  const patient = await PATIENT_MODEL.findById(patientId).select(
    'identityDetails.patientName admissionDetails._id admissionDetails.videoRecordings'
  );

  if (!patient) return [];

  const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
  if (!admission) return [];

  return {
    patientName: patient.identityDetails?.patientName,
    admissionId: admission._id,
    videoRecordings: admission.videoRecordings
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

async updateSpecificNote({ patientId, admissionId, field, noteId, newNote, user }) {
  const allowedFields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData'];
  if (!allowedFields.includes(field)) throw new Error("Invalid note field");

  if (!noteId) throw new Error("noteId is required to update a specific note");

  const updatedBy = user?.firstName || user?.username || "Unknown User";

  const admission = await PATIENT_MODEL.findOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { "admissionDetails.$": 1 }
  );

  if (!admission) throw new Error("Admission not found");

  const noteArray = admission.admissionDetails[0][field];
  const noteIndex = noteArray.findIndex(n => n._id.toString() === noteId);

  if (noteIndex === -1) {
    throw new Error(`No note with _id ${noteId} found in field ${field}`);
  }

  const updateObj = {};
  updateObj[`admissionDetails.$.${field}.${noteIndex}.note`] = newNote;
  updateObj[`admissionDetails.$.${field}.${noteIndex}.addedBy`] = updatedBy;
  updateObj[`admissionDetails.$.${field}.${noteIndex}.addedAt`] = new Date();

  await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { $set: updateObj }
  );

  const updatedNote = {
    _id: noteId,
    note: newNote,
    addedBy: updatedBy,
    addedAt: new Date()
  };

  return { message: `Note updated successfully in ${field}`, updatedNote };
}

}

export default new Files_recordingsService();
