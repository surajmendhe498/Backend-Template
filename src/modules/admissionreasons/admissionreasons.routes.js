import { Router } from 'express';
import AdmissionreasonsController from './admissionreasons.controller.js';

const router = Router();
const admissionreasonsController = new AdmissionreasonsController();

router.get('/', admissionreasonsController.getAll);

export default router;
