import { FOLDER_MODEL } from "./folders.model.js";
import { PATIENT_MODEL } from "../patient/patient.model.js";
import imagekit from '../../helpers/imagekit.js';
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

async function getMediaDuration(filePath) {
  return new Promise(resolve => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err || !metadata?.format?.duration) return resolve(0);
      const duration = parseFloat(metadata.format.duration);
      resolve(isNaN(duration) ? 0 : Math.round(duration));
    });
  });
}

class FoldersService {

  async getAll() {
    return await FOLDER_MODEL.find();
  }

  async createFolder({name, type, patientId, admissionId }) {

    const patientExists = await PATIENT_MODEL.findById(patientId);
    if (!patientExists) throw new Error("Invalid Patient ID: Patient not found");

    const admissionExists = patientExists.admissionDetails.find(
      a => a._id.toString() === admissionId
    );
    if (!admissionExists) throw new Error("Invalid Admission ID: Admission not found for the given patient.");
    
    const existingFolder = await FOLDER_MODEL.findOne({ name, type, patientId, admissionId });
    if (existingFolder) {
      throw new Error('Folder with this name already exists for this type.');
    }

    const folder = new FOLDER_MODEL({name, type, patientId, admissionId });
    await folder.save();
    return folder;
  }

async getAllFoldersByPatientAndAdmission(patientId, admissionId, type) {
  const query = { patientId, admissionId };
  if (type) {
    query.type = type;
  }

  const folders = await FOLDER_MODEL.find(query);

  if (!folders || folders.length === 0) {
    throw new Error("No folders found for this patient and admission");
  }

  // if (type) {
  //   return folders[0];
  // }

  if (type) {
  return folders;   // return all folders of that type
}

  const foldersMap = {};
  folders.forEach(folder => {
    foldersMap[folder.type] = folder;
  });

  return {
    videoRecordings: foldersMap["videoRecordings"] || { files: [] },
    audioRecordings: foldersMap["audioRecordings"] || { files: [] },
    labReports: foldersMap["labReports"] || { files: [] },
    radiologyReports: foldersMap["radiologyReports"] || { files: [] },
    docs: foldersMap["docs"] || { files: [] }
  };
}

async renameFileInFolder({ folderId, fileId, newName }) {
  const folder = await FOLDER_MODEL.findById(folderId);
  if (!folder) throw new Error("Folder not found");

  const file = folder.files.find(f => f.fileId.toString() === fileId);
  if (!file) throw new Error("File not found in folder");

  file.name = newName;
  await folder.save();

  return file;
}

async deleteFileFromFolder({ folderId, fileId }) {
  const folder = await FOLDER_MODEL.findById(folderId);
  if (!folder) throw new Error("Folder not found");

  const fileIndex = folder.files.findIndex(f => f.fileId.toString() === fileId);
  if (fileIndex === -1) throw new Error("File not found in folder");

  const [removedFile] = folder.files.splice(fileIndex, 1); // remove the file
  await folder.save();

  return removedFile;
}

async updateRecordingFile({ folderId, fileId, label, file, duration }) {
    const folder = await FOLDER_MODEL.findById(folderId);
    if (!folder) throw new Error("Folder not found");

    const fileDoc = folder.files.find(f => f.fileId.toString() === fileId);
    if (!fileDoc) throw new Error("File not found in folder");

    if (file) {
      fileDoc.name = file.originalname;
      fileDoc.path = file.path;

      const calculatedDuration = await getMediaDuration(file.path);
      fileDoc.duration = calculatedDuration > 0 ? calculatedDuration : fileDoc.duration;
    }
    
    if (label !== undefined) fileDoc.label = label;

    if (!file && duration !== undefined) {
      fileDoc.duration = duration;
    }

    await folder.save();
    return fileDoc;
  }

async updateFile({ folderId, fileId, file }) {
  const folder = await FOLDER_MODEL.findById(folderId);
  if (!folder) {
    throw new Error("Folder not found");
  }

  const fileDoc = folder.files.find(f => f.fileId.toString() === fileId);
  if (!fileDoc) {
    throw new Error("File not found in this folder");
  }

  // If new file uploaded → upload to ImageKit
  if (file) {
    const fileBuffer = fs.readFileSync(file.path);
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension);
    const safeFileName = baseName + extension;

    const uploadResult = await imagekit.upload({
      file: fileBuffer,           
      fileName: safeFileName,      
      folder: `/${file.fieldname}` 
    });

    //  Update file details
    fileDoc.name = file.originalname;
    fileDoc.path = uploadResult.url;  
    fileDoc.mimetype = file.mimetype;
    fileDoc.size = file.size;
    fileDoc.uploadedAt = new Date();

    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }

  await folder.save();
  return fileDoc;
}

}

export default new FoldersService();
