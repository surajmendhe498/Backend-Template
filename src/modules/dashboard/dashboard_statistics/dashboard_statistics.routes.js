import { Router } from "express";
import Dashboard_statisticsController from "./dashboard_statistics.controller.js";

const router = Router();
const dashboard_statisticsController = new Dashboard_statisticsController();

router.get("/", dashboard_statisticsController.getAll);

export default router;
