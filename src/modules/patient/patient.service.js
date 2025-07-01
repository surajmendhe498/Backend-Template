import { PATIENT_MODEL } from '../patient/patient.model.js';
import { REFERRED_DOCTOR_MODEL } from '../doctor_master/referred_doctor/referred_doctor.model.js';

class PatientService {
  async getAll() {
    return await PATIENT_MODEL.find({});
  }

  async create(patientData) {

    if (patientData.admissionDetails.referredByDoctor) {
      const doctorExists = await REFERRED_DOCTOR_MODEL.findById(patientData.admissionDetails.referredByDoctor);

      if (!doctorExists) {
        throw new Error('Referred doctor does not exist');
      }
    }

    const patient = new PATIENT_MODEL(patientData);
    const savedPatient = await patient.save();

    return await PATIENT_MODEL.findById(savedPatient._id).populate('admissionDetails.referredByDoctor', 'doctorName');
  }
  

  async update(patientId, patientData) {
    return await PATIENT_MODEL.findByIdAndUpdate(patientId, patientData, {new: true });
  }

  async delete(id) {
    return await PATIENT_MODEL.findByIdAndDelete(id);
  }
  
   async getById(id) {
    return await PATIENT_MODEL.findById(id);
  }
}

export default new PatientService();
