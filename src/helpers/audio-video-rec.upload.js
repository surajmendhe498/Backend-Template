import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js'; 

const recordingsStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = 'misc-recordings';
    let allowedFormats = [];
    let resourceType = 'video'; // Cloudinary treats both audio & video as "video"

    const fieldName = file.fieldname;

    if (fieldName === 'audioRecordings') {
      folderName = 'audio-recordings';
      allowedFormats = ['mp3', 'wav', 'm4a', 'webm', 'mp4'];
    } 
    else if (fieldName === 'videoRecordings') {
      folderName = 'video-recordings';
      allowedFormats = ['mp4', 'avi', 'mov', 'mkv'];
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
    };
  },
});

const uploadRecordings = multer({ storage: recordingsStorage }).fields([
  { name: 'audioRecordings', maxCount: 10 },
  { name: 'videoRecordings', maxCount: 10 },
]);

export default uploadRecordings;
