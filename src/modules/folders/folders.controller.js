import FoldersService from "./folders.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class FoldersController {
  constructor() {
    this.foldersService =  FoldersService;
  }

  getAll = async (req, res, next) => {
    try {
      const folders = await this.foldersService.getAll();
      res.success("Folders fetched successfully", folders, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  createFolder = async (req, res) => {
    try {
      const {name, type, patientId, admissionId } = req.body;

      if (!name || !type || !patientId || !admissionId) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: 'All fields are required: type, patientId, admissionId',
        });
      }

      const folder = await this.foldersService.createFolder({name, type, patientId, admissionId });

      return res.status(statusCode.CREATED).json({
        success: true,
        message: 'Folder created successfully',
        data: folder,
      });
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllFoldersByPatientAndAdmission = async (req, res) => {
    try {
      const { patientId, admissionId, type  } = req.params;
      const folders = await this.foldersService.getAllFoldersByPatientAndAdmission(patientId, admissionId, type);

      return res.status(statusCode.OK).json({
        success: true,
        message: "Folders fetched successfully",
        data: folders
      });
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  };


  renameFileInFolder = async (req, res) => {
  try {
    const { folderId, fileId, newName } = req.body;

    if (!folderId || !fileId || !newName) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "folderId, fileId, and newName are required",
      });
    }

    const updatedFile = await this.foldersService.renameFileInFolder({
      folderId,
      fileId,
      newName
    });

    return res.status(statusCode.OK).json({
      success: true,
      message: "File renamed successfully",
      data: updatedFile
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

deleteFileFromFolder = async (req, res) => {
  try {
    const { folderId, fileId } = req.body;

    if (!folderId || !fileId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "folderId and fileId are required",
      });
    }

    const deletedFile = await this.foldersService.deleteFileFromFolder({
      folderId,
      fileId
    });

    return res.status(statusCode.OK).json({
      success: true,
      message: "File deleted successfully",
      data: deletedFile
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

updateRecordingFile = async (req, res) => {
  try {
    const { folderId, fileId, label, duration } = req.body;

    if (!folderId || !fileId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "folderId and fileId are required",
      });
    }

    // detect uploaded file
    const file =
      (req.files?.audioRecordings && req.files.audioRecordings[0]) ||
      (req.files?.videoRecordings && req.files.videoRecordings[0]);

    const updatedFile = await this.foldersService.updateRecordingFile({
      folderId,
      fileId,
      label,
      duration,
      file,
    });

    return res.status(statusCode.OK).json({
      success: true,
      message: "Recording file updated successfully",
      data: updatedFile,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

updateFile = async (req, res) => {
  try {
    const { folderId, fileId } = req.body;

    if (!folderId || !fileId) {
      return res.status(400).json({
        success: false,
        message: "folderId and fileId are required",
      });
    }

    // Detect uploaded file
    const file =
      req.files?.docs?.[0] ||
      req.files?.labReports?.[0] ||
      req.files?.radiologyReports?.[0];

    const updatedFile = await this.foldersService.updateFile({
      folderId,
      fileId,
      file,
    });

    res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: updatedFile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


};