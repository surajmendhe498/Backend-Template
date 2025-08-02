import { Router } from 'express';
import Ward_masterController from './ward_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createWardSchema, updateWardSchema } from './ward_master.validator.js';

const router = Router();
const ward_masterController = new Ward_masterController();

router.get('/', ward_masterController.getAll);
router.get('/:id', ward_masterController.getById);
router.post('/',validate(createWardSchema), ward_masterController.create);
router.put('/:id', validate(updateWardSchema), ward_masterController.update);
router.delete('/:id', ward_masterController.delete);

export default router;
