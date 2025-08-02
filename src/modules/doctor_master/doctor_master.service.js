import { DOCTOR_MODEL } from "./doctor_master.model.js";
import { DEPARTMENT_MODEL } from "../hospital_master/department/department.model.js";

class Doctor_masterService {
  async getAll() {
    return await DOCTOR_MODEL.find().populate("departmentId", "name");
  }

  async create(data) {
    const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
    if (!departmentExists) {
      throw new Error("Department with the given ID does not exist");
    }

    const newDoctor = new DOCTOR_MODEL(data);
    return (await newDoctor.save()).populate("departmentId", "name");
  }

  async filterByDepartment(departmentId) {
    const filter = departmentId ? { departmentId } : {};
    return await DOCTOR_MODEL.find(filter, {
      photo: 1,
      doctorName: 1,
      contactNo: 1,
      email: 1,
      hospitalLandline: 1,
      address: 1,
      dateOfJoin: 1,
      departmentId: 1,
    }).populate("departmentId", "name");
  }

  async getDoctorById(id) {
    return await DOCTOR_MODEL.findById(id, {
      photo: 1,
      doctorName: 1,
      contactNo: 1,
      email: 1,
      hospitalLandline: 1,
      address: 1,
      dateOfJoin: 1,
      departmentId: 1,
      education: 1,
      speciality: 1,
      city: 1,
      status: 1,
    }).populate("departmentId", "name");
  }

  async updateDoctor(id, updateData) {
    if (updateData.departmentId) {
      const departmentExists = await DEPARTMENT_MODEL.findById(updateData.departmentId);
      if (!departmentExists) {
        throw new Error("Department with the given ID does not exist");
      }
    }

    return await DOCTOR_MODEL.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("departmentId", "name");
  }

  async deleteDoctor(id) {
    return await DOCTOR_MODEL.findByIdAndDelete(id);
  }
}

export default new Doctor_masterService();
