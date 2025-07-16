import Transfer_patientService from "./transfer_patient.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Transfer_patientController {
  constructor() {
    this.transfer_patientService = Transfer_patientService;
  }

  transfer = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        currentFloor,
        currentBed,
        newFloor,
        newBed,
        transferDate,
        transferTime,
      } = req.body;

      const result = await this.transfer_patientService.transferPatient(id, {
        currentFloor,
        currentBed,
        newFloor,
        newBed,
        transferDate,
        transferTime,
      });

      res.success("Patient transferred successfully", result, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const patients = await this.transfer_patientService.getTransferredPatients();

      if (!patients.length) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "No transferred patients found",
        });
      }

      res.success("Transferred patients fetched successfully", patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
