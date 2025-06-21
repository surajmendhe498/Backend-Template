import Ot_masterService from "./ot_master.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Ot_masterController {
  constructor() {
    this.ot_masterService = Ot_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const otMasters = await this.ot_masterService.getAll();
      res.success("Fetched all OT masters", otMasters, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const otMaster = await this.ot_masterService.create(req.body);
      res.success("OT Master created successfully", otMaster, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };
}
