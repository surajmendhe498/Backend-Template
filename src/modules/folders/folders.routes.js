import { Router } from 'express';
import FoldersController from './folders.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import uploadAudioVideoRec from '../../helpers/audio-video-rec.upload.js';
import uploadFiles from '../../helpers/files.upload.js';

const router = Router();
const foldersController = new FoldersController();

router.post('/', foldersController.createFolder);
router.get('/', foldersController.getAll);
router.get("/:patientId/:admissionId/:type", foldersController.getAllFoldersByPatientAndAdmission); 

router.put("/rename", foldersController.renameFileInFolder);
router.delete("/delete", foldersController.deleteFileFromFolder);
router.put("/update-rec", uploadAudioVideoRec, foldersController.updateRecordingFile);
router.put("/update-file", uploadFiles, foldersController.updateFile);

export default router;
