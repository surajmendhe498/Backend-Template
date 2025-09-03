import Billing_dischargeService from "./billing_discharge.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Billing_dischargeController {
  constructor() {
    this.billing_dischargeService =  Billing_dischargeService;
  }

  getAll = async (req, res, next) => {
    try {
      const billingDischarges = await this.billing_dischargeService.getAll();
      res.success('Billing discharges fetched successfully', billingDischarges, statusCode.OK);
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

      const discharge = await this.billing_dischargeService.create({
        patientId,
        admissionId,
        dateOfDischarge,
        timeOfDischarge,
        remark
      });

      res.success("Billing discharged successfully", discharge, statusCode.CREATED);

    } catch (err) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: err.message
      });
    }
  };

  getById = async (req, res, next) => {
    try {
      const billingDischarge = await this.billing_dischargeService.getById(req.params.id);

      if (!billingDischarge) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Billing discharge not found"
        });
      }

      res.success('Billing discharge fetched successfully', billingDischarge, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };
}
