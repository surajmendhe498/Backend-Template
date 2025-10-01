// import mongoose from "mongoose";

// const documentPdfSchema = new mongoose.Schema(
//   {
//     pdfName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     pdfUrl: {
//       type: String,
//       required: true,
//     },
//     color: {
//       type: String
//     }
//   },
// );

// export const DOCUMENT_PDF_MODEL = mongoose.model('pdf-document1', documentPdfSchema);

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    language: { type: String, required: true, trim: true },
    pdfUrl: { type: String, trim: true, default: "" }, 
  },
  // { _id: false }
);

const documentPdfSchema = new mongoose.Schema({
  pdfName: { type: String, required: true, trim: true },
  files: { type: [fileSchema], default: [] },
  color: { type: String, default: "" }, 
});

export const DOCUMENT_PDF_MODEL = mongoose.model("pdf-document4", documentPdfSchema);
