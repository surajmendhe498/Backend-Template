import Ipd_patient_detailsService from "./ipd_patient_details.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Ipd_patient_detailsController {
  constructor() {
    this.ipd_patient_detailsService = Ipd_patient_detailsService;
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;
      const createdRecord = await this.ipd_patient_detailsService.create(data);
      res.success("IPD Patient Details created successfully", createdRecord, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const records = await this.ipd_patient_detailsService.getAll();
      res.success("Fetched all IPD Patient Details", records, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
