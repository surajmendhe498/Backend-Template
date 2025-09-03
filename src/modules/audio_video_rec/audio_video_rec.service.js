// import { AUDIOVIDEOREC_MODEL } from './audio_video_rec.model.js';
// import { PATIENT_MODEL } from '../patient/patient.model.js';
// import cloudinary from '../../helpers/cloudinary.js';
// import ffmpeg from 'fluent-ffmpeg';
// import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
// import ffprobeInstaller from 'ffprobe-static';
// import fs from 'fs';
// import path from 'path';

// ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// ffmpeg.setFfprobePath(ffprobeInstaller.path);

// class Audio_video_recService {

//   async uploadFiles({ patientId, admissionId, files, labels, user }) {
//     const patientExists = await PATIENT_MODEL.findById(patientId);
//     if (!patientExists) throw new Error("Invalid Patient ID: Patient not found");

//     const admissionExists = patientExists.admissionDetails.find(
//       admission => admission._id.toString() === admissionId
//     );
//     if (!admissionExists) throw new Error("Invalid Admission ID: Admission not found for the given patient.");

//     const uploadedBy = user?.firstName || user?.username || "Unknown User";
//     const uploadedAt = new Date();

//     const getDuration = (filePath) => new Promise(resolve => {
//       ffmpeg.ffprobe(filePath, (err, metadata) => {
//         if (err) return resolve(null);
//         resolve(metadata?.format?.duration ? Math.round(metadata.format.duration) : null);
//       });
//     });

//     const audioRecordings = await Promise.all(
//       (files.audioRecordings || []).map(async f => {
//         const uploadResult = await cloudinary.uploader.upload(f.path, {
//           resource_type: 'video', // Cloudinary treats audio as video
//           folder: 'audio-recordings'
//         });

//         const duration = await getDuration(f.path);

//         if (fs.existsSync(f.path)) fs.unlinkSync(f.path);

//         return {
//           name: f.originalname,
//           path: uploadResult.secure_url,
//           label: labels?.audioLabel || null,
//           uploadedBy,
//           uploadedAt,
//           duration
//         };
//       })
//     );

//     const videoRecordings = await Promise.all(
//       (files.videoRecordings || []).map(async f => {
//         const uploadResult = await cloudinary.uploader.upload(f.path, {
//           resource_type: 'video',
//           folder: 'video-recordings'
//         });

//         const duration = await getDuration(f.path);

//         if (fs.existsSync(f.path)) fs.unlinkSync(f.path);

//         return {
//           name: f.originalname,
//           path: uploadResult.secure_url,
//           label: labels?.videoLabel || null,
//           uploadedBy,
//           uploadedAt,
//           duration
//         };
//       })
//     );

//     const newRecord = await AUDIOVIDEOREC_MODEL.create({
//       patientId,
//       admissionId,
//       audioRecordings,
//       videoRecordings
//     });

//     await PATIENT_MODEL.updateOne(
//       { _id: patientId, "admissionDetails._id": admissionId },
//       {
//         $push: {
//           "admissionDetails.$.audioRecordings": { $each: audioRecordings },
//           "admissionDetails.$.videoRecordings": { $each: videoRecordings }
//         }
//       }
//     );

//     return newRecord;
//   }

import { AUDIOVIDEOREC_MODEL } from './audio_video_rec.model.js';
import { PATIENT_MODEL } from '../patient/patient.model.js';
import cloudinary from '../../helpers/cloudinary.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from 'ffprobe-static';
import fs from 'fs';
import path from 'path';
import { FOLDER_MODEL } from '../folders/folders.model.js';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

class Audio_video_recService {

  // Convert WebM audio to MP3
  async convertWebMtoMP3(filePath) {
    const mp3Path = filePath.replace(path.extname(filePath), '.mp3');

    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .toFormat('mp3')
        .on('error', err => reject(err))
        .on('end', () => resolve(mp3Path))
        .save(mp3Path);
    });
  }

  // Get duration of local audio file
  async getAudioDuration(filePath) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const duration = await new Promise(resolve => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) return resolve(0);
          let d = 0;
          if (metadata.format && metadata.format.duration) d = parseFloat(metadata.format.duration);
          resolve(isNaN(d) ? 0 : Math.round(d));
        });
      });
      if (duration > 0) return duration;
      await new Promise(r => setTimeout(r, 200));
    }
    return 0;
  }

  // Get duration of video
  async getVideoDuration(filePath) {
    return new Promise(resolve => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err || !metadata?.format?.duration) return resolve(0);
        const duration = parseFloat(metadata.format.duration);
        resolve(isNaN(duration) ? 0 : Math.round(duration));
      });
    });
  }

  async uploadFiles({ patientId, admissionId, files, labels, user }) {

    const patientExists = await PATIENT_MODEL.findById(patientId);
    if (!patientExists) throw new Error("Invalid Patient ID: Patient not found");

    const admissionExists = patientExists.admissionDetails.find(
      admission => admission._id.toString() === admissionId
    );
    if (!admissionExists) throw new Error("Invalid Admission ID: Admission not found for the given patient.");

    const uploadedBy = user?.firstName || user?.username || "Unknown User";
    const uploadedAt = new Date();

    // Handle audio recordings
    const audioRecordings = await Promise.all(
      (files.audioRecordings || []).map(async f => {
        let localFile = f.path;

        // Convert WebM → MP3 if needed
        if (path.extname(localFile).toLowerCase() === '.webm') {
          localFile = await this.convertWebMtoMP3(localFile);
        }

        // Get duration from local file
        const duration = await this.getAudioDuration(localFile);

        // Upload processed file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localFile, {
          resource_type: 'video',
          folder: 'audio-recordings'
        });

        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        if (localFile !== f.path && fs.existsSync(localFile)) fs.unlinkSync(localFile);

        return {
          name: f.originalname,
          path: uploadResult.secure_url,
          label: labels?.audioLabel || null,
          uploadedBy,
          uploadedAt,
          duration
        };
      })
    );

    // Handle video recordings
    const videoRecordings = await Promise.all(
      (files.videoRecordings || []).map(async f => {
        const duration = await this.getVideoDuration(f.path);

        const uploadResult = await cloudinary.uploader.upload(f.path, {
          resource_type: 'video',
          folder: 'video-recordings'
        });

        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);

        return {
          name: f.originalname,
          path: uploadResult.secure_url,
          label: labels?.videoLabel || null,
          uploadedBy,
          uploadedAt,
          duration
        };
      })
    );

    const newRecord = await AUDIOVIDEOREC_MODEL.create({
      patientId,
      admissionId,
      audioRecordings,
      videoRecordings
    });

    await PATIENT_MODEL.updateOne(
      { _id: patientId, "admissionDetails._id": admissionId },
      {
        $push: {
          "admissionDetails.$.audioRecordings": { $each: audioRecordings },
          "admissionDetails.$.videoRecordings": { $each: videoRecordings }
        }
      }
    );

    return newRecord;
  }


async getByPatientId(patientId, admissionId = null) {
  const patient = await PATIENT_MODEL.findById(patientId)
    .select('identityDetails.patientName admissionDetails._id admissionDetails.audioRecordings admissionDetails.videoRecordings');

  if (!patient) return [];

  if (admissionId) {
    const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
    if (!admission) return [];

    return {
      admissionId: admission._id,
      audioRecordings: admission.audioRecordings || [],
      videoRecordings: admission.videoRecordings || [],
      patientName: patient.identityDetails?.patientName
    };
  }

  return patient.admissionDetails.map(admission => ({
    admissionId: admission._id,
    audioRecordings: admission.audioRecordings || [],
    videoRecordings: admission.videoRecordings || [],
    patientName: patient.identityDetails?.patientName
  }));
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
      audioRecordings: admission.audioRecordings || []
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
      videoRecordings: admission.videoRecordings || []
    };
  }

async deleteRecording({ patientId, admissionId, recordingId, type }) {
  if (!['audio', 'video'].includes(type)) {
    throw new Error("Type must be either 'audio' or 'video'");
  }

  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.find(
    (a) => a._id.toString() === admissionId
  );
  if (!admission) throw new Error("Admission not found");

  const recordingsField = type === 'audio' ? 'audioRecordings' : 'videoRecordings';
  const recording = admission[recordingsField].find(
    (r) => r._id.toString() === recordingId
  );

  if (!recording) throw new Error(`${type} recording not found`);

  const parts = recording.path.split("/");
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split(".")[0];

  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

  await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { $pull: { [`admissionDetails.$.${recordingsField}`]: { _id: recordingId } } }
  );

  return {
    success: true,
    message: `${type} recording deleted successfully`,
    recordingId,
  };
}

async updateRecording({ patientId, admissionId, recordingId, type, updates, file, user }) {
  if (!['audio', 'video'].includes(type)) {
    throw new Error("Type must be either 'audio' or 'video'");
  }

  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.find(
    (a) => a._id.toString() === admissionId
  );
  if (!admission) throw new Error("Admission not found for this patient");

  let updatedRecording = null;

  // Find existing recording
  let recordingsArray = type === 'audio' ? admission.audioRecordings : admission.videoRecordings;
  const recordingIndex = recordingsArray.findIndex(r => r._id.toString() === recordingId);

  if (recordingIndex === -1) throw new Error(`${type} recording not found`);

  // Existing recording
  let existingRecording = recordingsArray[recordingIndex];

  // If new file uploaded, replace it in Cloudinary
  if (file) {
    let localFile = file.path;

    let duration = existingRecording.duration;

    if (type === 'audio') {
      // Convert WebM → MP3 before calculating duration
      if (path.extname(localFile).toLowerCase() === '.webm') {
        localFile = await this.convertWebMtoMP3(localFile);
      }

      duration = await this.getAudioDuration(localFile);
    } else {
      duration = await this.getVideoDuration(localFile);
    }

    // Upload processed file (mp3 if converted) to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFile, {
      resource_type: 'video',  // handles both audio/video
      folder: type === 'audio' ? 'audio-recordings' : 'video-recordings'
    });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    if (localFile !== file.path && fs.existsSync(localFile)) fs.unlinkSync(localFile);

    existingRecording.path = uploadResult.secure_url;
    existingRecording.name = file.originalname;   // keep original uploaded name (even if converted internally)
    existingRecording.duration = duration;
  }

  // Update fields from request
  if (updates.label !== undefined) existingRecording.label = updates.label;
  existingRecording.uploadedBy = user?.firstName || user?.username || "Unknown User";
  existingRecording.uploadedAt = new Date();

  await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId },
    { $set: { [`admissionDetails.$.${type}Recordings.${recordingIndex}`]: existingRecording } }
  );

  await AUDIOVIDEOREC_MODEL.updateOne(
    { patientId, admissionId },
    { $set: { [`${type}Recordings.${recordingIndex}`]: existingRecording } }
  );

  updatedRecording = existingRecording;
  return updatedRecording;
}

async editRecordingName({ patientId, admissionId, recordingId, type, newName, user }) {
    if (!['audio', 'video'].includes(type)) {
      throw new Error("Type must be either 'audio' or 'video'");
    }

    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) throw new Error("Patient not found");

    const admission = patient.admissionDetails.find(
      (a) => a._id.toString() === admissionId
    );
    if (!admission) throw new Error("Admission not found");

    const recordings = type === 'audio' ? admission.audioRecordings : admission.videoRecordings;
    const recording = recordings.id(recordingId);

    if (!recording) throw new Error("Recording not found");

    //  Update only name & uploadedBy (user performing rename)
    recording.name = newName;
    recording.uploadedBy = user?.firstName || "Unknown User";
    recording.uploadedAt = new Date();

    await patient.save();

    return {
      success: true,
      message: "Recording renamed successfully",
      data: recording
    };
  }

// async moveFileToFolder({ patientId, admissionId, fileId, folderId, fileType }) {

//     const patient = await PATIENT_MODEL.findById(patientId);
//     if (!patient) throw new Error('Patient not found');

//     const folder = await FOLDER_MODEL.findById(folderId);
//     if (!folder) throw new Error('Folder not found');

//     const fieldMap = {
//       videoRecordings: 'videoRecordings',
//       audioRecordings: 'audioRecordings',
//       labReports: 'labReports',
//       radiologyReports: 'radiologyReports',
//       otherDocs: 'otherDocs',
//     };

//     const patientField = fieldMap[fileType];
//     if (!patientField) throw new Error('Invalid file type');

//     // 4. Find the file in the old array
//     const admission = patient.admissionDetails.id(admissionId);
//     if (!admission) throw new Error('Admission not found');

//     const fileIndex = admission[patientField].findIndex(f => f._id.toString() === fileId);
//     if (fileIndex === -1) throw new Error('File not found in patient records');

//     const [file] = admission[patientField].splice(fileIndex, 1); // Remove from old array

//     // 5. Push file into folder's files array
//     folder.files.push({
//       fileId: file._id,
//       name: file.name,
//       path: file.path,
//       label: file.label,       
//       duration: file.duration,
//       uploadedAt: file.uploadedAt || new Date(),
//     });

//     await patient.save();
//     await folder.save();

//     return folder;
//   }

async moveFileToFolder({ patientId, admissionId, fileId, folderId, fileType }) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  const folder = await FOLDER_MODEL.findById(folderId);
  if (!folder) throw new Error('Folder not found');

  const fieldMap = {
    videoRecordings: 'videoRecordings',
    audioRecordings: 'audioRecordings',
    labReports: 'labReports',
    radiologyReports: 'radiologyReports',
    otherDocs: 'otherDocs',
  };

  const patientField = fieldMap[fileType];
  if (!patientField) throw new Error('Invalid file type');

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error('Admission not found');

  const fileIndex = admission[patientField].findIndex(f => f._id.toString() === fileId);
  if (fileIndex === -1) throw new Error('File not found in patient records');

  const [file] = admission[patientField].splice(fileIndex, 1); // remove from patient

  const movedFile = {
    fileId: file._id,
    name: file.name,
    path: file.path,
    label: file.label,
    duration: file.duration,
    uploadedAt: file.uploadedAt || new Date(),
  };

  folder.files.push(movedFile);

  await patient.save();
  await folder.save();

  return movedFile; // return only the moved file
}

}

export default new Audio_video_recService();
