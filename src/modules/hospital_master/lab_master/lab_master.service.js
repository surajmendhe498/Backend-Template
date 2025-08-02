import { LABMASTER_MODEL } from './lab_master.model.js';
import { FLOORMASTER_MODEL } from '../ward_or_floor_master/ward_or_floor_master.model.js';
import { DEPARTMENT_MODEL } from '../department/department.model.js';

class Lab_masterService {
  async getAll() {
    return await LABMASTER_MODEL.find()
    .populate('floorId', 'floorName')
    .populate('departmentId', 'name');
  }

async create(data) {
  const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
  if (!floorExists) throw new Error('Floor with given ID does not exist');

  const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
  if (!departmentExists) throw new Error('Department with given ID does not exist');

  const newLab = await LABMASTER_MODEL.create(data);

  return await LABMASTER_MODEL.findById(newLab._id)
    .populate('floorId', 'floorName')
    .populate('departmentId', 'name');
}

  async update(id, data) {
    if (data.floorId) {
      const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
      if (!floorExists) throw new Error('Floor with given ID does not exist');
    }

    if (data.departmentId) {
      const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
      if (!departmentExists) throw new Error('Department with given ID does not exist');
    }

    return await LABMASTER_MODEL.findByIdAndUpdate(id, data, { new: true })
      .populate('floorId', 'floorName')
      .populate('departmentId', 'name');
  }

  async search(filters) {
    const query = {};
    if (filters.labName) query.labName = { $regex: filters.labName, $options: 'i' };
    if (filters.departmentId) query.departmentId = filters.departmentId;
    if (filters.floorId) query.floorId = filters.floorId;
    if (filters.status !== undefined) query.status = filters.status;
    if (filters.assignedDoctor) query.assignedDoctor = { $regex: filters.assignedDoctor, $options: 'i' };
    if (filters.assistantDoctor) query.assistantDoctor = { $regex: filters.assistantDoctor, $options: 'i' };

    return await LABMASTER_MODEL.find(query)
      .populate('floorId', 'floorName')
      .populate('departmentId', 'name');
  }

async delete(id) {
  const deletedLab = await LABMASTER_MODEL.findByIdAndDelete(id);
  return deletedLab;
}

}

export default new Lab_masterService();
