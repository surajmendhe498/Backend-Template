import { Router } from 'express';
import Ot_masterController from './ot_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createOt_masterSchema, updateOt_masterSchema } from './ot_master.validator.js';

const router = Router();
const ot_masterController = new Ot_masterController();

router.get('/', ot_masterController.getAll);
router.post('/', validate(createOt_masterSchema), ot_masterController.create);
router.put('/:id', validate(updateOt_masterSchema), ot_masterController.update);

export default router;
