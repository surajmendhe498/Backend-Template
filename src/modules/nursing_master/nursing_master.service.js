import { NURSE_MODEL } from "./nursing_master.model.js";
import { DEPARTMENT_MODEL } from "../hospital_master/department/department.model.js";
import { WARDMASTER_MODEL } from "../hospital_master/ward_master/ward_master.model.js";

class Nursing_masterService {
  async getAll() {
    return await NURSE_MODEL.find()
      .populate('departmentId', 'name')
      .populate('wardId', 'wardName');
  }

 async create(data) {
  const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
  if (!departmentExists) throw new Error('Department with given ID does not exist');

  const wardExists = await WARDMASTER_MODEL.findById(data.wardId);
  if (!wardExists) throw new Error('Ward with given ID does not exist');

  const nurse = new NURSE_MODEL(data);
  const savedNurse = await nurse.save();

  return await NURSE_MODEL.findById(savedNurse._id)
    .populate('departmentId', 'name')
    .populate('wardId', 'wardName');
}


  async filterByDepartment(departmentId) {
    return await NURSE_MODEL.find(
      { departmentId },
      {
        photo: 1,
        nurseName: 1,
        contactNo: 1,
        emailId: 1,
        address: 1,
        dateOfJoin: 1,
        departmentId: 1,
        wardId: 1,
      }
    )
      .populate('departmentId', 'name')
      .populate('wardId', 'wardName');
  }

  async getById(id) {
    return await NURSE_MODEL.findById(id)
      .populate('departmentId', 'name')
      .populate('wardId', 'wardName');
  }

  async update(id, data) {
    const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
    if (!departmentExists) throw new Error('Department with given ID does not exist');

    const wardExists = await WARDMASTER_MODEL.findById(data.wardId);
    if (!wardExists) throw new Error('Ward with given ID does not exist');

    return await NURSE_MODEL.findByIdAndUpdate(id, data, { new: true })
      .populate('departmentId', 'name')
      .populate('wardId', 'wardName');
  }

  async delete(id) {
    return await NURSE_MODEL.findByIdAndDelete(id);
  }
}

export default new Nursing_masterService();
