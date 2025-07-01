import { Router } from 'express';
import DischargeTemplateController from './discharge-template.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createDischargeTemplateSchema } from './discharge-template.validator.js';

const router = Router();
const dischargeTemplateController = new DischargeTemplateController();

router.get('/', dischargeTemplateController.getAll);
router.post('/', validate(createDischargeTemplateSchema), dischargeTemplateController.create);
router.put('/:id', dischargeTemplateController.update);
router.delete('/:id', dischargeTemplateController.delete);
router.get('/search', dischargeTemplateController.search);

export default router;
