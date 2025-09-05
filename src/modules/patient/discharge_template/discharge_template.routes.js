import { Router } from 'express';
import Discharge_templateController from './discharge_template.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const discharge_templateController = new Discharge_templateController();

router.post("/:patientId/:admissionId", discharge_templateController.add);
router.get("/:patientId/:admissionId", discharge_templateController.getAll);   // fetch all discharge-templates

export default router;
