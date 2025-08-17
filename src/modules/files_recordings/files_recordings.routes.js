import { Router } from 'express';
import Files_recordingsController from './files_recordings.controller.js';
import uploadFilesAndRecordings from '../../helpers/fileRecording.upload.js';


const router = Router();
const files_recordingsController = new Files_recordingsController();

router.post('/upload', uploadFilesAndRecordings, files_recordingsController.upload);
router.get('/', files_recordingsController.getAll);
router.get('/:patientId', files_recordingsController.getByPatientId);
router.put('/update', uploadFilesAndRecordings, files_recordingsController.updateSingleFile);



export default router;
