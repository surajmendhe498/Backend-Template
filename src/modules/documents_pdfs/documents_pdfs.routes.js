import { Router } from "express";
import Documents_pdfsController from "./documents_pdfs.controller.js";
import uploadPdf from "../../helpers/pdfs.upload.js";

const router = Router();
const documents_pdfsController = new Documents_pdfsController();

// router.post("/upload", uploadPdf.array("pdfs", 12), documents_pdfsController.upload);
// router.post("/upload", uploadPdf.single("pdf"), documents_pdfsController.upload);
router.get("/", documents_pdfsController.getAll);
router.get("/:id", documents_pdfsController.getById);
router.post("/add-pdf", uploadPdf.single("pdfFile"), documents_pdfsController.addPdfToPatient);
router.put("/update-color", documents_pdfsController.updateColor);

export default router;
