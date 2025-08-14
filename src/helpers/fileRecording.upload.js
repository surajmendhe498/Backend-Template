// uploads.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js'; 

const filesAndRecordingsStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = 'misc-files';
    let allowedFormats = ['jpeg', 'png', 'webp', 'pdf'];
    let resourceType = 'raw'; // default for docs & labReports

    const fieldName = file.fieldname;

    if (fieldName === 'docs') {
      folderName = 'patient-docs';
      allowedFormats = ['jpeg', 'png', 'webp', 'pdf'];
      resourceType = 'raw';
    } 
    else if (fieldName === 'labReports') {
      folderName = 'lab-reports';
      allowedFormats = ['jpeg', 'png', 'webp', 'pdf'];
      resourceType = 'raw';
    }
    else if (fieldName === 'audioRecordings') {
      folderName = 'audio-recordings';
      allowedFormats = ['mp3', 'wav', 'm4a'];
      resourceType = 'video'; // Cloudinary treats audio as video
    }
    else if (fieldName === 'videoRecordings') {
      folderName = 'video-recordings';
      allowedFormats = ['mp4', 'avi', 'mov', 'mkv'];
      resourceType = 'video';
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
    };
  },
});

const uploadFilesAndRecordings = multer({ storage: filesAndRecordingsStorage }).fields([
  { name: 'docs', maxCount: 20 },
  { name: 'labReports', maxCount: 20 },
  { name: 'audioRecordings', maxCount: 10 },
  { name: 'videoRecordings', maxCount: 10 },
]);

export default uploadFilesAndRecordings;
