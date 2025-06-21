import { Router } from 'express';
import Patient_masterController from './patient_master.controller.js';
import validate from '../../middlewares/default/validate.js';
import { createPatientMasterSchema } from './patient_master.validator.js';
import { upload } from '../../helpers/upload.js'; 

const router = Router();
const patient_masterController = new Patient_masterController();

router.get('/', patient_masterController.getAll);

router.post(
  '/',
  upload.single('patientPhoto'), 
  validate(createPatientMasterSchema),
  patient_masterController.create
);

export default router;
