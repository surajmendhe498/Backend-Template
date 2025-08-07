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
        admissionId,
        currentFloor,
        currentBed,
        newFloor,
        newBed,
        transferDate,
        transferTime,
      } = req.body;

      const result = await this.transfer_patientService.transferPatient(id, {
        admissionId,
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

  getTransferHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transfers = await this.transfer_patientService.getTransferHistoryByPatientId(id);

    res.success("Transfer history fetched successfully", transfers, statusCode.OK);
  } catch (err) {
    next(err);
  }
};


getTransferHistoryByPatientAndAdmission = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;

    const history = await this.transfer_patientService.getTransferHistoryByPatientAndAdmission(patientId, admissionId);

    if (!history.length) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No transfer history found for this patient and admission",
        data: [],
      });
    }

    res.success("Transfer history fetched successfully", history, statusCode.OK);
  } catch (err) {
    res.fail("Error fetching transfer history", err.message, statusCode.INTERNAL_SERVER_ERROR);
  }
};



}
