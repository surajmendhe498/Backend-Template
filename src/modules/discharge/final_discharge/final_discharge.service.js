import { FINAL_DISCHARGE_MODEL } from "./final_discharge.model.js";
import { PATIENT_MODEL } from "../../patient/patient.model.js";
import { BEDMASTER_MODEL } from "../../hospital_master/bed_master/bed_master.model.js"; 

class Final_dischargeService {
   

  async getAll() {
    return await FINAL_DISCHARGE_MODEL.find()
      .populate('patientId', 'identityDetails.patientName');
  }

  // async create(data) {
  //   const { patientId, admissionId } = data;

  //   const patient = await PATIENT_MODEL.findById(patientId);
  //   if (!patient) {
  //     throw new Error("Patient not found");
  //   }

  //   const admission = patient.admissionDetails.id(admissionId);
  //   if (!admission) {
  //     throw new Error("Admission ID does not match this patient");
  //   }

  //   admission.patientStatus = "Discharged";
  //   await patient.save();

  //   return await FINAL_DISCHARGE_MODEL.create(data);
  // }

  async create(data) {
    const { patientId, admissionId, dateOfDischarge, timeOfDischarge } = data;

    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const admission = patient.admissionDetails.id(admissionId);
    if (!admission) {
      throw new Error("Admission ID does not match this patient");
    }

    // update patient status
    admission.patientStatus = "Discharged";
    admission.finalDischargeDate = dateOfDischarge;
    admission.finalDischargeTime = timeOfDischarge;
    await patient.save();

    // make bed vacant again
    if (admission.bedId) {
      await BEDMASTER_MODEL.findByIdAndUpdate(admission.bedId, {
        bedStatus: "Vacant"
      });
    }

    return await FINAL_DISCHARGE_MODEL.create(data);
  }


  async getById(id) {
    return await FINAL_DISCHARGE_MODEL.findById(id)
      .populate('patientId', 'identityDetails.patientName');
  }

}

export default new Final_dischargeService();
