import { Router } from 'express';
import Referred_doctorController from './referred_doctor.controller.js';

const router = Router();
const referred_doctorController = new Referred_doctorController();

router.get('/all', referred_doctorController.getAll);
router.post('/', referred_doctorController.create);
router.get('/:id', referred_doctorController.getById);
router.put('/:id', referred_doctorController.update);
router.delete('/:id', referred_doctorController.delete);

export default router;
