import Documents_pdfsService from "./documents_pdfs.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class Documents_pdfsController {
  constructor() {
    this.documents_pdfsService = Documents_pdfsService;
  }

// upload = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.fail("No file provided", statusCode.BAD_REQUEST);
//     }

//     const { doc, message } = await this.documents_pdfsService.uploadDoc(req.file);

//     res.success(message, doc, statusCode.CREATED);
//   } catch (err) {
//     next(err);
//   }
// };
// bulk uploads pdfs
  upload = async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.fail("No files provided", statusCode.BAD_REQUEST);
      }

      const { docs, message } = await this.documents_pdfsService.uploadDocs(req.files);

      res.success(message, docs, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const docs = await this.documents_pdfsService.getAll();
      res.success("Fetched all PDFs", docs, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await this.documents_pdfsService.getById(id);

    if(!doc){
      return res.status(statusCode.NOT_FOUND).json({message: "Document not found"});
    }
    
    res.success("Fetched document successfully", doc, statusCode.OK);
  } catch (err) {
    next(err);
  }
};

  addLanguageVersion = async (req, res, next) => {
    try {
      const { pdfId } = req.params;
      const { language, name } = req.body;
      const file = req.file;

      const updatedPdf = await this.documents_pdfsService.addLanguageVersion(pdfId, language, file, name);
      res.status(statusCode.OK).json({
        success: true,
        message: `PDF ${language} version added/updated successfully`,
        data: updatedPdf,
      });
    } catch (err) {
      next(err);
    }
  };

//   addPdfToPatient = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, mainPdfId, pdfName } = req.body;

//     if (!req.file) {
//       return res.status(statusCode.BAD_REQUEST).json({ message: "PDF file is required" });
//     }
//     if (!mainPdfId) {
//       return res.status(statusCode.BAD_REQUEST).json({ message: "mainPdfId is required" });
//     }
//     if (!pdfName) {
//       return res.status(statusCode.BAD_REQUEST).json({ message: "pdfName is required" });
//     }

//     const result = await this.documents_pdfsService.addPdfToPatient({
//       patientId,
//       admissionId,
//       mainPdfId,
//       pdfBuffer: req.file.buffer,
//       pdfName
//     });

//     res.status(statusCode.OK).json({
//       success: true,
//       message: "PDF successfully uploaded and grouped",
//       data: result
//     });
//   } catch (err) {
//     next(err);
//   }
// };
addPdfToPatient = async (req, res, next) => {
  try {
    const { patientId, admissionId, mainPdfId, pdfName } = req.body;

    if (!req.file) {
      return res.status(statusCode.BAD_REQUEST).json({ message: "PDF file is required" });
    }

    const result = await this.documents_pdfsService.addPdfToPatient({
      patientId,
      admissionId,
      mainPdfId,
      pdfBuffer: req.file.buffer,
      pdfName,
      user: req.user 
    });

    res.status(statusCode.OK).json({
      success: true,
      message: "PDF successfully uploaded and grouped",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

  getPdfsByPatient = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;

    const pdfDocuments = await this.documents_pdfsService.getPdfsByPatient({
      patientId,
      admissionId,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: "Fetched PDF documents successfully",
      data: pdfDocuments,
    });
  } catch (err) {
    next(err);
  }
};

updatePdfDocument = async (req, res, next) => {
  try {
    const { patientId, admissionId, pdfId, fileName } = req.body;

    if (!fileName && !req.file) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Provide at least fileName or pdfFile to update",
      });
    }

    const updatedPdf = await this.documents_pdfsService.updatePdfDocument({
      patientId,
      admissionId,
      pdfId,
      fileName,
      pdfBuffer: req.file ? req.file.buffer : null,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: "PDF document updated successfully",
      data: updatedPdf,
    });
  } catch (err) {
    next(err);
  }
};

deletePdfDocument = async (req, res, next) => {
  try {
    const { patientId, admissionId, pdfId } = req.params;

    const result = await this.documents_pdfsService.deletePdfDocument({
      patientId,
      admissionId,
      pdfId,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: result.message,
      data: { pdfId: result.pdfId },
    });
  } catch (err) {
    next(err);
  }
};

updateColor = async (req, res, next) => {
  try {
    const { pdfIds, color } = req.body;

    if (!pdfIds || !color) {
      return res.status(400).json({ success: false, message: "PDF IDs and color are required" });
    }

    const result = await this.documents_pdfsService.updateColorForPdfs({ pdfIds, color });

    res.status(200).json({
      success: true,
      message: result.message,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    next(err);
  }
};

softDeletePdfDocument = async (req, res, next) => {
  try {
    const { patientId, admissionId, pdfId } = req.params;

    const result = await this.documents_pdfsService.softDeletePdfDocument({
      patientId,
      admissionId,
      pdfId,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: result.message,
      data: { pdfId: result.pdfId },
    });
  } catch (err) {
    next(err);
  }
};

getSoftDeletedPdfs = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;

    const pdfs = await this.documents_pdfsService.getSoftDeletedPdfs({
      patientId,
      admissionId,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: "Fetched soft-deleted PDFs successfully",
      data: pdfs,
    });
  } catch (err) {
    next(err);
  }
};

restorePdfDocument = async (req, res, next) => {
  try {
    const { patientId, admissionId, pdfId } = req.params;

    const result = await this.documents_pdfsService.restorePdfDocument({
      patientId,
      admissionId,
      pdfId,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: result.message,
      data: { pdfId: result.pdfId },
    });
  } catch (err) {
    next(err);
  }
};



}
