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
    console.error("Error fetching trends:", err);
    next(err);
  }
};

getGenderDistribution = async (req, res, next) => {
  try {
    const genderDistribution = await this.dashboard_statisticsService.getGenderDistribution();

    res.status(200).json({
      success: true,
      message: "Patient gender distribution fetched successfully",
      data: genderDistribution,
    });
  } catch (err) {
    console.error("Error fetching gender distribution:", err);
    next(err);
  }
};

  // Get patient admitted by time
getPatientAdmittedByTime = async (req, res, next) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Query parameter 'date' is required",
        });
      }

      const result = await this.dashboard_statisticsService.getPatientAdmittedByTime(date);

      res.status(statusCode.OK).json({
        success: true,
        message: "Patient admission by time fetched successfully",
        data: result,
      });
    } catch (err) {
      console.error("Error fetching admission by time:", err);
      next(err);
    }
  };

}
