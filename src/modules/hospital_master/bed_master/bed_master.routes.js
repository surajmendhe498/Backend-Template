import { Router } from 'express';
import Bed_masterController from './bed_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createBedMasterSchema, updateBedMasterSchema } from './bed_master.validator.js';

const router = Router();
const bed_masterController = new Bed_masterController();

router.get('/', bed_masterController.getAll); 
router.post('/', validate(createBedMasterSchema), bed_masterController.create);
router.put('/:id',validate(updateBedMasterSchema), bed_masterController.update);  
router.get('/vacant', bed_masterController.getVacantBeds); 
router.get('/occupied', bed_masterController.getOccupiedBeds); 
router.get('/under-maintenance', bed_masterController.getUnderMaintainanceBed); 
router.get('/filter', bed_masterController.filterBeds);


export default router;
