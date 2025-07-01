import Ipd_patient_detailsService from "./ipd_patient_details.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Ipd_patient_detailsController {
  constructor() {
    this.ipd_patient_detailsService = Ipd_patient_detailsService;
  }

getFilteredIpdPatients = async (req, res, next) => {
    try {
      const filters = {
        patientStatus: req.query.patientStatus,
        admissionDate: req.query.admissionDate,
        consultant: req.query.consultant,
        floorDetails: req.query.floorDetails,
      };

      const patients = await this.ipd_patient_detailsService.getFilteredIpdPatients(filters);

      res.success('Fetched filtered IPD patients successfully', patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

}
