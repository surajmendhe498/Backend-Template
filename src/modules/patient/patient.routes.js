import { Router } from 'express';
import PatientController from './patient.controller.js';
import validate from '../../middlewares/default/validate.js';
import {upload} from '../../helpers/upload.js';


const router = Router();
const patientController = new PatientController();

router.post('/', upload.single('admissionDetails[patientPhoto]'), patientController.create);
router.get('/', patientController.getAll);
router.delete('/:id', patientController.delete);
router.get('/:id', patientController.getById);

export default router;
