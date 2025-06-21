import { LABMASTER_MODEL } from './lab_master.model.js';

class Lab_masterService {
  async getAll() {
    return await LABMASTER_MODEL.find();
  }

  async create(data) {
    const newLab = new LABMASTER_MODEL(data);
    return await newLab.save();
  }

  async update(id, data) {
    return await LABMASTER_MODEL.findByIdAndUpdate(id, data, { new: true });
  }

  async search(filters) {
    const query = {};
    if (filters.labName) query.labName = { $regex: filters.labName, $options: 'i' };
    if (filters.department) query.department = { $regex: filters.department, $options: 'i' }; 
    if (filters.floorNumber) query.floorNumber = filters.floorNumber;
    if (filters.status) query.status = filters.status;

    return await LABMASTER_MODEL.find(query);
  }
}

export default new Lab_masterService();
