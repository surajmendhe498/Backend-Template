import Reports_masterService from './reports_master.service.js';
import { statusCode } from '../../utils/constants/statusCode.js';

export default class Reports_masterController {
  constructor() {
    this.reports_masterService = Reports_masterService;
  }

  getMonthlyReports = async (req, res, next) => {
    try {
      const filters = req.query; 
      const reports = await this.reports_masterService.getMonthlyReports(filters);

      res.status(statusCode.OK).json({
        success: true,
        message: 'Fetched monthly reports successfully',
        data: reports,
      });
    } catch (err) {
      next(err);
    }
  };

  getReportsByDateRange = async (req, res, next) => {
    try {
      const { fromDate, toDate, fromTime, toTime } = req.query; 
      const reports = await this.reports_masterService.getReportsByDateRange({
        fromDate,
        toDate,
        fromTime,
        toTime,
      });

      res.status(statusCode.OK).json({
        success: true,
        message: 'Date range reports fetched successfully',
        data: reports,
      });
    } catch (err) {
      next(err);
    }
  };

  getConsultantReports = async (req, res, next) => {
    try {
      const { admissionDate, dischargeDate, mlcType, patientStatus } = req.query; // Extract query parameters

      const reports = await this.reports_masterService.getConsultantReports({
        admissionDate,
        dischargeDate,
        mlcType,
        patientStatus,
      });

      res.status(statusCode.OK).json({
        success: true,
        message: 'Consultant reports fetched successfully',
        data: reports,
      });
    } catch (err) {
      next(err);
    }
  };
}
