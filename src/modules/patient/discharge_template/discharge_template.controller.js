import Discharge_templateService from "./discharge_template.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Discharge_templateController {
  constructor() {
    this.discharge_templateService =  Discharge_templateService;
  }

  add = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;   
      const templateData = req.body;                  

      const dischargeTemplates =
        await this.discharge_templateService.addDischargeTemplate(
          patientId,
          admissionId,
          templateData
        );

      res.success(
        "Discharge template added successfully",
        dischargeTemplates,
        statusCode.CREATED
      );
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;

      const dischargeTemplates =
        await this.discharge_templateService.getAllTemplates(patientId, admissionId);

      res.success(
        "Fetched discharge templates successfully",
        dischargeTemplates,
        statusCode.OK
      );
    } catch (err) {
      next(err);
    }
  };
  
}
