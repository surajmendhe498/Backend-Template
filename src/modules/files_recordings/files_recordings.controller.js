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

updateSingleFile = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileId, fieldType } = req.body;

    if (!patientId || !admissionId || !fileId || !fieldType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patientId, admissionId, fileId, fieldType"
      });
    }

    const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
    if (!validFields.includes(fieldType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid fieldType. Must be one of: ${validFields.join(', ')}`
      });
    }

    const fileArray = req.files?.[fieldType];
    const file = fileArray?.[0];
    if (!file) {
      return res.status(400).json({
        success: false,
        message: `No file uploaded in ${fieldType} field`
      });
    }

    const result = await this.files_recordingsService.updateSingleFile({
      patientId,
      admissionId,
      fileId,
      file,
      fieldType
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.updatedFile
    });
  } catch (err) {
    next(err);
  }
};


}
