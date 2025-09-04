import { Router } from 'express';
import Lab_dischargeController from './lab_discharge.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const lab_dischargeController = new Lab_dischargeController();

router.post('/', lab_dischargeController.create);
router.get('/', lab_dischargeController.getAll);
router.get('/:id', lab_dischargeController.getById);

export default router;
