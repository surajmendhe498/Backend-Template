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

  edit = async (req, res, next) => {
    try {
      const { patientId, admissionId, templateId } = req.params;
      const templateData = req.body;

      const updatedTemplate =
        await this.ot_notes_templateService.editTemplate(patientId, admissionId, templateId, templateData);

      res.success(
        "OT notes template updated successfully",
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

      const result =
        await this.ot_notes_templateService.deleteTemplate(patientId, admissionId, templateId);

      res.success(result.message, null, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
