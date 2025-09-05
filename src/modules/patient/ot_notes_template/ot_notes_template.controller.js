import Ot_notes_templateService from "./ot_notes_template.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Ot_notes_templateController {
  constructor() {
    this.ot_notes_templateService =  Ot_notes_templateService;
  }

  add = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const templateData = req.body;

      const newTemplate = await this.ot_notes_templateService.addTemplate(
        patientId,
        admissionId,
        templateData
      );

      res.success(
        "OT notes template added successfully",
        newTemplate,
        statusCode.CREATED
      );
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;

      const templates =
        await this.ot_notes_templateService.getAllTemplates(patientId, admissionId);

      res.success(
        "Fetched OT notes templates successfully",
        templates,
        statusCode.OK
      );
    } catch (err) {
      next(err);
    }
  };
}
