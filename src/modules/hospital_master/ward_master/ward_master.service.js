import { WARDMASTER_MODEL } from './ward_master.model.js';
import { FLOORMASTER_MODEL } from '../ward_or_floor_master/ward_or_floor_master.model.js'; 

class Ward_masterService {
  async getAll() {
    return await WARDMASTER_MODEL.find().populate('floorId', 'floorName');
  }

  async getById(id) {
    return await WARDMASTER_MODEL.findById(id).populate('floorId', 'floorName');
  }

 async create(data) {
  const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
  if (!floorExists) {
    throw new Error('Floor with the given ID does not exist');
  }

  const newWard = await WARDMASTER_MODEL.create(data);
  return await newWard.populate('floorId', 'floorName');
}

  async update(id, data) {
    if (data.floorId) {
      const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
      if (!floorExists) {
        throw new Error('Floor with the given ID does not exist');
      }
    }

    return await WARDMASTER_MODEL.findByIdAndUpdate(id, data, { new: true }).populate('floorId', 'floorName');;
  }

  async delete(id) {
    return await WARDMASTER_MODEL.findByIdAndDelete(id);
  }
}

export default new Ward_masterService();
