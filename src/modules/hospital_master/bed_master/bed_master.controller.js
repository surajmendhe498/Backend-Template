import Bed_masterService from "./bed_master.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Bed_masterController {
  constructor() {
    this.bed_masterService = Bed_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const beds = await this.bed_masterService.getAll();
      if(beds.length == 0){
        res.status(statusCode.NOT_FOUND).json({message: 'Beds not found'});
      }
      res.success("Retrieved all beds", beds, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const bedData = req.body;
      const bed = await this.bed_masterService.create(bedData);
      res.success("Bed created successfully", bed, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedBed = await this.bed_masterService.update(id, updatedData);

      if (!updatedBed) {
        res.fail("Bed not found", statusCode.NOT_FOUND);
        return;
      }

      res.success("Bed updated successfully", updatedBed, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getVacantBeds = async (req, res, next) => {
    try {
      const beds = await this.bed_masterService.getBedsByStatus('Vacant');
      res.success("Retrieved vacant beds", beds, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getOccupiedBeds = async (req, res, next) => {
    try {
      const beds = await this.bed_masterService.getBedsByStatus('Occupied');
      res.success("Retrieved occupied beds", beds, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getUnderMaintainanceBed = async (req, res, next) => {
    try {
      const beds = await this.bed_masterService.getBedsByStatus('Under Maintenance');

      if(beds.length == 0){
        res.status(statusCode.NOT_FOUND).json({message: 'Under Maintenance beds not found'});
      }

      res.success("Retrieved occupied beds", beds, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    try {
      const query = req.query;
      const beds = await this.bed_masterService.search(query);
      res.success("Search results", beds, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
