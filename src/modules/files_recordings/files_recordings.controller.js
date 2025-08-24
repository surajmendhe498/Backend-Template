// import Files_recordingsService from "./files_recordings.service.js";
// import { statusCode } from '../../utils/constants/statusCode.js';

// export default class Files_recordingsController {
//   constructor() {
//     this.files_recordingsService = Files_recordingsService;
//   }

//   upload = async (req, res, next) => {
//     try {
//       const { patientId, admissionId, audioLabel, videoLabel } = req.body;

//       if (!patientId || !admissionId) {
//         return res.status(statusCode.BAD_REQUEST).json({
//           success: false,
//           message: 'patientId and admissionId are required'
//         });
//       }

//       const result = await this.files_recordingsService.uploadFiles({
//         patientId,
//         admissionId,
//         files: req.files,
//         labels: { audioLabel, videoLabel }  
//       });

//       res.status(statusCode.OK).json({
//         success: true,
//         message: 'Files uploaded successfully',
//         data: result
//       });
//     } catch (err) {
//       next(err);
//     }
//   };

//   getAll = async (req, res, next) => {
//     try {
//       const data = await this.files_recordingsService.getAll();
//       res.status(statusCode.OK).json({
//         success: true,
//         message: 'All file recordings fetched',
//         data
//       });
//     } catch (err) {
//       next(err);
//     }
//   };

// getByPatientId = async (req, res, next) => {
//   try {
//     const { patientId, admissionId } = req.params;
//     const data = await this.files_recordingsService.getByPatientId(patientId, admissionId);

//     res.status(statusCode.OK).json({
//       success: true,
//       message: admissionId 
//         ? `Files for patient ${patientId}, admission ${admissionId} fetched`
//         : `Files for patient ${patientId} fetched`,
//       data
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// updateSingleFile = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, fileId, fieldType, audioLabel, videoLabel } = req.body;

//     if (!patientId || !admissionId || !fileId || !fieldType) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: patientId, admissionId, fileId, fieldType"
//       });
//     }

//     const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
//     if (!validFields.includes(fieldType)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid fieldType. Must be one of: ${validFields.join(', ')}`
//       });
//     }

//     const fileArray = req.files?.[fieldType];
//     const file = fileArray?.[0];
//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: `No file uploaded in ${fieldType} field`
//       });
//     }

//     // pick correct label
//     let label = null;
//     if (fieldType === "audioRecordings") label = audioLabel;
//     if (fieldType === "videoRecordings") label = videoLabel;

//     const result = await this.files_recordingsService.updateSingleFile({
//       patientId,
//       admissionId,
//       fileId,
//       file,
//       fieldType,
//       label
//     });

//     res.status(200).json({
//       success: true,
//       message: result.message,
//       data: result.updatedFile
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// deleteSingleFile = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, fileId, fieldType } = req.body;

//     if (!patientId || !admissionId || !fileId || !fieldType) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: patientId, admissionId, fileId, fieldType"
//       });
//     }

//     const result = await this.files_recordingsService.deleteSingleFile({
//       patientId,
//       admissionId,
//       fileId,
//       fieldType
//     });

//     res.status(200).json({
//       success: true,
//       message: result.message,
//       data: { fileId }
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// }


import Files_recordingsService from "./files_recordings.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class Files_recordingsController {
  constructor() {
    this.files_recordingsService = Files_recordingsService;
  }

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

//     if (!patientId || !admissionId || !fileId || !fieldType) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: patientId, admissionId, fileId, fieldType"
//       });
//     }

//     const validFields = ['docs', 'labReports', 'audioRecordings', 'videoRecordings'];
//     if (!validFields.includes(fieldType)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid fieldType. Must be one of: ${validFields.join(', ')}`
//       });
//     }

//     const fileArray = req.files?.[fieldType];
//     const file = fileArray?.[0];
//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: `No file uploaded in ${fieldType} field`
//       });
//     }

//     // pick correct label
//     let label = null;
//     if (fieldType === "audioRecordings") label = audioLabel;
//     if (fieldType === "videoRecordings") label = videoLabel;

//     const result = await this.files_recordingsService.updateSingleFile({
//       patientId,
//       admissionId,
//       fileId,
//       file,
//       fieldType,
//       label
//     });

//     res.status(200).json({
//       success: true,
//       message: result.message,
//       data: result.updatedFile
//     });
//   } catch (err) {
//     next(err);
//   }
// };

updateSingleFile = async (req, res, next) => {
  try {
    const { patientId, admissionId, fileId, fieldType, audioLabel, videoLabel } = req.body;

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
    const file = fileArray?.[0] || null;

    // pick correct label
    let label = null;
    if (fieldType === "audioRecordings") label = audioLabel;
    if (fieldType === "videoRecordings") label = videoLabel;

    const result = await this.files_recordingsService.updateSingleFile({
      patientId,
      admissionId,
      fileId,
      file,
      fieldType,
      label,
      user: req.user  // ✅ pass logged-in user
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


}
