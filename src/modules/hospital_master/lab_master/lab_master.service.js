import { LABMASTER_MODEL } from './lab_master.model.js';
import { FLOORMASTER_MODEL } from '../ward_or_floor_master/ward_or_floor_master.model.js';

class Lab_masterService {
  async getAll() {
    return await LABMASTER_MODEL.find().populate('floorId', 'floorName');
  }

  // async create(data) {
  //   const newLab = new LABMASTER_MODEL(data);
  //   return await newLab.save();
  // }

async create(data) {
  const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
  if (!floorExists) throw new Error('Floor with given ID does not exist');

  const newLab = new LABMASTER_MODEL(data);
  const savedLab = await newLab.save();
  return await savedLab.populate('floorId', 'floorName');
}


  // async update(id, data) {
  //   return await LABMASTER_MODEL.findByIdAndUpdate(id, data, { new: true });
  // }

  async update(id, data) {
  if (data.floorId) {
    const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
    if (!floorExists) throw new Error('Floor with given ID does not exist');
  }

  return await LABMASTER_MODEL.findByIdAndUpdate(id, data, { new: true }).populate('floorId', 'floorName');
}

  // async search(filters) {
  //   const query = {};
  //   if (filters.labName) query.labName = { $regex: filters.labName, $options: 'i' };
  //   if (filters.department) query.department = { $regex: filters.department, $options: 'i' }; 
  //   if (filters.floorNumber) query.floorNumber = filters.floorNumber;
  //   if (filters.status) query.status = filters.status;

  //   return await LABMASTER_MODEL.find(query);
  // }

  async search(filters) {
  const query = {};
  if (filters.labName) query.labName = { $regex: filters.labName, $options: 'i' };
  if (filters.department) query.department = { $regex: filters.department, $options: 'i' };
  if (filters.floorId) query.floorId = filters.floorId;
  if (filters.status) query.status = filters.status;

  return await LABMASTER_MODEL.find(query).populate('floorId', 'floorName');
}

}

export default new Lab_masterService();
