import {PATIENTADMISSION_MODEL} from './admission_form_master.model.js';

class Admission_form_masterService {

  async getAll() {
    return await PATIENTADMISSION_MODEL.find(); 
  }

  async create(data) {
    const newAdmissionField = new PATIENTADMISSION_MODEL(data);
    return await newAdmissionField.save(); 
  }

  async search(query) {
    const searchCriteria = {};
    
    if (query.fieldName) {
      searchCriteria.fieldName = { $regex: query.fieldName, $options: 'i' }; 
    }
    if (query.status) {
      searchCriteria.status = query.status;
    }
    if (query.isMandatory) {
      searchCriteria.isMandatory = query.isMandatory === 'true'; 
    }

    return await PATIENTADMISSION_MODEL.find(searchCriteria);
  }
}


export default new Admission_form_masterService();
