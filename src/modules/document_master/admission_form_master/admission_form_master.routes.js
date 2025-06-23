import { Router } from 'express';
import Admission_form_masterController from './admission_form_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createAdmissionFormMasterSchema } from './admission_form_master.validator.js';

const router = Router();
const admission_form_masterController = new Admission_form_masterController();

router.get('/', admission_form_masterController.getAll);
router.post('/', validate(createAdmissionFormMasterSchema), admission_form_masterController.create);
router.get('/search', admission_form_masterController.search);


export default router;
