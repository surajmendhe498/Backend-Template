import Lab_dischargeService from "./lab_discharge.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Lab_dischargeController {
  constructor() {
    this.lab_dischargeService =  Lab_dischargeService;
  }

  getAll = async (req, res, next) => {
    try {
      const labDischarges = await this.lab_dischargeService.getAll();
      res.success('Lab discharges fetched successfully', labDischarges, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { patientId, admissionId, dateOfDischarge, timeOfDischarge, remark } = req.body;

      if (!patientId || !admissionId || !dateOfDischarge || !timeOfDischarge) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "patientId, admissionId, dateOfDischarge, and timeOfDischarge are required"
        });
      }

      const discharge = await this.lab_dischargeService.create({
        patientId,
        admissionId,
        dateOfDischarge,
        timeOfDischarge,
        remark
      });

      res.success("Lab discharged successfully", discharge, statusCode.CREATED);

    } catch (err) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: err.message
      });
    }
  };

  getById = async (req, res, next) => {
    try {
      const labDischarge = await this.lab_dischargeService.getById(req.params.id);

      if (!labDischarge) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Lab discharge not found"
        });
      }

      res.success('Lab discharge fetched successfully', labDischarge, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

}
