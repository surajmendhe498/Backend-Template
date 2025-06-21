import { IPD_Patient_Details } from "./ipd_patient_details.model.js";

class Ipd_patient_detailsService {

  async create(data) {
    const patient = new IPD_Patient_Details(data);
    return await patient.save();
  }

  async getAll() {
    return await IPD_Patient_Details.find();
  }
}

export default new Ipd_patient_detailsService();

