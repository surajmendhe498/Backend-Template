import { PATIENT_MASTER } from './patient_master.model.js';

class Patient_masterService {
  async getAll() {
    return await PATIENT_MASTER.find();
  }

  async create(data) {
    const patient = new PATIENT_MASTER(data);
    return await patient.save();
  }
}

export default new Patient_masterService();
