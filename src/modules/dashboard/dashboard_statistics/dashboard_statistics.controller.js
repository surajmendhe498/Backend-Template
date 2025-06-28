import Dashboard_statisticsService from "./dashboard_statistics.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Dashboard_statisticsController {
  constructor() {
    this.dashboard_statisticsService = Dashboard_statisticsService;
  }

   getAll = async (req, res, next) => {
    try {
      const stats = await this.dashboard_statisticsService.getAll();

      res.status(statusCode.OK).json({
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  };
}
