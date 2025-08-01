import {OTNOTESTEMPLATE_MODEL} from './ot_notes_template.model.js';
import { DOCTOR_MODEL } from '../../doctor_master/doctor_master.model.js';
import { NURSE_MODEL } from '../../nursing_master/nursing_master.model.js';

class Ot_notes_templateService {

  async getAll() {
      return await OTNOTESTEMPLATE_MODEL.find()
      .populate('primarySurgeon', 'doctorName')
      .populate('associateSurgeon', 'doctorName')
      .populate('assistantSurgeon', 'doctorName')
      .populate('anaesthetist', 'doctorName')
      .populate('nurse', 'nurseName');
    }
  
//   async create(data) {
//   const doctorFields = ['primarySurgeon', 'associateSurgeon', 'assistantSurgeon', 'anaesthetist'];
//   for (const field of doctorFields) {
//     if (data[field]) {
//       const doctorExists = await DOCTOR_MODEL.findById(data[field]);
//       if (!doctorExists) {
//         const error = new Error(`Invalid Doctor ID in field: ${field}`);
//         error.statusCode = 404;
//         throw error;
//       }
//     }
//   }

//   if (data.nurse) {
//     const nurseExists = await NURSE_MODEL.findById(data.nurse);
//     if (!nurseExists) {
//       const error = new Error("Invalid Nurse ID");
//       error.statusCode = 404;
//       throw error;
//     }
//   }

//   const newTemplate = new OTNOTESTEMPLATE_MODEL(data);
//   const savedTemplate = await newTemplate.save();

//   return await OTNOTESTEMPLATE_MODEL.findById(savedTemplate._id)
//     .populate('primarySurgeon', 'doctorName')
//     .populate('associateSurgeon', 'doctorName')
//     .populate('assistantSurgeon', 'doctorName')
//     .populate('anaesthetist', 'doctorName')
//     .populate('nurse', 'nurseName');
// }
async create(data) {
  for (const key in data) {
    if (data[key] === '') {
      delete data[key];
    }
  }

  const doctorFields = ['primarySurgeon', 'associateSurgeon', 'assistantSurgeon', 'anaesthetist'];
  for (const field of doctorFields) {
    if (data[field]) {
      const doctorExists = await DOCTOR_MODEL.findById(data[field]);
      if (!doctorExists) {
        const error = new Error(`Invalid Doctor ID in field: ${field}`);
        error.statusCode = 404;
        throw error;
      }
    }
  }

  if (data.nurse) {
    const nurseExists = await NURSE_MODEL.findById(data.nurse);
    if (!nurseExists) {
      const error = new Error("Invalid Nurse ID");
      error.statusCode = 404;
      throw error;
    }
  }

  const newTemplate = await new OTNOTESTEMPLATE_MODEL(data).save();

  return await OTNOTESTEMPLATE_MODEL.findById(newTemplate._id)
    .populate('primarySurgeon', 'doctorName')
    .populate('associateSurgeon', 'doctorName')
    .populate('assistantSurgeon', 'doctorName')
    .populate('anaesthetist', 'doctorName')
    .populate('nurse', 'nurseName');
}


async update(id, data) {
  for (const key in data) {
    if (data[key] === '') {
      delete data[key];
    }
  }

  const doctorFields = ['primarySurgeon', 'associateSurgeon', 'assistantSurgeon', 'anaesthetist'];
  for (const field of doctorFields) {
    if (data[field]) {
      const doctorExists = await DOCTOR_MODEL.findById(data[field]);
      if (!doctorExists) {
        const error = new Error(`Invalid Doctor ID in field: ${field}`);
        error.statusCode = 404;
        throw error;
      }
    }
  }

  if (data.nurse) {
    const nurseExists = await NURSE_MODEL.findById(data.nurse);
    if (!nurseExists) {
      const error = new Error("Invalid Nurse ID");
      error.statusCode = 404;
      throw error;
    }
  }

  return await OTNOTESTEMPLATE_MODEL.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate('primarySurgeon', 'doctorName')
    .populate('associateSurgeon', 'doctorName')
    .populate('assistantSurgeon', 'doctorName')
    .populate('anaesthetist', 'doctorName')
    .populate('nurse', 'nurseName');
}

  
  async delete(id){
      return OTNOTESTEMPLATE_MODEL.findByIdAndDelete(id);
    }
  
  async getById(id) {
    return await OTNOTESTEMPLATE_MODEL.findById(id)
      .populate('primarySurgeon', 'doctorName')
      .populate('associateSurgeon', 'doctorName')
      .populate('assistantSurgeon', 'doctorName')
      .populate('anaesthetist', 'doctorName')
      .populate('nurse', 'nurseName');
  }
}

export default new Ot_notes_templateService();
