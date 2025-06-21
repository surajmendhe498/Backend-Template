import Lab_masterService from './lab_master.service.js';
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Lab_masterController {
  constructor() {
    this.lab_masterService = Lab_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const labs = await this.lab_masterService.getAll();
      res.success("Fetched all lab masters", labs, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newLab = await this.lab_masterService.create(req.body);
      res.success("Lab master created successfully", newLab, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedLab = await this.lab_masterService.update(id, req.body);
      if (!updatedLab) {
        return res.fail("Lab master not found", statusCode.NOT_FOUND);
      }
      res.success("Lab master updated successfully", updatedLab, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    try {
      const filters = req.query;
      const labs = await this.lab_masterService.search(filters);
      res.success("Search results fetched successfully", labs, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
