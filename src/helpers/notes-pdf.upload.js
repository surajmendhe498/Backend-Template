// import multer from "multer";
// import path from "path";

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext === ".pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed"), false);
//   }
// };

// const uploadPdf = multer({ storage, fileFilter });

// export default uploadPdf;

import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadPdf = multer({ storage, fileFilter }).fields([
  { name: 'clinicalNotesPdf', maxCount: 1 },
  { name: 'nursingNotesPdf', maxCount: 1 },
  { name: 'surgicalNotesPdf', maxCount: 1 },
  { name: 'symptomsPdf', maxCount: 1 },
  { name: 'pastHistoryPdf', maxCount: 1 },
  { name: 'vitalDataPdf', maxCount: 1 },
  { name: 'otherDataPdf', maxCount: 1 },
]);

export default uploadPdf;
