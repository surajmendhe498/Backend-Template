import { Router } from 'express';
import Note_lable_masterController from './note_lable_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { Notes_lable_masterSchema } from './note_lable_master.validator.js';

const router = Router();
const note_lable_masterController = new Note_lable_masterController();

router.get('/', note_lable_masterController.getAll);
router.post('/', validate(Notes_lable_masterSchema), note_lable_masterController.create);
router.get('/search', note_lable_masterController.search);

export default router;
