import { PATIENT_MODEL } from "./patient.model.js";

class PatientService {
  async getAll() {
    return PATIENT_MODEL.find();
  }

  async create(patientData){
      const patient= new PATIENT_MODEL(patientData);
      return await patient.save();
  }

  async update(patientId, patientData){
     return PATIENT_MODEL.findByIdAndUpdate(patientId, patientData, {new:true});
  }

  async delete(id){
    return PATIENT_MODEL.findByIdAndDelete(id);
  }

  async getById(id){
    return PATIENT_MODEL.findById(id);
  }
}

export default new PatientService();
