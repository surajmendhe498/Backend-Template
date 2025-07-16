import { Router } from 'express';
import Discharge_field_masterController from './discharge_field_master.controller.js';

const router = Router();
const discharge_field_masterController = new Discharge_field_masterController();

router.get('/', discharge_field_masterController.getAll);
router.put('/:id', discharge_field_masterController.updateField);

export default router;
