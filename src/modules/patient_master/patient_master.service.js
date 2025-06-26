import { PATIENT_MASTER } from './patient_master.model.js';

class Patient_masterService {
  async getAll() {
    return await PATIENT_MASTER.find();
  }

  async create(data) {
    const patient = new PATIENT_MASTER(data);
    return await patient.save();
  }

  async search(filters) {
    const query = {};

    if (filters.patientName) query.patientName = new RegExp(filters.patientName, 'i'); 
    if (filters.doctor) query.doctor = new RegExp(filters.doctor, 'i'); 
    if (filters.status) query.status = new RegExp(filters.status, 'i')
    return await PATIENT_MASTER.find(query);
  }

  async getAdmittedPatients() {
    return await this.PATIENT_MASTER({ status: "Admitted" });
  }
  
  async getDischargedPatients() {
    return await this.PATIENT_MASTER({ status: "Discharged" });
  }
}

export default new Patient_masterService();
