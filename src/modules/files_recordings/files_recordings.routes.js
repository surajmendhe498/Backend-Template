import { Router } from 'express';
import Files_recordingsController from './files_recordings.controller.js';
import uploadFilesAndRecordings from '../../helpers/fileRecording.upload.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = Router();
const files_recordingsController = new Files_recordingsController();

router.post('/upload', authenticate, uploadFilesAndRecordings, files_recordingsController.upload);
router.get('/', files_recordingsController.getAll);
router.get('/:patientId/:admissionId', files_recordingsController.getByPatientId);
router.put('/update', uploadFilesAndRecordings, files_recordingsController.updateSingleFile);
router.delete('/delete', files_recordingsController.deleteSingleFile);
router.delete('/delete-multiple', files_recordingsController.deleteMultipleFiles);


router.get('/:patientId/:admissionId/docs', files_recordingsController.getDocs);
router.get('/:patientId/:admissionId/labReports', files_recordingsController.getLabReports);
router.get('/:patientId/:admissionId/radiologyReports', files_recordingsController.getRadiologyReports);
router.get('/:patientId/:admissionId/audioRecordings', files_recordingsController.getAudioRecordings);
router.get('/:patientId/:admissionId/videoRecordings', files_recordingsController.getVideoRecordings);


export default router;
