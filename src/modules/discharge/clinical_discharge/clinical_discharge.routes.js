import { Router } from 'express';
import Clinical_dischargeController from './clinical_discharge.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const clinical_dischargeController = new Clinical_dischargeController();

router.post('/', clinical_dischargeController.create);
router.get('/', clinical_dischargeController.getAll);
router.get('/:id', clinical_dischargeController.getById);
router.put('/:id', clinical_dischargeController.update);
router.delete('/:id', clinical_dischargeController.delete);

export default router;
