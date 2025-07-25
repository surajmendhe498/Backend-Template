import { Router } from 'express';
import Lab_masterController from './lab_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createLab_masterSchema, updateLab_masterSchema } from './lab_master.validator.js';

const router = Router();
const lab_masterController = new Lab_masterController();

router.get('/', lab_masterController.getAll);
router.post('/', validate(createLab_masterSchema), lab_masterController.create);
router.put('/:id', validate(updateLab_masterSchema), lab_masterController.update);
router.get('/search', lab_masterController.search);
router.delete('/:id', lab_masterController.delete);

export default router;
