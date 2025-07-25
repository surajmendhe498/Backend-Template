import { OTMASTER_MODEL } from './ot_master.model.js';
import { FLOORMASTER_MODEL } from '../ward_or_floor_master/ward_or_floor_master.model.js';

class Ot_masterService {
  async getAll() {
    return await OTMASTER_MODEL.find().populate('floorId', 'floorName');
  }

  // async create(data) {
  //   const newOTMaster = new OTMASTER_MODEL(data);
  //   return await newOTMaster.save();
  // }

  async create(data) {
    const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
    if (!floorExists) throw new Error('Floor with given ID does not exist');

    const newOTMaster = new OTMASTER_MODEL(data);
    const savedOT = await newOTMaster.save();
    return await savedOT.populate('floorId', 'floorName');
  }

  async update(id, data) {
    if (data.floorId) {
      const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
      if (!floorExists) throw new Error('Floor with given ID does not exist');
    }

    const updatedOT = await OTMASTER_MODEL.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('floorId', 'floorName');

    return updatedOT;
  }

  async delete(id){
    return await OTMASTER_MODEL.findByIdAndDelete(id);
  }

  async getById(id){
    return await OTMASTER_MODEL.findById(id);
  }
}

export default new Ot_masterService();
