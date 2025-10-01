import { Router } from "express";
import Documents_pdfsController from "./documents_pdfs.controller.js";
import uploadPdf from "../../helpers/pdfs.upload.js";
import authenticate from '../../middlewares/auth.middleware.js';

const router = Router();
const documents_pdfsController = new Documents_pdfsController();

// router.post("/upload", uploadPdf.array("pdfs", 12), documents_pdfsController.upload);
// router.post("/upload", uploadPdf.single("pdf"), documents_pdfsController.upload);
router.get("/", documents_pdfsController.getAll);
router.get("/:id", documents_pdfsController.getById);
router.post("/:pdfId/add-language", uploadPdf.single("file"), documents_pdfsController.addLanguageVersion);
router.put("/update-color", documents_pdfsController.updateColor);

router.post("/add-pdf", authenticate, uploadPdf.single("pdfFile"), documents_pdfsController.addPdfToPatient);
router.get("/:patientId/:admissionId", documents_pdfsController.getPdfsByPatient);
router.put("/update-pdf", uploadPdf.single("pdfFile"), documents_pdfsController.updatePdfDocument);
router.delete("/delete-pdf/:patientId/:admissionId/:pdfId", documents_pdfsController.deletePdfDocument);
router.patch("/soft-delete/:patientId/:admissionId/:pdfId", documents_pdfsController.softDeletePdfDocument);
router.get("/soft-deleted/:patientId/:admissionId", documents_pdfsController.getSoftDeletedPdfs);
router.patch("/restore/:patientId/:admissionId/:pdfId", documents_pdfsController.restorePdfDocument);


export default router;
