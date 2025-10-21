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
      const { name, status } = req.body;

      const updated = await this.discharge_field_masterService.update(id, { name, status });

      if (!updated) {
        return res.fail("Discharge field not found", statusCode.NOT_FOUND);
      }

      res.success("Discharge field updated successfully", updated, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const dischargeField = await this.discharge_field_masterService.delete(req.params.id);
      if(!dischargeField){
        return res.status(statusCode.NOT_FOUND).json({message: 'Discharge field master not found'});
      }
      res.success(" Discharge field master deleted successfully", statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

}
