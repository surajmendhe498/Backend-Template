import { Router } from 'express';
import DischargeTemplateController from './discharge-template.controller.js';

const router = Router();
const dischargeTemplateController = new DischargeTemplateController();

router.get('/', dischargeTemplateController.getAll);
router.post('/', dischargeTemplateController.create);
router.put('/:id', dischargeTemplateController.update);
router.delete('/:id', dischargeTemplateController.delete);
router.get('/:id', dischargeTemplateController.getById);

export default router;
