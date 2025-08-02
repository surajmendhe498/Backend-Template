import { DEPARTMENT_MODEL } from "./department.model.js";

class DepartmentService {
  async getAll() {
    return await DEPARTMENT_MODEL.find();
  }

  async getById(id) {
    return await DEPARTMENT_MODEL.findById(id);
  }

  async create(data) {
    return await DEPARTMENT_MODEL.create(data);
  }

  async update(id, data) {
    return await DEPARTMENT_MODEL.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await DEPARTMENT_MODEL.findByIdAndDelete(id);
  }
}

export default new DepartmentService();
