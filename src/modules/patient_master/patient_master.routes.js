import { Router } from 'express';
import Patient_masterController from './patient_master.controller.js';

const router = Router();
const patient_masterController = new Patient_masterController();

router.get('/filter', patient_masterController.getAll); 


export default router;
