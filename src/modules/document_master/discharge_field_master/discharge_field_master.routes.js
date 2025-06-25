import { Router } from 'express';
import Discharge_field_masterController from './discharge_field_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createDischarge_field_masterSchema } from './discharge_field_master.validator.js';

const router = Router();
const discharge_field_masterController = new Discharge_field_masterController();

router.get('/', discharge_field_masterController.getAll);
router.post('/', validate(createDischarge_field_masterSchema), discharge_field_masterController.create);
router.get('/search', discharge_field_masterController.search);

export default router;
