import { Router } from 'express';
import Transfer_patientController from './transfer_patient.controller.js';

const router = Router();
const transfer_patientController = new Transfer_patientController();

router.get('/all', transfer_patientController.getAll);
router.put('/:id', transfer_patientController.transfer);

export default router;
