import Clinical_dischargeService from "./clinical_discharge.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Clinical_dischargeController {
  constructor() {
    this.clinical_dischargeService =  Clinical_dischargeService;
  }

  getAll = async (req, res, next) => {
    try {
      const clinicalDischarges = await this.clinical_dischargeService.getAll();
      res.success('Clinical discharges fetched successfully', clinicalDischarges, statusCode.OK);
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

      const discharge = await this.clinical_dischargeService.create({
        patientId,
        admissionId,
        dateOfDischarge,
        timeOfDischarge,
        remark
      });

      res.success("Clinical discharged successfully", discharge, statusCode.CREATED);

    } catch (err) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: err.message
      });
    }
  };

  getById = async (req, res, next) => {
    try {
      const clinicalDischarge = await this.clinical_dischargeService.getById(req.params.id);

      if (!clinicalDischarge) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Clinical discharge not found"
        });
      }

      res.success('Clinical discharge fetched successfully', clinicalDischarge, statusCode.OK);

    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateClinical = await this.clinical_dischargeService.update(id, req.body);
    if (!updateClinical) {
      return res.status(statusCode.NOT_FOUND).json({message: 'Clinical discharge not found'});
    }

    res.success('Clinical discharge updated successfully', updateClinical, statusCode.OK);

  } catch (error) {
    next(error);
  }
};

delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteClinical = await this.clinical_dischargeService.delete(id);
    if (!deleteClinical) {
      return res.status(statusCode.NOT_FOUND).json({message: 'Clinical discharge not found'});
    }

    res.success('Clinical discharge deleted successfully', statusCode.OK);

  } catch (error) {
    next(error);
  }
};

}
