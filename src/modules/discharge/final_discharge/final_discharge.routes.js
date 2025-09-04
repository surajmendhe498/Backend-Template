import { Router } from 'express';
import Final_dischargeService from './final_discharge.controller.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';

const router = Router();
const final_dischargeController = new Final_dischargeService();

router.post('/', final_dischargeController.create);
router.get('/', final_dischargeController.getAll);
router.get('/:id', final_dischargeController.getById);

export default router;
