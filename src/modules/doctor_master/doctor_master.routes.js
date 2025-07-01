import { Router } from 'express';
import Doctor_masterController from './doctor_master.controller.js';
import validate from '../../middlewares/default/validate.js';
import { createDoctorSchema } from './doctor_master.validator.js';
import { upload } from '../../helpers/upload.js';

const router = Router();
const doctor_masterController = new Doctor_masterController();

router.get('/', doctor_masterController.getAll);
router.post('/', upload.single('photo'), validate(createDoctorSchema), doctor_masterController.create);
router.get("/filter", doctor_masterController.getFilteredDoctors);

export default router;
