import { Router } from 'express';
import Word_or_floor_masterController from './word_or_floor_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createWord_or_floor_masterSchema, updateWord_or_floor_masterSchema } from './word_or_floor_master.validator.js';

const router = Router();
const word_or_floor_masterController = new Word_or_floor_masterController();

router.get('/', word_or_floor_masterController.getAll); 
router.post('/',validate(createWord_or_floor_masterSchema), word_or_floor_masterController.create); 
router.put('/:id', validate(updateWord_or_floor_masterSchema), word_or_floor_masterController.update); 
router.get('/search', word_or_floor_masterController.search); 


export default router;
