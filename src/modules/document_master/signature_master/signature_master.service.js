import { SIGNATUREMASTER_MODEL } from "./signature_master.model.js";

class Signature_masterService {
  async seedIfEmpty() {
  const count = await SIGNATUREMASTER_MODEL.countDocuments();
  if (count === 0) {
    const signatures = [
        {
          signatureTitle: "Relative / Witness",
          SignatureOtherTitle: '',
          status: false
        },
        {
          signatureTitle: "Patient / Guardian's",
          SignatureOtherTitle: '',
          status: false
        },
        {
          signatureTitle: "Reception",
          SignatureOtherTitle: '',
          status: false
        },
        {
          signatureTitle: "Interpreter / Nurse",
          SignatureOtherTitle: '',
          status: false
        },
        {
          signatureTitle: "Discharge Relative / Witness",
          SignatureOtherTitle: '',
          status: false
        },
        {
          signatureTitle: "Discharge Patient / Guardian's",
          SignatureOtherTitle: '',
          status: false
        },
        {
          signatureTitle: "Discharge Interpreter / Nurse",
          SignatureOtherTitle: '',
          status: false
        }
      ];
    await SIGNATUREMASTER_MODEL.insertMany(signatures);
  }
}

  async getAll() {
    return await SIGNATUREMASTER_MODEL.find().sort({ signatureTitle: 1 });
  }

  async getById(id) {
    return await SIGNATUREMASTER_MODEL.findById(id);
  }

  async update(id, updateData) {
    return await SIGNATUREMASTER_MODEL.findByIdAndUpdate(id, updateData, { new: true });
  }

  async create(data) {
    return await SIGNATUREMASTER_MODEL.create(data);
  }

  async delete(id) {
  return await SIGNATUREMASTER_MODEL.findByIdAndDelete(id);
}

}

export default new Signature_masterService();



