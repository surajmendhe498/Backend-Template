import { Router } from 'express';
import Signature_masterController from './signature_master.controller.js';

const router = Router();
const signature_masterController = new Signature_masterController();

router.get('/', signature_masterController.getAll);
router.put('/:id', signature_masterController.update);
router.post('/', signature_masterController.create);
router.delete('/:id', signature_masterController.delete);

export default router;
