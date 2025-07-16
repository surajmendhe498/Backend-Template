import Admission_form_masterService from "./admission_form_master.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Admission_form_masterController {
  constructor() {
    this.admission_form_masterService = Admission_form_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      await this.admission_form_masterService.seedIfEmpty();
      const fields = await this.admission_form_masterService.getAll();
      res.success("Admission form fields fetched successfully", fields, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

// updateField = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const field = await this.admission_form_masterService.getById(id);
//     if (!field) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         message: "Field not found"
//       });
//     }

//     const toggledValue = !field.isSelected;

//     const updated = await this.admission_form_masterService.updateField(id, toggledValue);
//     res.success("Admission form field toggled successfully", updated, statusCode.OK);
//   } catch (err) {
//     next(err);
//   }
// };

updateField = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const field = await this.admission_form_masterService.getById(id);
      if (!field) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Field not found"
        });
      }

      const updated = await this.admission_form_masterService.updateField(id, updateData);
      res.success("Admission form field updated successfully", updated, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
  
}
