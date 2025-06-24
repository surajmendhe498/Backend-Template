import { Router } from 'express';
import Operative_notes_orderController from './operative_notes_order.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createOperative_notes_orderSchema } from './operative_notes_order.validator.js';

const router = Router();
const operative_notes_orderController = new Operative_notes_orderController();

router.get('/', operative_notes_orderController.getAll);
router.post('/', validate(createOperative_notes_orderSchema), operative_notes_orderController.create);
router.get('/search', operative_notes_orderController.search);

export default router;
