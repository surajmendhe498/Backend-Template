import { Router } from 'express';
import NotesController from './notes.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = Router();
const notesController = new NotesController();

router.post('/add', authenticate, notesController.addNotes);
router.get('/:patientId/:admissionId', notesController.getNotes);
router.put('/update', authenticate, notesController.updateNote);
router.delete('/delete', notesController.deleteNote);

export default router;
