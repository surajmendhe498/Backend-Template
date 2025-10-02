import { Router } from 'express';
import Discharge_templateController from './discharge_template.controller.js';

const router = Router();
const discharge_templateController = new Discharge_templateController();

router.post("/:patientId/:admissionId", discharge_templateController.add);
router.get("/:patientId/:admissionId", discharge_templateController.getAll);   
router.put("/:patientId/:admissionId/:templateId", discharge_templateController.edit);
router.delete("/:patientId/:admissionId/:templateId", discharge_templateController.delete);
router.post("/send-whatsapp/:patientId/:admissionId", discharge_templateController.sendMultipleOnWhatsApp);

export default router;
