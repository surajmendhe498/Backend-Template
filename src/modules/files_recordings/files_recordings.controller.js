import Files_recordingsService from "./files_recordings.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class Files_recordingsController {
  constructor() {
    this.files_recordingsService = Files_recordingsService;
  }

  // upload = async (req, res, next) => {
  //   try {
  //     const { patientId, admissionId, audioLabel, videoLabel, clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData } = req.body;

  //     if (!patientId || !admissionId) {
  //       return res.status(statusCode.BAD_REQUEST).json({
  //         success: false,
  //         message: 'patientId and admissionId are required'
  //       });
  //     }

  //     const result = await this.files_recordingsService.uploadFiles({
  //       patientId,
  //       admissionId,
  //       files: req.files,
  //       labels: { audioLabel, videoLabel },
  //       notes: { clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData },
  //       user: req.user  
  //     });

  //     res.status(statusCode.OK).json({
  //       success: true,
  //       message: 'Files uploaded successfully',
  //       data: result
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  upload = async (req, res, next) => {
    try {
      const { patientId, admissionId, audioLabel, videoLabel } = req.body;

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
        labels: { audioLabel, videoLabel },
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

// updateSingleFile = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, fileId, fieldType, audioLabel, videoLabel } = req.body;
//     const user = req.user;

//     if (!patientId || !admissionId) {
//       return res.status(400).json({
//         success: false,
//         message: "patientId and admissionId are required"
//       });
//     }

//     const fileFields = ['docs', 'labReports', 'radiologyReports', 'audioRecordings', 'videoRecordings'];

//     if (!fieldType || !fileFields.includes(fieldType)) {
//       return res.status(400).json({
//         success: false,
//         message: `fieldType is required and must be one of: ${fileFields.join(', ')}`
//       });
//     }

//     if (!fileId) {
//       return res.status(400).json({
//         success: false,
//         message: "fileId is required for file-based updates"
//       });
//     }

//     const fileArray = req.files?.[fieldType];
//     const file = fileArray?.[0] || null;

//     let label = null;
//     if (fieldType === "audioRecordings") label = audioLabel;
//     if (fieldType === "videoRecordings") label = videoLabel;

//     const fileResult = await this.files_recordingsService.updateSingleFile({
//       patientId,
//       admissionId,
//       fileId,
//       file,
//       fieldType,
//       label,
//       user
//     });

//     res.status(200).json({
//       success: true,
//       message: fileResult.message,
//       data: fileResult.updatedFile
//     });

//   } catch (err) {
//     next(err);
//   }
// };

updateSingleFile = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileId, fieldType, audioLabel, videoLabel, fileName } = req.body;
    const user = req.user;

    if (!patientId || !admissionId) {
      return res.status(400).json({
        success: false,
        message: "patientId and admissionId are required"
      });
    }

    const fileFields = ['docs', 'labReports', 'radiologyReports', 'audioRecordings', 'videoRecordings'];
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

    let label = null;
    if (fieldType === "audioRecordings") label = audioLabel;
    if (fieldType === "videoRecordings") label = videoLabel;

    const fileResult = await this.files_recordingsService.updateSingleFile({
      patientId,
      admissionId,
      fileId,
      file,
      fieldType,
      label,
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

getAudioRecordings = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;
    const data = await this.files_recordingsService.getAudioRecordings(patientId, admissionId);

    res.status(statusCode.OK).json({
      success: true,
      message: `Audio recordings for patient ${patientId}, admission ${admissionId} fetched`,
      data
    });
  } catch (err) {
    next(err);
  }
};

getVideoRecordings = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;
    const data = await this.files_recordingsService.getVideoRecordings(patientId, admissionId);

    res.status(statusCode.OK).json({
      success: true,
      message: `Video recordings for patient ${patientId}, admission ${admissionId} fetched`,
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

updateSpecificNote = async (req, res, next) => {
  try {
    const { patientId, admissionId, field, noteId, newNote } = req.body;

    if (!patientId || !admissionId || !field || !noteId || !newNote) {
      return res.status(400).json({
        success: false,
        message: "patientId, admissionId, field, noteId, and newNote are required"
      });
    }

    const result = await this.files_recordingsService.updateSpecificNote({
      patientId,
      admissionId,
      field,
      noteId,
      newNote,
      user: req.user
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.updatedNote
    });

  } catch (err) {
    next(err);
  }
};


}
