 import { DOCTOR_MODEL } from "./doctor_master.model.js";

 class Doctor_masterService {

  async getAll() {
    return await DOCTOR_MODEL.find();
  }

  async create(data){
    const newDoctor= new DOCTOR_MODEL(data);
    return await newDoctor.save();
  }

   async filterByDepartment(department) {
    const filter = department ? { department } : {}; 
    return await DOCTOR_MODEL.find(filter, {
      photo: 1,
      doctorName: 1,
      contactNo: 1,
      email: 1,
      hospitalLandline: 1,
      address: 1,
      dateOfJoin: 1,
      department: 1,
    });
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
    department: 1,
    education: 1,
    speciality: 1,
    city: 1,
    status: 1,
  });
}

async updateDoctor(id, updateData) {
  return await DOCTOR_MODEL.findByIdAndUpdate(id, updateData, { new: true });
}

async deleteDoctor(id) {
  return await DOCTOR_MODEL.findByIdAndDelete(id);
}

}

export default new Doctor_masterService();
