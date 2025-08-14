import Files_recordingsService from "./files_recordings.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class Files_recordingsController {
  constructor() {
    this.files_recordingsService = Files_recordingsService;
  }

  upload = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.body;

      if (!patientId || !admissionId) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: 'patientId and admissionId are required'
        });
      }

      const result = await this.files_recordingsService.uploadFiles({
        patientId,
        admissionId,
        files: req.files
      });

      res.status(statusCode.OK).json({
        success: true,
        message: 'Files uploaded successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await this.files_recordingsService.getAll();
      res.status(statusCode.OK).json({
        success: true,
        message: 'All file recordings fetched',
        data
      });
    } catch (err) {
      next(err);
    }
  };

  getByPatientId = async (req, res, next) => {
    try {
      const { patientId } = req.params;
      const data = await this.files_recordingsService.getByPatientId(patientId);
      res.status(statusCode.OK).json({
        success: true,
        message: `Files for patient ${patientId} fetched`,
        data
      });
    } catch (err) {
      next(err);
    }
  };
}
