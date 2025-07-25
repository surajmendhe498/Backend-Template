import { Router } from 'express';
import Ot_notes_templateController from './ot_notes_template.controller.js';

const router = Router();
const ot_notes_templateController = new Ot_notes_templateController();

router.get('/', ot_notes_templateController.getAll);
router.post('/', ot_notes_templateController.create);
router.put('/:id', ot_notes_templateController.update);
router.delete('/:id', ot_notes_templateController.delete);
router.get('/:id', ot_notes_templateController.getById);

export default router;
