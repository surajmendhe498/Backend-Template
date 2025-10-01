import Discharge_templateService from "./discharge_template.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Discharge_templateController {
  constructor() {
    this.discharge_templateService =  Discharge_templateService;
  }

 add = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const { type, ...templateData } = req.body; // Expect type: 'provisional' or 'final'

      if (!type || !['provisional', 'final'].includes(type)) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Template type must be 'provisional' or 'final'"
        });
      }

      const dischargeTemplate =
        await this.discharge_templateService.addDischargeTemplate(
          patientId,
          admissionId,
          templateData,
          type
        );

      res.success(
        "Discharge template added successfully",
        dischargeTemplate,
        statusCode.CREATED
      );
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const { type } = req.query; // optional query param

      const dischargeTemplates =
        await this.discharge_templateService.getAllTemplates(
          patientId,
          admissionId,
          type
        );

      res.success(
        "Fetched discharge templates successfully",
        dischargeTemplates,
        statusCode.OK
      );
    } catch (err) {
      next(err);
    }
  };

  edit = async (req, res, next) => {
  try {
    const { patientId, admissionId, templateId } = req.params;
    const { type, ...templateData } = req.body;  // type optional

    const updatedTemplate =
      await this.discharge_templateService.editTemplate(
        patientId,
        admissionId,
        templateId,
        templateData,
        type
      );

    res.success(
      "Discharge template updated successfully",
      updatedTemplate,
      statusCode.OK
    );
  } catch (err) {
    next(err);
  }
};


  delete = async (req, res, next) => {
    try {
      const { patientId, admissionId, templateId } = req.params;

      const result = await this.discharge_templateService.deleteTemplate(
        patientId,
        admissionId,
        templateId
      );

      res.success("Discharge template deleted successfully", result, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
  
}
