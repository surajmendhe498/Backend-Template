 import { REFERRED_DOCTOR_MODEL } from "./referred_doctor.model.js";
 
 class Referred_doctorService {

  async getAll() {
    return await REFERRED_DOCTOR_MODEL.find();
  }

  async create(data){
    const referredDoctor= new REFERRED_DOCTOR_MODEL(data);
    return await referredDoctor.save();
  }

   async getById(id) {
    return await REFERRED_DOCTOR_MODEL.findById(id);
  }

  async update(id, data) {
    return await REFERRED_DOCTOR_MODEL.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await REFERRED_DOCTOR_MODEL.findByIdAndDelete(id);
  }
}

export default new Referred_doctorService();
