import { Router } from 'express';
import Change_consultantController from './change_consultant.controller.js';

const router = Router();
const change_consultantController = new Change_consultantController();

router.get('/all', change_consultantController.getAll);
router.post('/:patientId', change_consultantController.changeConsultant);
router.get('/history/:patientId', change_consultantController.getByPatientId);
router.get('/history/:patientId/:admissionId', change_consultantController.getByPatientAndAdmissionId);


export default router;
