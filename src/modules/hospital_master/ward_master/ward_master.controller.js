import Ward_masterService from "./ward_master.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Ward_masterController {
  constructor() {
    this.ward_masterService = Ward_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const wards = await this.ward_masterService.getAll();
      res.success("Get All Wards", wards, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const ward = await this.ward_masterService.getById(req.params.id);
      if (!ward) return res.fail("Ward not found", statusCode.NOT_FOUND);
      res.success("Get Ward By ID", ward, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newWard = await this.ward_masterService.create(req.body);
      res.success("Ward Created Successfully", newWard, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const updated = await this.ward_masterService.update(req.params.id, req.body);
      if (!updated) return res.fail("Ward not found", statusCode.NOT_FOUND);
      res.success("Ward Updated Successfully", updated, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deleted = await this.ward_masterService.delete(req.params.id);
      if (!deleted) return res.fail("Ward not found", statusCode.NOT_FOUND);
      res.success("Ward Deleted Successfully", deleted, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
