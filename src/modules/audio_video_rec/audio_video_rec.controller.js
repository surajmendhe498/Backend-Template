import Audio_video_recService from "./audio_video_rec.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class Audio_video_recController {
  constructor() {
    this.audio_video_recService =  Audio_video_recService;
  }

  uploadFiles = async (req, res, next) => {
    try {
      const { patientId, admissionId, audioLabel, videoLabel } = req.body;
      const files = req.files;
      const user = req.user;

      if (!patientId || !admissionId) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: 'patientId and admissionId are required'
        });
      }

      const result = await this.audio_video_recService.uploadFiles({
        patientId,
        admissionId,
        files,
        labels: { audioLabel, videoLabel },
        user
      });

      res.status(statusCode.OK).json({
        success: true,
        message: 'Audio/Video recordings uploaded successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  };

  getByPatientId = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.audio_video_recService.getByPatientId(patientId, admissionId);

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

  getAudioRecordings = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;

      if (!patientId || !admissionId) {
        return res.status(statusCode.BAD_REQUEST).json({success: false, message: "patientId and admissionId are required"});
      }

      const data = await this.audio_video_recService.getAudioRecordings(patientId, admissionId);

      res.status(statusCode.OK).json({success: true, message: `Audio recordings for patient ${patientId}, admission ${admissionId} fetched`, data});
    } catch (err) {
      next(err);
    }
  };

  getVideoRecordings = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;

      if (!patientId || !admissionId) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "patientId and admissionId are required"
        });
      }

      const data = await this.audio_video_recService.getVideoRecordings(patientId, admissionId);

      res.status(statusCode.OK).json({success: true,message: `Video recordings for patient ${patientId}, admission ${admissionId} fetched`,data});
    } catch (err) {
      next(err);
    }
  };

  deleteRecording = async (req, res, next) => {
  try {
    const { patientId, admissionId, recordingId, type } = req.body;

    if (!patientId || !admissionId || !recordingId || !type) {
      return res.status(400).json({
        success: false,
        message: "patientId, admissionId, recordingId and type are required",
      });
    }

    const result = await this.audio_video_recService.deleteRecording({
      patientId,
      admissionId,
      recordingId,
      type,
    });

    return res.status(200).json({
      success: true,
      message: result.message, 
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

updateRecording = async (req, res, next) => {
  try {
    const { patientId, admissionId, recordingId, type, label } = req.body;
    const file = req.files?.audioRecordings?.[0] || req.files?.videoRecordings?.[0] || null;
    const user = req.user;

    if (!patientId || !admissionId || !recordingId || !type) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: 'patientId, admissionId, recordingId and type are required'
      });
    }

    const result = await this.audio_video_recService.updateRecording({
      patientId,
      admissionId,
      recordingId,
      type,
      updates: { label },
      file,
      user
    });

    res.status(statusCode.OK).json({
      success: true,
      message: 'Recording updated successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

editRecordingName = async (req, res, next) => {
  try {
    const { patientId, admissionId, recordingId, type, newName } = req.body;

    const user = req.user;

    const result = await this.audio_video_recService.editRecordingName({
      patientId,
      admissionId,
      recordingId,
      type,
      newName,
      user
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


moveFileToFolder = async (req, res) => {
    try {
      const { patientId, admissionId, fileId, folderId, fileType } = req.body;

      if (!patientId || !admissionId || !fileId || !folderId || !fileType) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: 'All fields are required: patientId, admissionId, fileId, folderId, fileType',
        });
      }

      const folder = await this.audio_video_recService.moveFileToFolder({
        patientId,
        admissionId,
        fileId,
        folderId,
        fileType,
      });

      return res.status(statusCode.OK).json({
        success: true,
        message: 'File moved to folder successfully',
        data: folder,
      });
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  };

}
