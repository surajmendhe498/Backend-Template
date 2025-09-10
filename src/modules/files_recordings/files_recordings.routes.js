import { Router } from 'express';
import Files_recordingsController from './files_recordings.controller.js';
import uploadFiles from '../../helpers/files.upload.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = Router();
const files_recordingsController = new Files_recordingsController();

router.post('/upload', authenticate, uploadFiles, files_recordingsController.upload);
router.get('/', files_recordingsController.getAll);
router.get('/:patientId/:admissionId', files_recordingsController.getByPatientId);
router.put('/update', authenticate, uploadFiles, files_recordingsController.updateSingleFile);
router.delete('/delete', files_recordingsController.deleteSingleFile);
router.delete('/delete-multiple', files_recordingsController.deleteMultipleFiles);
router.put("/move-file", files_recordingsController.moveFileToFolder);


router.get('/:patientId/:admissionId/docs', files_recordingsController.getDocs);
router.get('/:patientId/:admissionId/labReports', files_recordingsController.getLabReports);
router.get('/:patientId/:admissionId/radiologyReports', files_recordingsController.getRadiologyReports);
router.post("/send-whatsapp", files_recordingsController.sendReportOnWhatsApp);

export default router;
