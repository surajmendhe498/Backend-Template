import { Router } from 'express';
import Nursing_masterController from './nursing_master.controller.js';
import validate from '../../middlewares/default/validate.js';
import { createNurseSchema } from './nursing_master.validator.js';
import { upload } from '../../helpers/upload.js';

const router = Router();
const nursing_masterController = new Nursing_masterController();

router.get('/', nursing_masterController.getAll);
router.post('/',upload.single('photo'), validate(createNurseSchema), nursing_masterController.create);
router.get('/filter',nursing_masterController.filterByDepartment);

export default router;
