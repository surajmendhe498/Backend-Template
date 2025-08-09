import { Router } from "express";
import Dashboard_statisticsController from "./dashboard_statistics.controller.js";

const router = Router();
const dashboard_statisticsController = new Dashboard_statisticsController();

router.get("/stats", dashboard_statisticsController.getAll);
router.get("/trends", dashboard_statisticsController.getTrends);
router.get("/gender-distribution", dashboard_statisticsController.getGenderDistribution);
router.get('/patient-admitted-by-time', dashboard_statisticsController.getPatientAdmittedByTime);
router.get("/total-hospital-staff", dashboard_statisticsController.getTotalHospitalStaff);


export default router;
