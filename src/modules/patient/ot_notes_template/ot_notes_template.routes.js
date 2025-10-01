import { Router } from 'express';
import Ot_notes_templateController from './ot_notes_template.controller.js';

const router = Router();
const ot_notes_templateController = new Ot_notes_templateController();

router.post("/:patientId/:admissionId", ot_notes_templateController.add);
router.get("/:patientId/:admissionId", ot_notes_templateController.getAll); 
router.put("/:patientId/:admissionId/:templateId", ot_notes_templateController.edit);   
router.delete("/:patientId/:admissionId/:templateId", ot_notes_templateController.delete); 


export default router;
