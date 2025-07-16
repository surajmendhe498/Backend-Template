import { Router } from 'express';
import Operative_notes_orderController from './operative_notes_order.controller.js';

const router = Router();
const operative_notes_orderController = new Operative_notes_orderController();

router.get('/', operative_notes_orderController.getAll);
router.put('/:id', operative_notes_orderController.updateField);

export default router;
