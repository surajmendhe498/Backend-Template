 import { REFERRED_DOCTOR_MODEL } from "./referred_doctor.model.js";
 
 class Referred_doctorService {

  async getAll() {
    return await REFERRED_DOCTOR_MODEL.find();
  }

  async create(data){
    const referredDoctor= new REFERRED_DOCTOR_MODEL(data);
    return await referredDoctor.save();
  }
}

export default new Referred_doctorService();
