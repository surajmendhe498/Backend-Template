import Final_dischargeService from "./final_discharge.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Final_dishargeController {
  constructor() {
    this.final_dischargeService =  Final_dischargeService;
  }

   getAll = async (req, res, next) => {
    try {
      const finalDischarges = await this.final_dischargeService.getAll();
      res.success('Final discharges fetched successfully', finalDischarges, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { patientId, admissionId, dateOfDischarge, timeOfDischarge, reasonForDischarge } = req.body;

      if (!patientId || !admissionId || !dateOfDischarge || !timeOfDischarge) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "patientId, admissionId, dateOfDischarge, and timeOfDischarge are required"
        });
      }

      const discharge = await this.final_dischargeService.create({
        patientId,
        admissionId,
        dateOfDischarge,
        timeOfDischarge,
        reasonForDischarge
      });

      res.success("Final discharge created successfully", discharge, statusCode.CREATED);

    } catch (err) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: err.message
      });
    }
  };

  getById = async (req, res, next) => {
    try {
      const finalDischarge = await this.final_dischargeService.getById(req.params.id);

      if (!finalDischarge) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Final discharge not found"
        });
      }

      res.success('Final discharge fetched successfully', finalDischarge, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

}
