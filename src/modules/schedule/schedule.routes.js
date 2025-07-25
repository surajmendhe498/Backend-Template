import { Router } from 'express';
import ScheduleController from './schedule.controller.js';

const router = Router();
const scheduleController = new ScheduleController();

router.get('/', scheduleController.getAll);
router.post('/', scheduleController.create);
router.delete('/:id', scheduleController.deleteById);
router.put('/:id', scheduleController.update);

export default router;
