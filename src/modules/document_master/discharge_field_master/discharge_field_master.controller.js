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

  search = async (req, res, next) => {
    try {
      const query = req.query;
      const dischargeFields = await this.discharge_field_masterService.search(query);
      res.success("Search results", dischargeFields, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const dischargeField = await this.discharge_field_masterService.create(req.body);
      res.success("Discharge field master created successfully", dischargeField, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };
}
