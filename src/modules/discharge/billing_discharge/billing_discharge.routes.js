import { Router } from 'express';
import Billing_dischargeController from './billing_discharge.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const billing_dischargeController = new Billing_dischargeController();

router.post('/', billing_dischargeController.create);
router.get('/', billing_dischargeController.getAll);
router.get('/:id', billing_dischargeController.getById);

export default router;
