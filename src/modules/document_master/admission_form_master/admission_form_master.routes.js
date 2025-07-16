import { Router } from 'express';
import Admission_form_masterController from './admission_form_master.controller.js';

const router = Router();
const admission_form_masterController = new Admission_form_masterController();

router.get('/', admission_form_masterController.getAll);
router.put('/:id', admission_form_masterController.updateField);

export default router;
