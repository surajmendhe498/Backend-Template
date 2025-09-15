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
    const { type = 'monthly', year } = req.query;
    const parsedYear = year ? parseInt(year) : undefined;

    const trends = await this.dashboard_statisticsService.getTrends(type, parsedYear);

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

getPatientAdmittedByTime = async (req, res, next) => {
  try {
    const type = req.query.type || 'daily';
    const referenceDate = req.query.date ? new Date(req.query.date) : new Date();

    const data = await this.dashboard_statisticsService.getPatientAdmittedByTime(type, referenceDate);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

  getTotalHospitalStaff = async (req, res, next) => {
  try {
    const result = await this.dashboard_statisticsService.getTotalHospitalStaff();

    res.status(statusCode.OK).json({
      success: true,
      message: "Total hospital staff count fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching total hospital staff:", err);
    next(err);
  }
};

getIpdDocuments = async (req, res, next) => {
 try {
    const { type = "monthly", year } = req.query;
    const parsedYear = year ? parseInt(year) : undefined;

    const result = await this.dashboard_statisticsService.getIpdDocumentStats(type, parsedYear);

    return res.status(200).json({
      success: true,
      message: "Total IPD document-pdfs stats fetched successfully",
      data: result
    });
  } catch (err) {
    console.error("Error fetching total hospital staff:", err);
    next(err);
  }
};


}
