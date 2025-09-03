import { Router } from 'express';
import Audio_video_recController from './audio_video_rec.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import uploadAudioVideoRec from '../../helpers/audio-video-rec.upload.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = Router();
const audio_video_recController = new Audio_video_recController();

router.post('/upload', authenticate, uploadAudioVideoRec,  audio_video_recController.uploadFiles);
router.get('/:patientId/:admissionId', audio_video_recController.getByPatientId);
router.delete('/delete', audio_video_recController.deleteRecording);
router.put('/update', authenticate, uploadAudioVideoRec, audio_video_recController.updateRecording);
router.put('/edit', authenticate, audio_video_recController.editRecordingName); // rename file feature


router.get('/:patientId/:admissionId/audioRecordings', audio_video_recController.getAudioRecordings);
router.get('/:patientId/:admissionId/videoRecordings', audio_video_recController.getVideoRecordings);

router.put("/move-file", audio_video_recController.moveFileToFolder);


export default router;
