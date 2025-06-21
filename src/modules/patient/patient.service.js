import { PATIENT_MODEL } from '../patient/patient.model.js';

class PatientService {
  async getAll() {
    return await PATIENT_MODEL.find({});
  }

  async create(patientData) {
    const patient = new PATIENT_MODEL(patientData);
    return await patient.save();
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
