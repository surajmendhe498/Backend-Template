import { BEDMASTER_MODEL } from './bed_master.model.js';
import { FLOORMASTER_MODEL } from '../ward_or_floor_master/ward_or_floor_master.model.js';

class Bed_masterService {
  async getAll() {
    return await BEDMASTER_MODEL.find().populate('floorId', 'floorName');
  }

  // async create(data) {
  //   return await BEDMASTER_MODEL.create(data); 
  // }

  async create(data) {
  const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
  if (!floorExists) {
    throw new Error('Floor with given ID does not exist');
  }
  return (await BEDMASTER_MODEL.create(data)).populate('floorId', 'floorName');
}

  // async update(id, data) {
  //   return await BEDMASTER_MODEL.findByIdAndUpdate(id, data, { new: true }); 
  // }

  async update(id, data) {
  if (data.floorId) {
    const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
    if (!floorExists) {
      throw new Error('Floor with given ID does not exist');
    }
  }
  return await BEDMASTER_MODEL.findByIdAndUpdate(id, data, { new: true }).populate('floorId', 'floorName');
}

  async getBedsByStatus(status) {
    return await BEDMASTER_MODEL.find({ bedStatus: status }).populate('floorId', 'floorName');; 
  }

  async filterBeds(query) {
  const filters = {};

  filters.applicableClass = query.selectClass || query.applicableClass;
  filters.status = query.selectStatus || query.status;
  filters.bedStatus = query.selectOccupancy || query.bedStatus;

  Object.keys(filters).forEach((key) => {
    if (!filters[key]) delete filters[key];
  });

  return await BEDMASTER_MODEL.find(filters)
    .select('floorId bedName applicableClass bedStatus status')
    .populate('floorId', 'floorName');
}

}

export default new Bed_masterService();
