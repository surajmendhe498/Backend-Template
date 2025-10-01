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
        files: req.files,
        user: req.user
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
      const { patientId, admissionId } = req.params;
      const data = await this.files_recordingsService.getByPatientId(patientId, admissionId);

      res.status(statusCode.OK).json({
        success: true,
        message: admissionId 
          ? `Files for patient ${patientId}, admission ${admissionId} fetched`
          : `Files for patient ${patientId} fetched`,
        data
      });
    } catch (err) {
      next(err);
    }
  };

updateSingleFile = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileId, fieldType, fileName } = req.body;
    const user = req.user;

    if (!patientId || !admissionId) {
      return res.status(400).json({
        success: false,
        message: "patientId and admissionId are required"
      });
    }

    const fileFields = ['docs', 'labReports', 'radiologyReports'];
    if (!fieldType || !fileFields.includes(fieldType)) {
      return res.status(400).json({
        success: false,
        message: `fieldType is required and must be one of: ${fileFields.join(', ')}`
      });
    }

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "fileId is required for file-based updates"
      });
    }

    const fileArray = req.files?.[fieldType];
    const file = fileArray?.[0] || null;

    const fileResult = await this.files_recordingsService.updateSingleFile({
      patientId,
      admissionId,
      fileId,
      file,
      fieldType,
      fileName,
      user
    });

    res.status(200).json({
      success: true,
      message: fileResult.message,
      data: fileResult.updatedFile
    });

  } catch (err) {
    next(err);
  }
};

deleteSingleFile = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileId, fieldType } = req.body;

    if (!patientId || !admissionId || !fileId || !fieldType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patientId, admissionId, fileId, fieldType"
      });
    }

    const result = await this.files_recordingsService.deleteSingleFile({
      patientId,
      admissionId,
      fileId,
      fieldType
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: { fileId }
    });
  } catch (err) {
    next(err);
  }
};

getDocs = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;
    const data = await this.files_recordingsService.getDocs(patientId, admissionId);

    res.status(statusCode.OK).json({
      success: true,
      message: `Docs for patient ${patientId}, admission ${admissionId} fetched`,
      data
    });
  } catch (err) {
    next(err);
  }
};

getLabReports = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;
    const data = await this.files_recordingsService.getLabReports(patientId, admissionId);

    res.status(statusCode.OK).json({
      success: true,
      message: `Lab reports for patient ${patientId}, admission ${admissionId} fetched`,
      data
    });
  } catch (err) {
    next(err);
  }
};

getRadiologyReports = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;
    const data = await this.files_recordingsService.getRadiologyReports(patientId, admissionId);

    res.status(statusCode.OK).json({
      success: true,
      message: `Radiology reports for patient ${patientId}, admission ${admissionId} fetched`,
      data
    });
  } catch (err) {
    next(err);
  }
};

deleteMultipleFiles = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileIds, fieldType } = req.body;

    if (!patientId || !admissionId || !fileIds || !fieldType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patientId, admissionId, fileIds, fieldType"
      });
    }

    const result = await this.files_recordingsService.deleteMultipleFiles({
      patientId,
      admissionId,
      fileIds, // array of file _id
      fieldType
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

moveFileToFolder = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileId, folderId, fileType } = req.body;

    if (!patientId || !admissionId || !fileId || !folderId || !fileType) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "patientId, admissionId, fileId, folderId, and fileType are required",
      });
    }

    const result = await this.files_recordingsService.moveFileToFolder({
      patientId,
      admissionId,
      fileId,
      folderId,
      fileType,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: "File moved to folder successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

sendReportOnWhatsApp = async (req, res, next) => {
  try {
    const { patientId, admissionId, reportType, target, reportId } = req.body;

    if (!patientId || !admissionId || !reportType || !target || !reportId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "patientId, admissionId, reportType, target, and reportId are required",
      });
    }

    const result = await this.files_recordingsService.sendReportOnWhatsApp({
      patientId,
      admissionId,
      reportType,
      target,
      reportId,
    });

    res.status(statusCode.OK).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error("sendReportOnWhatsApp error:", err.message);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

}
