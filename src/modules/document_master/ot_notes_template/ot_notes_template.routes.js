import { Router } from 'express';
import Ot_notes_templateController from './ot_notes_template.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createOtNotesTemplateSchema } from './ot_notes_template.validator.js';

const router = Router();
const ot_notes_templateController = new Ot_notes_templateController();

router.get('/', ot_notes_templateController.getAll);
router.post('/', validate(createOtNotesTemplateSchema), ot_notes_templateController.create);
router.put('/:id', ot_notes_templateController.update);
router.delete('/:id', ot_notes_templateController.delete);
router.get('/search', ot_notes_templateController.search);

export default router;
