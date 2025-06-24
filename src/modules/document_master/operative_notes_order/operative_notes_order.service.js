import {OPERATIVENOTESORDER_MODEL} from './operative_notes_order.model.js';

class Operative_notes_orderService {

  async getAll() {
       return await OPERATIVENOTESORDER_MODEL.find();
     }
   
  async create(data) {
       const operativeNotes = new OPERATIVENOTESORDER_MODEL(data);
       return await operativeNotes.save(); 
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

    return await OPERATIVENOTESORDER_MODEL.find(searchQuery);
  }
}

export default new Operative_notes_orderService();
