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

  getTrends = async (req, res, next) => {
    try {
      const year = req.query.year ? parseInt(req.query.year) : undefined;
      const trends = await this.dashboard_statisticsService.getTrends(year);

      res.status(statusCode.OK).json({
        success: true,
        message: "Trends data fetched successfully",
        data: trends,
      });
    } catch (err) {
      next(err);
    }
  };
}
