import express from 'express';
import cors from 'cors';

import notFound from './middlewares/default/notFound.js';
import errorHandler from './middlewares/default/errorHandler.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { responseFormatter } from './middlewares/default/responseFormater.js';
import connectDB from './config/db.js';

import compression from 'compression';
 
const app = express();

app.use(express.json());

import patientRoutes from './modules/patient/patient.routes.js';
import patientMasterRoutes from './modules/patient_master/patient_master.routes.js';
import IpdPatientDetailsRoutes from './modules/patient_master/ipd_patient_details/ipd_patient_details.routes.js';
import BedMasterRoutes from './modules/hospital_master/bed_master/bed_master.routes.js';
import FloorMasterRoutes from './modules/hospital_master/word_or_floor_master/word_or_floor_master.routes.js';
import LabMasterRoutes from './modules/hospital_master/lab_master/lab_master.routes.js';
import OtMasterRoutes from './modules/hospital_master/ot_master/ot_master.routes.js';
import AdmissionFormRoutes from './modules/document_master/admission_form_master/admission_form_master.routes.js';
import DischargeTemplateRoute from './modules/document_master/discharge_template/discharge_template.routes.js';
import OtNotesTemplateRoute from './modules/document_master/ot_notes_template/ot_notes_template.routes.js';

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(compression());


connectDB();

app.use(responseFormatter); 

app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/patient-master', patientMasterRoutes);
app.use('/api/v1/patient-master/ipd-patient', IpdPatientDetailsRoutes);
app.use('/api/v1/hospital-master/bed-master', BedMasterRoutes);
app.use('/api/v1/hospital-master/floor-master', FloorMasterRoutes);
app.use('/api/v1/hospital-master/lab-master', LabMasterRoutes);
app.use('/api/v1/hospital-master/ot-master', OtMasterRoutes);
app.use('/api/v1/document-master/admissionform-master', AdmissionFormRoutes);
app.use('/api/v1/document-master/dischargetemplate-master', DischargeTemplateRoute);
app.use('/api/v1/document-master/otnotestemplate-master', OtNotesTemplateRoute);
     
app.use(notFound);
app.use(errorHandler);


export default app;
