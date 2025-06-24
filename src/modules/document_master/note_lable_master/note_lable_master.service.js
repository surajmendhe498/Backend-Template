import { NOTELABLEMASTER_MODEL } from "./note_lable_master.model.js";

class Note_lable_masterService {
   
  async getAll() {
       return await NOTELABLEMASTER_MODEL.find();
     }
   
  async create(data) {
       const noteLable = new NOTELABLEMASTER_MODEL(data);
       return await noteLable.save(); 
     }
  
  async search(query) {
    const searchQuery = {};

    if (query.title) {
      searchQuery.title = { $regex: query.title, $options: 'i' }; 
    }

    if (query.otherTitle) {
      searchQuery.otherTitle = { $regex: query.otherTitle, $options: 'i' };
    }

    if (query.status) {
      searchQuery.status = query.status; 
    }

    return await NOTELABLEMASTER_MODEL.find(searchQuery);
  }
}

export default new Note_lable_masterService();
