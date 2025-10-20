import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const fieldName = file.fieldname;
  let allowedFormats = [];

  if (["docs", "labReports", "radiologyReports"].includes(fieldName)) {
    allowedFormats = [".pdf"];
  }

  if (allowedFormats.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const uploadFilesAndRecordings = multer({
  storage,
  fileFilter,
}).fields([
  { name: "docs", maxCount: 20 },
  { name: "labReports", maxCount: 20 },
  { name: "radiologyReports", maxCount: 20 }
]);

export default uploadFilesAndRecordings;
