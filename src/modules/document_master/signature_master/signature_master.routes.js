import { Router } from 'express';
import Signature_masterController from './signature_master.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createSignatureMasterSchema } from './signature_master.validator.js';


const router = Router();
const signature_masterController = new Signature_masterController();

router.get('/', signature_masterController.getAll);
router.post('/', validate(createSignatureMasterSchema), signature_masterController.create);
router.get('/search', signature_masterController.search);

export default router;
