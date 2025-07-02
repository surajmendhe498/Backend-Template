import { BEDMASTER_MODEL } from './bed_master.model.js';

class Bed_masterService {
  async getAll() {
    return await BEDMASTER_MODEL.find(); 
  }

  async create(data) {
    return await BEDMASTER_MODEL.create(data); 
  }

  async update(id, data) {
    return await BEDMASTER_MODEL.findByIdAndUpdate(id, data, { new: true }); 
  }

  async getBedsByStatus(status) {
    return await BEDMASTER_MODEL.find({ bedStatus: status }); 
  }

  async filterBeds(query) {
  const filters = {};

  filters.applicableClass = query.selectClass || query.applicableClass;
  filters.status = query.selectStatus || query.status;
  filters.bedStatus = query.selectOccupancy || query.bedStatus;

  Object.keys(filters).forEach((key) => {
    if (!filters[key]) delete filters[key];
  });

  return await BEDMASTER_MODEL.find(filters).select(
    'floorName bedName applicableClass bedStatus status'
  );
}


  async search(query) {
    const filters = {};
    if (query.floorName) filters.floorName = { $regex: query.floorName, $options: 'i' }; 
    if (query.bedName) filters.bedName = { $regex: query.bedName, $options: 'i' };
    if (query.applicableClass) filters.applicableClass = { $regex: query.applicableClass, $options: 'i' }; ;
    if (query.bedStatus) filters.bedStatus = { $regex: query.bedStatus, $options: 'i' }; 
    if (query.status) filters.status = { $regex: query.status, $options: 'i' }; 

    return await BEDMASTER_MODEL.find(filters); 
  }
}

export default new Bed_masterService();
