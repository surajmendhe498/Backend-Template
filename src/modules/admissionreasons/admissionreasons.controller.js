import AdmissionreasonsService from "./admissionreasons.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class AdmissionreasonsController {
  constructor() {
    this.admissionreasonsService = AdmissionreasonsService;
  }

  getAll = async (req, res, next) => {
    try {
      // Ensure seed data exists (runs only once)
      await this.admissionreasonsService.seedIfEmpty();

      const reasons = await this.admissionreasonsService.getAll();
      res.success("Admission reasons fetched successfully", reasons, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
