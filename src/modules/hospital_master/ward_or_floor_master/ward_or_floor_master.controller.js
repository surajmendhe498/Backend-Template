import Ward_or_floor_masterService from "./ward_or_floor_master.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Word_or_floor_masterController {
  constructor() {
    this.ward_or_floor_masterService = Ward_or_floor_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const floors = await this.ward_or_floor_masterService.getAll();
      res.success("Retrieved all floors", floors, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const floorData = req.body;
      const newFloor = await this.ward_or_floor_masterService.create(floorData);

      res.success("Floor created successfully", newFloor, statusCode.CREATED);

    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const updatedData = req.body; 

      const updatedFloor = await this.ward_or_floor_masterService.update(id, updatedData);

      if (!updatedFloor) {
        res.fail("Floor not found", statusCode.NOT_FOUND);
        return;
      }

      res.success("Floor updated successfully", updatedFloor, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

 delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFloor = await this.ward_or_floor_masterService.delete(id);

    if (!deletedFloor) {
      res.fail("Floor not found", statusCode.NOT_FOUND);
      return;
    }

    res.success("Floor deleted successfully", deletedFloor, statusCode.OK);
  } catch (err) {
    next(err);
  }
};

  search = async (req, res, next) => {
    try {
      const query = req.query; 
      const floors = await this.ward_or_floor_masterService.search(query);
      res.success("Search results", floors, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
