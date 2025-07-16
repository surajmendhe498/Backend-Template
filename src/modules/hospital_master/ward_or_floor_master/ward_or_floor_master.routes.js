import { Router } from 'express';
import WardOrFloorMasterController from './ward_or_floor_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import {
  createWard_or_floor_masterSchema,
  updateWard_or_floor_masterSchema,
} from './ward_or_floor_master.validator.js';

const router = Router();
const wardOrFloorMasterController = new WardOrFloorMasterController();

router.get('/', wardOrFloorMasterController.getAll);
router.post('/', validate(createWard_or_floor_masterSchema), wardOrFloorMasterController.create);
router.put('/:id', validate(updateWard_or_floor_masterSchema), wardOrFloorMasterController.update);
router.delete('/:id', wardOrFloorMasterController.delete);
router.get('/search', wardOrFloorMasterController.search);

export default router;
