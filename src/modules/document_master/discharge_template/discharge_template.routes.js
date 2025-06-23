import { Router } from 'express';
import DischargeTemplateController from './discharge_template.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createDischargeTemplateSchema } from './discharge_template.validator.js';

const router = Router();
const dischargeTemplateController = new DischargeTemplateController();

router.get('/', dischargeTemplateController.getAll);
router.post('/', validate(createDischargeTemplateSchema), dischargeTemplateController.create);
router.put('/:id', dischargeTemplateController.update);
router.delete('/:id', dischargeTemplateController.delete);
router.get('/search', dischargeTemplateController.search);

export default router;
