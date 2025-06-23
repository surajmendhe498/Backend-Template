import { DISCHARGETEMPLATE_MODEL } from "./discharge_template.model.js";

class DischargeTemplateService {
  async getAll() {
    return await DISCHARGETEMPLATE_MODEL.find();
  }

  async create(data) {
    const newTemplate = new DISCHARGETEMPLATE_MODEL(data);
    return await newTemplate.save(); 
  }

  async update(id, data){
    return await DISCHARGETEMPLATE_MODEL.findByIdAndUpdate(id, data, {new:true});
    
  }

  async delete(id){
    return DISCHARGETEMPLATE_MODEL.findByIdAndDelete(id);
  }

  async search(query) {
    const searchCriteria = {};

    if (query.templateName) {
      searchCriteria.templateName = { $regex: query.templateName, $options: 'i' }; 
    }

    return await DISCHARGETEMPLATE_MODEL.find(searchCriteria);
  }
}

export default DischargeTemplateService; 
