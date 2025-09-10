import mongoose from "mongoose";

const documentPdfSchema = new mongoose.Schema(
  {
    pdfName: {
      type: String,
      required: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    color: {
      type: String
    }
  },
);

export const DOCUMENT_PDF_MODEL = mongoose.model('pdf-document1', documentPdfSchema);