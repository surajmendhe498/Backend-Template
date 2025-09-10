// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadPath = path.resolve("uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (path.extname(file.originalname).toLowerCase() === ".pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed"), false);
//   }
// };

// const uploadPdf = multer({ storage, fileFilter });

// export default uploadPdf;

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadPath = path.resolve("uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedFormats = [".pdf", ".doc", ".docx", ".xlsx"];
//   if (allowedFormats.includes(path.extname(file.originalname).toLowerCase())) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
//   }
// };

// const uploadDocs = multer({ storage, fileFilter });

// export default uploadDocs;


import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedFormats = [".pdf", ".doc", ".docx", ".xlsx"];
  const fileExt = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();

  if (allowedFormats.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, and XLSX files are allowed"), false);
  }
};

const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } 
});

export default uploadPdf;
