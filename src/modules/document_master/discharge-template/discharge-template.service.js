import { DISCHARGETEMPLATE_MODEL } from "./discharge-template.model.js";

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

  async getById(id) {
    return await DISCHARGETEMPLATE_MODEL.findById(id);
  }
}

export default DischargeTemplateService; 
