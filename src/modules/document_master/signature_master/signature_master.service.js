import { SIGNATUREMASTER_MODEL } from "./signature_master.model.js";

class Signature_masterService {

  async getAll() {
    return await SIGNATUREMASTER_MODEL.find();
  }

  async create(data){
    const signatureMaster= new SIGNATUREMASTER_MODEL(data);
    return await signatureMaster.save();
  }

  async search(query){
    const searchQuery= {};

    if(query.signatureTitle){
      searchQuery.signatureTitle= {$regex: query.signatureTitle, $options: 'i'};
    }
    if(query.otherTitle){
      searchQuery.otherTitle= {$regex: query.otherTitle, $options: 'i'};
    }
    if(query.status){
      searchQuery.status= query.status;
    }
    return await SIGNATUREMASTER_MODEL.find(searchQuery);
  }
}

export default new Signature_masterService();
