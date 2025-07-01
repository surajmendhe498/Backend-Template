import { Router } from 'express';
import Ipd_patient_detailsController from './ipd_patient_details.controller.js';

const router = Router();
const ipd_patient_detailsController = new Ipd_patient_detailsController();

router.get('/filter', ipd_patient_detailsController.getFilteredIpdPatients);

export default router;
