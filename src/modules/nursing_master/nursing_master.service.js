import { NURSE_MODEL } from "./nursing_master.model.js";

class Nursing_masterService {
   

  async getAll() {
    return await NURSE_MODEL.find();
  }

  async create(data){
    const nurse= new NURSE_MODEL(data);
    return await nurse.save();
  }

  async filterByDepartment(department) {
  return await NURSE_MODEL.find(
    { department },
    {
      photo: 1,
      nurseName: 1,
      contactNo: 1,
      emailId: 1,
      address: 1,
      dateOfJoin: 1,
      department: 1,
      _id: 0, 
    }
  );
}

async getById(id) {
  return await NURSE_MODEL.findById(id);
}

async update(id, data) {
  return await NURSE_MODEL.findByIdAndUpdate(id, data, { new: true });
}

async delete(id) {
  return await NURSE_MODEL.findByIdAndDelete(id);
}


}

export default new Nursing_masterService();
