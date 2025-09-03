import Pharmacy_dischargeService from "./pharmacy_discharge.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Pharmacy_dischargeController {
  constructor() {
    this.pharmacy_dischargeService =  Pharmacy_dischargeService;
  }

  getAll = async (req, res, next) => {
    try {
      const pharmacyDischarges = await this.pharmacy_dischargeService.getAll();
      res.success('Pharmacy discharges fetched successfully', pharmacyDischarges, statusCode.OK);
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

      const discharge = await this.pharmacy_dischargeService.create({
        patientId,
        admissionId,
        dateOfDischarge,
        timeOfDischarge,
        remark
      });

      res.success("Pharmacy discharged successfully", discharge, statusCode.CREATED);

    } catch (err) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: err.message
      });
    }
  };

  getById = async (req, res, next) => {
    try {
      const pharmacyDischarge = await this.pharmacy_dischargeService.getById(req.params.id);

      if (!pharmacyDischarge) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Pharmacy discharge not found"
        });
      }

      res.success('Pharmacy discharge fetched successfully', pharmacyDischarge, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };
}
