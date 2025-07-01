import Patient_masterService from "./patient_master.service.js";
import { statusCode } from "../../utils/constants/statusCode.js";

export default class Patient_masterController {
  constructor() {
    this.patient_masterService = Patient_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const filters = req.query; 
      const patients = await this.patient_masterService.getAll(filters);

      if (patients.length === 0) {
        return res
          .status(statusCode.NOT_FOUND)
          .json({ message: "No patients found." });
      }

      res.success("Fetched all patients successfully", patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}



