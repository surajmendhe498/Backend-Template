// // uploads.js
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from './cloudinary.js'; 

// const filesAndRecordingsStorage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     let folderName = 'misc-files';
//     let allowedFormats = ['jpeg', 'png', 'webp', 'pdf'];
//     let resourceType = 'raw'; // default for docs & labReports

//     const fieldName = file.fieldname;

//     if (fieldName === 'docs') {
//       folderName = 'patient-docs';
//       allowedFormats = ['jpeg', 'png', 'webp', 'pdf'];
//       resourceType = 'raw';
//     } 
//     else if (fieldName === 'labReports') {
//       folderName = 'lab-reports';
//       allowedFormats = ['jpeg', 'png', 'webp', 'pdf'];
//       resourceType = 'raw';
//     }
//     else if (fieldName === 'audioRecordings') {
//       folderName = 'audio-recordings';
//       allowedFormats = ['mp3', 'wav', 'm4a'];
//       resourceType = 'video'; // Cloudinary treats audio as video
//     }
//     else if (fieldName === 'videoRecordings') {
//       folderName = 'video-recordings';
//       allowedFormats = ['mp4', 'avi', 'mov', 'mkv'];
//       resourceType = 'video';
//     }

//     return {
//       folder: folderName,
//       resource_type: resourceType,
//       allowed_formats: allowedFormats,
//     };
//   },
// });

// const uploadFilesAndRecordings = multer({ storage: filesAndRecordingsStorage }).fields([
//   { name: 'docs', maxCount: 20 },
//   { name: 'labReports', maxCount: 20 },
//   { name: 'audioRecordings', maxCount: 10 },
//   { name: 'videoRecordings', maxCount: 10 },
// ]);

// export default uploadFilesAndRecordings;

// // uploads.js
// import multer from "multer";
// import path from "path";

// // Temporary local storage (before uploading to ImageKit)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // temp folder, make sure it exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // File filter for validation
// const fileFilter = (req, file, cb) => {
//   const fieldName = file.fieldname;
//   let allowedFormats = [];

//   if (fieldName === "docs") {
//     allowedFormats = [".pdf"];
//   } else if (fieldName === "labReports") {
//     allowedFormats = [".pdf"];
//   }else if (fieldName === "radiologyReports") {
//     allowedFormats = [".pdf"];
//   }
//    else if (fieldName === "audioRecordings") {
//     allowedFormats = [".mp3", ".wav", ".m4a"];
//   } else if (fieldName === "videoRecordings") {
//     allowedFormats = [".mp4", ".avi", ".mov", ".mkv"];
//   }

//   if (allowedFormats.includes(path.extname(file.originalname).toLowerCase())) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"), false);
//   }
// };

// // Multer middleware
// const uploadFilesAndRecordings = multer({
//   storage,
//   fileFilter,
// }).fields([
//   { name: "docs", maxCount: 20 },
//   { name: "labReports", maxCount: 20 },
//   { name: "radiologyReports", maxCount: 20 },
//   { name: "audioRecordings", maxCount: 10 },
//   { name: "videoRecordings", maxCount: 10 },
// ]);

// export default uploadFilesAndRecordings;


import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadPath = path.resolve("uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Temporary local storage (before uploading to ImageKit)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // safe path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const fieldName = file.fieldname;
  let allowedFormats = [];

  if (fieldName === "docs") {
    allowedFormats = [".pdf"];
  } else if (fieldName === "labReports") {
    allowedFormats = [".pdf"];
  } else if (fieldName === "radiologyReports") {
    allowedFormats = [".pdf"];
  } else if (fieldName === "audioRecordings") {
    allowedFormats = [".mp3", ".wav", ".m4a"];
  } else if (fieldName === "videoRecordings") {
    allowedFormats = [".mp4", ".avi", ".mov", ".mkv"];
  }

  if (allowedFormats.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Multer middleware
const uploadFilesAndRecordings = multer({
  storage,
  fileFilter,
}).fields([
  { name: "docs", maxCount: 20 },
  { name: "labReports", maxCount: 20 },
  { name: "radiologyReports", maxCount: 20 },
  { name: "audioRecordings", maxCount: 10 },
  { name: "videoRecordings", maxCount: 10 },
]);

export default uploadFilesAndRecordings;
