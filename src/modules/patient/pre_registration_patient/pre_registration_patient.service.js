import { PRE_REGISTRATION_MODEL } from './pre_registration_patient.model.js';

class PreRegistrationService {
  async create(data) {
    return await PRE_REGISTRATION_MODEL.create(data);
  }

  async getAll() {
    return await PRE_REGISTRATION_MODEL.find();
  }

}

export default new PreRegistrationService();
