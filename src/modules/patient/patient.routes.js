import { Router } from 'express';
import PatientController from './patient.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import { createPatientSchema } from './patient.validator.js';

const router = Router();
const patientController = new PatientController();

router.get('/', patientController.getAll);
router.post('/', validate(createPatientSchema), patientController.create);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);
router.get('/:id', patientController.getById);

export default router;
