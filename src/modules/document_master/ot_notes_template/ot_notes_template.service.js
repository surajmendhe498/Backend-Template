import {OTNOTESTEMPLATE_MODEL} from './ot_notes_template.model.js';

class Ot_notes_templateService {

  async getAll() {
      return await OTNOTESTEMPLATE_MODEL.find();
    }
  
    async create(data) {
      const newTemplate = new OTNOTESTEMPLATE_MODEL(data);
      return await newTemplate.save(); 
    }
  
    async update(id, data){
      return await OTNOTESTEMPLATE_MODEL.findByIdAndUpdate(id, data, {new:true});
    }
  
    async delete(id){
      return OTNOTESTEMPLATE_MODEL.findByIdAndDelete(id);
    }
  
    async search(query) {
      const searchCriteria = {};
  
      if (query.templateName) {
        searchCriteria.templateName = { $regex: query.templateName, $options: 'i' }; 
      }
  
      return await OTNOTESTEMPLATE_MODEL.find(searchCriteria);
    }
}

export default new Ot_notes_templateService();
