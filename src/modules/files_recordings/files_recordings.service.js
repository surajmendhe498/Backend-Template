// import { FILERECORDING_MODEL } from './files_recordings.model.js';
// import { PATIENT_MODEL } from '../patient/patient.model.js';

// class Files_recordingsService {

// async uploadFiles({ patientId, admissionId, files, labels }) {
//     const patientExists = await PATIENT_MODEL.findById(patientId);
//     if (!patientExists) {
//       throw new Error("Invalid Patient ID: Patient not found");
//     }

//     const admissionExists = patientExists.admissionDetails.find(
//       admission => admission._id.toString() === admissionId
//     );
//     if (!admissionExists) {
//       throw new Error("Invalid Admission ID: Admission not found for the given patient.");
//     }

//     // assign same label for all audio/video files
//     const data = {
//       patientId,
//       admissionId,
//       docs: files.docs?.map(f => ({ name: f.originalname, path: f.path })) || [],
//       labReports: files.labReports?.map(f => ({ name: f.originalname, path: f.path })) || [],
//       audioRecordings: files.audioRecordings?.map(f => ({
//         name: f.originalname,
//         path: f.path,
//         label: labels?.audioLabel || null
//       })) || [],
//       videoRecordings: files.videoRecordings?.map(f => ({
//         name: f.originalname,
//         path: f.path,
//         label: labels?.videoLabel || null
//       })) || []
//     };

//     const newRecord = await FILERECORDING_MODEL.create(data);

//     await PATIENT_MODEL.updateOne(
//       { _id: patientId, "admissionDetails._id": admissionId },
//       {
//         $push: {
//           "admissionDetails.$.docs": { $each: data.docs },
//           "admissionDetails.$.labReports": { $each: data.labReports },
//           "admissionDetails.$.audioRecordings": { $each: data.audioRecordings },
//           "admissionDetails.$.videoRecordings": { $each: data.videoRecordings }
//         }
//       }
//     );

//     return newRecord;
//   }


//   async getAll() {
//     return await FILERECORDING_MODEL.find().populate('patientId');
//   }


// async getByPatientId(patientId, admissionId = null) {
//   const patient = await PATIENT_MODEL.findById(patientId)
//     .select(
//       'identityDetails.patientName admissionDetails._id admissionDetails.docs admissionDetails.labReports admissionDetails.audioRecordings admissionDetails.videoRecordings'
//     );

//   if (!patient) return [];

//   if (admissionId) {
//     const admission = patient.admissionDetails.find(
//       a => a._id.toString() === admissionId
//     );
//     if (!admission) return [];

//     return {
//       admissionId: admission._id,
//       docs: admission.docs,
//       labReports: admission.labReports,
//       audioRecordings: admission.audioRecordings,
//       videoRecordings: admission.videoRecordings,
//       patientName: patient.identityDetails?.patientName
//     };
//   }

//   return patient.admissionDetails.map(admission => ({
//     admissionId: admission._id,
//     docs: admission.docs,
//     labReports: admission.labReports,
//     audioRecordings: admission.audioRecordings,
//     videoRecordings: admission.videoRecordings,
//     patientName: patient.identityDetails?.patientName
//   }));
// }

// async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, label }) {
//   if (!file) throw new Error(`No file uploaded in ${fieldType} field`);

//   const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
//   if (!validFields.includes(fieldType)) {
//     throw new Error(`Invalid fieldType. Must be one of: ${validFields.join(', ')}`);
//   }

//   const admission = await PATIENT_MODEL.findOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     { "admissionDetails.$": 1 }
//   );

//   if (!admission) throw new Error("Admission not found");

//   const fieldArray = admission.admissionDetails[0][fieldType];
//   const fileExists = fieldArray.some(f => f._id.toString() === fileId);

//   if (!fileExists) {
//     throw new Error(`No file with id ${fileId} found in ${fieldType}`);
//   }

//   const updateData = {
//     [`admissionDetails.$.${fieldType}.$[elem].name`]: file.originalname,
//     [`admissionDetails.$.${fieldType}.$[elem].path`]: file.path
//   };

//   // Only update label if it's audio/video and label is passed
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
//     updateData[`admissionDetails.$.${fieldType}.$[elem].label`] = label;
//   }

//   await PATIENT_MODEL.updateOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     { $set: updateData },
//     { arrayFilters: [{ "elem._id": fileId }] }
//   );

//   const updatedFile = { name: file.originalname, path: file.path };
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
//     updatedFile.label = label;
//   }

//   return {
//     message: `${fieldType} file updated successfully`,
//     updatedFile
//   };
// }

// async deleteSingleFile({ patientId, admissionId, fileId, fieldType }) {
//   const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
//   if (!validFields.includes(fieldType)) {
//     throw new Error(`Invalid fieldType. Must be one of: ${validFields.join(', ')}`);
//   }

//   const admission = await PATIENT_MODEL.findOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     { "admissionDetails.$": 1 }
//   );

//   if (!admission) throw new Error("Admission not found");

//   const fieldArray = admission.admissionDetails[0][fieldType];
//   const fileExists = fieldArray.some(f => f._id.toString() === fileId);

//   if (!fileExists) {
//     throw new Error(`No file with id ${fileId} found in ${fieldType}`);
//   }

//   await PATIENT_MODEL.updateOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     { $pull: { [`admissionDetails.$.${fieldType}`]: { _id: fileId } } }
//   );

//   return { message: `${fieldType} file deleted successfully`, fileId };
// }
  

// }

// export default new Files_recordingsService();




import { FILERECORDING_MODEL } from './files_recordings.model.js';
import { PATIENT_MODEL } from '../patient/patient.model.js';

function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

class Files_recordingsService {

async uploadFiles({ patientId, admissionId, files, labels, user }) {
    const patientExists = await PATIENT_MODEL.findById(patientId);
    if (!patientExists) {
      throw new Error("Invalid Patient ID: Patient not found");
    }

    const admissionExists = patientExists.admissionDetails.find(
      admission => admission._id.toString() === admissionId
    );
    if (!admissionExists) {
      throw new Error("Invalid Admission ID: Admission not found for the given patient.");
    }

    const uploadedBy = user?.firstName || user?.username || "Unknown User";
    const uploadedAt = new Date();

    // assign same label for all audio/video files
    const data = {
      patientId,
      admissionId,
      docs: files.docs?.map(f => ({ name: f.originalname, path: f.path, uploadedBy, uploadedAt })) || [],
      labReports: files.labReports?.map(f => ({ name: f.originalname, path: f.path, uploadedBy, uploadedAt })) || [],
      audioRecordings: files.audioRecordings?.map(f => ({
        name: f.originalname,
        path: f.path,
        label: labels?.audioLabel || null,
        uploadedBy, uploadedAt
      })) || [],
      videoRecordings: files.videoRecordings?.map(f => ({
        name: f.originalname,
        path: f.path,
        label: labels?.videoLabel || null,
        uploadedBy, uploadedAt
      })) || []
    };

    const newRecord = await FILERECORDING_MODEL.create(data);

    await PATIENT_MODEL.updateOne(
      { _id: patientId, "admissionDetails._id": admissionId },
      {
        $push: {
          "admissionDetails.$.docs": { $each: data.docs },
          "admissionDetails.$.labReports": { $each: data.labReports },
          "admissionDetails.$.audioRecordings": { $each: data.audioRecordings },
          "admissionDetails.$.videoRecordings": { $each: data.videoRecordings }
        }
      }
    );
     // 🔥 Format uploadedAt before sending back
    const formattedRecord = newRecord.toObject();
    formattedRecord.docs = formattedRecord.docs.map(doc => ({
      ...doc,
      uploadedAt: formatDate(doc.uploadedAt)
    }));
    formattedRecord.labReports = formattedRecord.labReports.map(report => ({
      ...report,
      uploadedAt: formatDate(report.uploadedAt)
    }));
    formattedRecord.audioRecordings = formattedRecord.audioRecordings.map(audio => ({
      ...audio,
      uploadedAt: formatDate(audio.uploadedAt)
    }));
    formattedRecord.videoRecordings = formattedRecord.videoRecordings.map(video => ({
      ...video,
      uploadedAt: formatDate(video.uploadedAt)
    }));

    return formattedRecord;
  }


  async getAll() {
    return await FILERECORDING_MODEL.find().populate('patientId');
  }


async getByPatientId(patientId, admissionId = null) {
  const patient = await PATIENT_MODEL.findById(patientId)
    .select(
      'identityDetails.patientName admissionDetails._id admissionDetails.docs admissionDetails.labReports admissionDetails.audioRecordings admissionDetails.videoRecordings'
    );

  if (!patient) return [];

  if (admissionId) {
    const admission = patient.admissionDetails.find(
      a => a._id.toString() === admissionId
    );
    if (!admission) return [];

    return {
      admissionId: admission._id,
      docs: admission.docs,
      labReports: admission.labReports,
      audioRecordings: admission.audioRecordings,
      videoRecordings: admission.videoRecordings,
      patientName: patient.identityDetails?.patientName
    };
  }

  return patient.admissionDetails.map(admission => ({
    admissionId: admission._id,
    docs: admission.docs,
    labReports: admission.labReports,
    audioRecordings: admission.audioRecordings,
    videoRecordings: admission.videoRecordings,
    patientName: patient.identityDetails?.patientName
  }));
}

// async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, label }) {
//   if (!file) throw new Error(`No file uploaded in ${fieldType} field`);

//   const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
//   if (!validFields.includes(fieldType)) {
//     throw new Error(`Invalid fieldType. Must be one of: ${validFields.join(', ')}`);
//   }

//   const admission = await PATIENT_MODEL.findOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     { "admissionDetails.$": 1 }
//   );

//   if (!admission) throw new Error("Admission not found");

//   const fieldArray = admission.admissionDetails[0][fieldType];
//   const fileExists = fieldArray.some(f => f._id.toString() === fileId);

//   if (!fileExists) {
//     throw new Error(`No file with id ${fileId} found in ${fieldType}`);
//   }

//   const updateData = {
//     [`admissionDetails.$.${fieldType}.$[elem].name`]: file.originalname,
//     [`admissionDetails.$.${fieldType}.$[elem].path`]: file.path
//   };

//   // Only update label if it's audio/video and label is passed
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
//     updateData[`admissionDetails.$.${fieldType}.$[elem].label`] = label;
//   }

//   await PATIENT_MODEL.updateOne(
//     { _id: patientId, "admissionDetails._id": admissionId },
//     { $set: updateData },
//     { arrayFilters: [{ "elem._id": fileId }] }
//   );

//   const updatedFile = { name: file.originalname, path: file.path };
//   if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
//     updatedFile.label = label;
//   }

//   return {
//     message: `${fieldType} file updated successfully`,
//     updatedFile
//   };
// }
async updateSingleFile({ patientId, admissionId, fileId, file, fieldType, label, user }) {
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

  const updateData = {};

  // if file updated, set new name, path, user, and time
if (file) {
  updateData[`admissionDetails.$.${fieldType}.$[elem].name`] = file.originalname;
  updateData[`admissionDetails.$.${fieldType}.$[elem].path`] = file.path;
  
  // ✅ har file update ke time set karo
  updateData[`admissionDetails.$.${fieldType}.$[elem].uploadedBy`] = user?.firstName || user?.username || "Unknown User";
  updateData[`admissionDetails.$.${fieldType}.$[elem].uploadedAt`] = new Date();
}

  // update label if audio/video
  if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
    updateData[`admissionDetails.$.${fieldType}.$[elem].label`] = label;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Nothing to update. Provide file or label.");
  }

  await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { $set: updateData },
    { arrayFilters: [{ "elem._id": fileId }] }
  );

  const updatedFile = {};
  if (file) {
    updatedFile.name = file.originalname;
    updatedFile.path = file.path;
    updatedFile.uploadedBy = user?.firstName || user?.username || "Unknown User";
    updatedFile.uploadedAt = new Date();
  }
  if (['audioRecordings', 'videoRecordings'].includes(fieldType) && label !== undefined) {
    updatedFile.label = label;
  }

  return {
    message: `${fieldType} file updated successfully`,
    updatedFile
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
  

}

export default new Files_recordingsService();
