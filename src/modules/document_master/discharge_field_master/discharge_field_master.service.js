import { DISCHARGEFIELDMASTER_MODEL } from "./discharge_field_master.model.js";

class Discharge_field_masterService {

  async getAll() {
    return await DISCHARGEFIELDMASTER_MODEL.find();
  }

  async create(data){
    const dischargeField= new DISCHARGEFIELDMASTER_MODEL(data);
    return await dischargeField.save();
  }

  async search(query){
    const searchQuery= {};

    if(query.dischargeSummaryTitle){
      searchQuery.dischargeSummaryTitle= {$regex: query.dischargeSummaryTitle, $options: 'i'};
    }
    if(query.summarySection){
      searchQuery.summarySection= {$regex: query.summarySection, $options: 'i'};
    }
    if(query.status){
      searchQuery.status= query.status;
    }
    return await DISCHARGEFIELDMASTER_MODEL.find(searchQuery);
  }
}

export default new Discharge_field_masterService();
