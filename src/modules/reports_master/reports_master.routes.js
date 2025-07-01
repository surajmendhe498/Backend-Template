import { Router } from 'express';
import Reports_masterController from './reports_master.controller.js';

const router = Router();
const reports_masterController = new Reports_masterController();

router.get('/monthly', reports_masterController.getMonthlyReports);
router.get('/date-range', reports_masterController.getReportsByDateRange);
router.get('/consultant', reports_masterController.getConsultantReports);

export default router;
