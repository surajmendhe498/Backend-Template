import { FLOORMASTER_MODEL } from './word_or_floor_master.model.js';

class Word_or_floor_masterService {
  async getAll() {
    return await FLOORMASTER_MODEL.find(); 
  }

  async create(data) {
    return await FLOORMASTER_MODEL.create(data); 
  }

  async update(id, data) {
    return await FLOORMASTER_MODEL.findByIdAndUpdate(id, data, { new: true });
  }

  async search(query) {
    const filters = {};
    if (query.floorName) filters.floorName = { $regex: query.floorName, $options: 'i' }; 
    if (query.floorNumber) filters.floorNumber = query.floorNumber;
    if (query.status) filters.status = query.status;

    return await FLOORMASTER_MODEL.find(filters); 
  }
}

export default new Word_or_floor_masterService();
