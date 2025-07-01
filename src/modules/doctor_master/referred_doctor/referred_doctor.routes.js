import { Router } from 'express';
import Referred_doctorController from './referred_doctor.controller.js';
// import validate from '../../middlewares/default/validate.js';

const router = Router();
const referred_doctorController = new Referred_doctorController();

router.get('/', referred_doctorController.getAll);
router.post('/', referred_doctorController.create);

export default router;
