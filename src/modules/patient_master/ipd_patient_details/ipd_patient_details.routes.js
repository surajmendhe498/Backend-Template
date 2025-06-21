import { Router } from 'express';
import Ipd_patient_detailsController from './ipd_patient_details.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createIpd_patient_detailsSchema } from './ipd_patient_details.validator.js';

const router = Router();
const ipd_patient_detailsController = new Ipd_patient_detailsController();

router.get('/', ipd_patient_detailsController.getAll);
router.post('/',validate(createIpd_patient_detailsSchema), ipd_patient_detailsController.create);

export default router;
