import { Router } from 'express';
import Pre_registration_patientController from './pre_registration_patient.controller.js';

const router = Router();
const pre_registration_patientController = new Pre_registration_patientController();

router.get('/data', pre_registration_patientController.getAll)
router.post('/', pre_registration_patientController.create);


export default router;
