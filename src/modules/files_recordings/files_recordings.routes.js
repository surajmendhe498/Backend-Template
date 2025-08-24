import { Router } from 'express';
import Files_recordingsController from './files_recordings.controller.js';
import uploadFilesAndRecordings from '../../helpers/fileRecording.upload.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = Router();
const files_recordingsController = new Files_recordingsController();

router.post('/upload', authenticate, uploadFilesAndRecordings, files_recordingsController.upload);
router.get('/', files_recordingsController.getAll);
router.get('/:patientId/:admissionId', files_recordingsController.getByPatientId);
router.put('/update', authenticate, uploadFilesAndRecordings, files_recordingsController.updateSingleFile);
router.delete('/delete', files_recordingsController.deleteSingleFile);


export default router;
