import { Router } from 'express';
import Ot_notes_templateController from './ot_notes_template.controller.js';

const router = Router();
const ot_notes_templateController = new Ot_notes_templateController();

router.post("/:patientId/:admissionId", ot_notes_templateController.add);
router.get("/:patientId/:admissionId", ot_notes_templateController.getAll);  // fetch all ot notes template


export default router;
