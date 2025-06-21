import { OTMASTER_MODEL } from './ot_master.model.js';

class Ot_masterService {
  async getAll() {
    return await OTMASTER_MODEL.find({});
  }

  async create(data) {
    const newOTMaster = new OTMASTER_MODEL(data);
    return await newOTMaster.save();
  }
}

export default new Ot_masterService();
