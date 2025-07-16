import Discharge_field_masterService from "./discharge_field_master.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Discharge_field_masterController {
  constructor() {
    this.discharge_field_masterService = Discharge_field_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const dischargeFields = await this.discharge_field_masterService.getAll();
      res.success("Fetched all discharge field masters", dischargeFields, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  updateField = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { summarySection, status } = req.body;

      // if (!summarySection || !status) {
      //   return res.fail("Both summarySection and status are required", statusCode.BAD_REQUEST);
      // }

      const updated = await this.discharge_field_masterService.update(id, { summarySection, status });

      if (!updated) {
        return res.fail("Discharge field not found", statusCode.NOT_FOUND);
      }

      res.success("Discharge field updated successfully", updated, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
