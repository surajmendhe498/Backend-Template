import { FILERECORDING_MODEL } from './files_recordings.model.js';
import { PATIENT_MODEL } from '../patient/patient.model.js';

class Files_recordingsService {
 async uploadFiles({ patientId, admissionId, files }) {
    const data = {
      patientId,
      admissionId,
      docs: files.docs?.map(f => ({ name: f.originalname, path: f.path })) || [],
      labReports: files.labReports?.map(f => ({ name: f.originalname, path: f.path })) || [],
      audioRecordings: files.audioRecordings?.map(f => ({ name: f.originalname, path: f.path })) || [],
      videoRecordings: files.videoRecordings?.map(f => ({ name: f.originalname, path: f.path })) || []
    };

    const newRecord = await FILERECORDING_MODEL.create(data);

    await PATIENT_MODEL.updateOne(
  { _id: patientId, "admissionDetails._id": admissionId },
  {
    $push: {
      "admissionDetails.$.docs": { $each: data.docs },
      "admissionDetails.$.labReports": { $each: data.labReports },
      "admissionDetails.$.audioRecordings": { $each: data.audioRecordings },
      "admissionDetails.$.videoRecordings": { $each: data.videoRecordings }
    }
  }
);


    return newRecord;
  }
  async getAll() {
    return await FILERECORDING_MODEL.find().populate('patientId');
  }

  // async getByPatientId(patientId) {
  //   return await FILERECORDING_MODEL.find({ patientId }).populate('patientId');
  // }
  
  // async getByPatientId(patientId) {
  //   return await FILERECORDING_MODEL
  // .find({ patientId })
  // .select('-docs -labReports -audioRecordings -videoRecordings -__v')
  // .populate('patientId');
// }

  async getByPatientId(patientId) {
  return await FILERECORDING_MODEL
    .find({ patientId })
    .select('admissionId docs labReports audioRecordings videoRecordings')
    .populate('patientId', 'identityDetails.patientName'); 
}

  
}

export default new Files_recordingsService();
