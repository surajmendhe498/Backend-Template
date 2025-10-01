import { Router } from 'express';
import PatientController from './patient.controller.js';
import validate from '../../middlewares/default/validate.js';
import {uploadPatientAndIdentityImages } from '../../helpers/upload.js';


const router = Router();
const patientController = new PatientController();

router.post('/',uploadPatientAndIdentityImages, patientController.create);
router.get('/ipd-patients', patientController.getIPDPatients);
router.get('/count-by-department', patientController.getPatientCountByDepartment);
router.get('/cancelled-admissions', patientController.getCancelledAdmissions);
router.get('/', patientController.getAll);
router.delete('/:id', patientController.delete);
router.get('/:id', patientController.getById);
router.put('/:id',uploadPatientAndIdentityImages, patientController.update);
router.post('/assign-bed', patientController.assignBed);
router.post('/exchange-patients', patientController.exchangePatients);
router.get("/:patientId/:admissionId/report-counts", patientController.getAdmissionReportCounts);
router.get('/:patientId/ipd-admissions', patientController.getIPDAdmissionsByPatientId);
router.post('/cancel-admission/:patientId/:admissionId', patientController.cancelAdmission);

export default router;
