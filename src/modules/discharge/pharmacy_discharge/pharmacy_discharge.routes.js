import { Router } from 'express';
import Pharmacy_dischargeController from './pharmacy_discharge.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const pharmacy_dischargeController = new Pharmacy_dischargeController();

router.post('/', pharmacy_dischargeController.create);
router.get('/', pharmacy_dischargeController.getAll);
router.get('/:id', pharmacy_dischargeController.getById);

export default router;
